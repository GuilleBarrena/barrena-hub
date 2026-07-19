"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DetailList, StatusBadge } from "@/components/dashboard/primitives";
import { Button } from "@/components/ui/button";
import { getVehicleRepository } from "@/lib/vehicles/repository";
import { VEHICLE_STATUS, type Vehicle } from "@/lib/vehicles/types";

type State =
  | { status: "loading" }
  | { status: "found"; vehicle: Vehicle }
  | { status: "missing" };

export function VehicleDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let active = true;
    getVehicleRepository()
      .get(params.id)
      .then((vehicle) => {
        if (!active) return;
        setState(vehicle ? { status: "found", vehicle } : { status: "missing" });
      })
      .catch(() => active && setState({ status: "missing" }));
    return () => {
      active = false;
    };
  }, [params.id]);

  if (state.status === "loading") {
    return <p className="text-sm text-muted-foreground">Cargando vehículo…</p>;
  }

  if (state.status === "missing") {
    return (
      <div className="rounded-2xl bg-card p-6 ring-1 ring-black/5">
        <p className="text-sm font-medium text-foreground">Vehículo no encontrado</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Puede que se añadiera en otro navegador: los registros propios se guardan
          únicamente en este dispositivo.
        </p>
        <Button asChild variant="secondary" className="mt-4">
          <Link href="/dashboard/vehicles">Volver al listado</Link>
        </Button>
      </div>
    );
  }

  const { vehicle } = state;
  const meta = VEHICLE_STATUS[vehicle.status];

  async function remove() {
    await getVehicleRepository().remove(vehicle.id);
    router.push("/dashboard/vehicles");
    router.refresh();
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          {vehicle.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {vehicle.vehicleType} · {vehicle.plate}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-card p-5 ring-1 ring-black/5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Ficha</h2>
          <DetailList
            items={[
              ["Tipo", vehicle.vehicleType],
              ["Matrícula", vehicle.plate],
              ["Horas motor", `${vehicle.engineHours.toLocaleString("es-ES")} h`],
              [
                "Alta",
                new Date(vehicle.createdAt).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }),
              ],
              ["Origen", vehicle.source === "sample" ? "Datos de muestra" : "Añadido"],
            ]}
          />
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl bg-card p-5 ring-1 ring-black/5 shadow-sm">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">Estado</h2>
            <div className="mt-3 text-sm">
              <StatusBadge level={meta.level} label={meta.label} />
            </div>
          </div>

          {vehicle.source === "user" && (
            <button
              type="button"
              onClick={remove}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground outline-none transition-colors
                         hover:text-red-600 focus-visible:ring-2 focus-visible:ring-ring"
            >
              Eliminar vehículo
            </button>
          )}
        </aside>
      </div>
    </>
  );
}
