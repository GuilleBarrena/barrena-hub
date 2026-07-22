"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { StatusBadge } from "@/components/dashboard/primitives";
import { OperationTrackMapLoader } from "@/components/operations/operation-track-map-loader";
import { Button } from "@barrena/ui/button";
import type { Crop } from "@/lib/crops/types";
import { getOperationRepository } from "@/lib/operations/repository";
import { loadOperationRefs, type OperationRefs } from "@/lib/operations/references";
import { trackStats } from "@/lib/operations/track";
import { OPERATION_STATUS, type Operation } from "@/lib/operations/types";

type State =
  | { status: "loading" }
  | { status: "found"; operation: Operation; refs: OperationRefs }
  | { status: "missing" };

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

/** Key/value list whose values may be links, so the ficha can point to the
 *  operator, crop and vehicle detail pages. */
function InfoList({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="mt-4 flex flex-col gap-3 text-sm">
      {items.map(([k, v]) => (
        <div key={k} className="flex items-baseline justify-between gap-4">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {k}
          </dt>
          <dd className="text-right text-foreground">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function refLink(href: string, label: string) {
  return (
    <Link
      href={href}
      className="rounded font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
    >
      {label}
    </Link>
  );
}

export function OperationDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let active = true;
    Promise.all([getOperationRepository().get(params.id), loadOperationRefs()])
      .then(([operation, refs]) => {
        if (!active) return;
        setState(
          operation ? { status: "found", operation, refs } : { status: "missing" },
        );
      })
      .catch(() => active && setState({ status: "missing" }));
    return () => {
      active = false;
    };
  }, [params.id]);

  if (state.status === "loading") {
    return <p className="text-sm text-muted-foreground">Cargando operación…</p>;
  }

  if (state.status === "missing") {
    return (
      <div className="rounded-2xl bg-card p-6 ring-1 ring-black/5">
        <p className="text-sm font-medium text-foreground">Operación no encontrada</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Puede que se añadiera en otro navegador: los registros propios se guardan
          únicamente en este dispositivo.
        </p>
        <Button asChild variant="secondary" className="mt-4">
          <Link href="/operations">Volver al listado</Link>
        </Button>
      </div>
    );
  }

  const { operation, refs } = state;
  const meta = OPERATION_STATUS[operation.status];
  const operator = refs.workers.get(operation.operatorId);
  const vehicle = operation.vehicleId ? refs.vehicles.get(operation.vehicleId) : undefined;
  const crop: Crop | undefined = refs.crops.get(operation.cropId);
  const stats = trackStats(operation.track);
  const canTrack = Boolean(vehicle && crop && operation.track && operation.track.length > 0);

  async function remove() {
    await getOperationRepository().remove(operation.id);
    router.push("/operations");
    router.refresh();
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          {operation.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {operation.operationType} · {formatDate(operation.scheduledFor)}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-card p-5 ring-1 ring-black/5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Ficha</h2>
          <InfoList
            items={[
              ["Tipo", operation.operationType],
              [
                "Parcela",
                crop ? refLink(`/crops/${crop.id}`, crop.name) : "—",
              ],
              [
                "Operario",
                operator
                  ? refLink(`/workers/${operator.id}`, operator.name)
                  : "—",
              ],
              [
                "Vehículo",
                vehicle ? (
                  refLink(`/vehicles/${vehicle.id}`, vehicle.name)
                ) : (
                  <span className="text-muted-foreground">Sin vehículo</span>
                ),
              ],
              ["Fecha", formatDate(operation.scheduledFor)],
              [
                "Alta",
                new Date(operation.createdAt).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }),
              ],
              ["Origen", operation.source === "sample" ? "Datos de muestra" : "Añadida"],
            ]}
          />

          {operation.notes && (
            <div className="mt-5 border-t border-foreground/5 pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Notas
              </p>
              <p className="mt-2 text-sm text-foreground">{operation.notes}</p>
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl bg-card p-5 ring-1 ring-black/5 shadow-sm">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">Estado</h2>
            <div className="mt-3 text-sm">
              <StatusBadge level={meta.level} label={meta.label} />
            </div>
          </div>

          {stats && (
            <div className="rounded-2xl bg-card p-5 ring-1 ring-black/5 shadow-sm">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Seguimiento
              </h2>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
                {(
                  [
                    ["Distancia", `${stats.distanceKm.toFixed(1)} km`],
                    ["Duración", `${stats.durationMin} min`],
                    ["Inicio", formatTime(stats.startTime)],
                    ["Fin", formatTime(stats.endTime)],
                  ] as [string, string][]
                ).map(([k, v]) => (
                  <div key={k} className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {k}
                    </span>
                    <span className="text-base font-semibold tabular-nums text-foreground">
                      {v}
                    </span>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {operation.source === "user" && (
            <button
              type="button"
              onClick={remove}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground outline-none transition-colors
                         hover:text-red-600 focus-visible:ring-2 focus-visible:ring-ring"
            >
              Eliminar operación
            </button>
          )}
        </aside>
      </div>

      {/* Vehicle tracking. Only a machine on a known parcel with reported fixes
          has a pass to draw. */}
      <div className="mt-4">
        <div className="rounded-2xl bg-card p-5 ring-1 ring-black/5 shadow-sm">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Seguimiento del vehículo
          </h2>

          {canTrack && crop ? (
            <>
              <p className="mt-1 text-[12px] text-muted-foreground">
                Recorrido de {vehicle?.name} sobre {crop.name}.
              </p>
              <div className="relative mt-4 h-[420px] overflow-hidden rounded-xl bg-surface-2 ring-1 ring-black/5">
                <OperationTrackMapLoader crop={crop} track={operation.track ?? []} />
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              {vehicle
                ? "Este vehículo aún no ha registrado un recorrido para esta operación."
                : "Operación sin vehículo asignado: no hay recorrido que mostrar."}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
