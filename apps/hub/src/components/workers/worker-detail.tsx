"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DetailList, StatusBadge } from "@/components/dashboard/primitives";
import { Button } from "@/components/ui/button";
import { getWorkerRepository } from "@/lib/workers/repository";
import { WORKER_STATUS, type Worker } from "@/lib/workers/types";

type State =
  | { status: "loading" }
  | { status: "found"; worker: Worker }
  | { status: "missing" };

export function WorkerDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let active = true;
    getWorkerRepository()
      .get(params.id)
      .then((worker) => {
        if (!active) return;
        setState(worker ? { status: "found", worker } : { status: "missing" });
      })
      .catch(() => active && setState({ status: "missing" }));
    return () => {
      active = false;
    };
  }, [params.id]);

  if (state.status === "loading") {
    return <p className="text-sm text-muted-foreground">Cargando operario…</p>;
  }

  if (state.status === "missing") {
    return (
      <div className="rounded-2xl bg-card p-6 ring-1 ring-black/5">
        <p className="text-sm font-medium text-foreground">Operario no encontrado</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Puede que se añadiera en otro navegador: los registros propios se guardan
          únicamente en este dispositivo.
        </p>
        <Button asChild variant="secondary" className="mt-4">
          <Link href="/dashboard/workers">Volver al listado</Link>
        </Button>
      </div>
    );
  }

  const { worker } = state;
  const meta = WORKER_STATUS[worker.status];

  async function remove() {
    await getWorkerRepository().remove(worker.id);
    router.push("/dashboard/workers");
    router.refresh();
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          {worker.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {worker.role} · {worker.crew}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-card p-5 ring-1 ring-black/5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Ficha</h2>
          <DetailList
            items={[
              ["Puesto", worker.role],
              ["Cuadrilla", worker.crew],
              ["Teléfono", worker.phone || "—"],
              [
                "Alta",
                new Date(worker.createdAt).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }),
              ],
              ["Origen", worker.source === "sample" ? "Datos de muestra" : "Añadido"],
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

          {worker.source === "user" && (
            <button
              type="button"
              onClick={remove}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground outline-none transition-colors
                         hover:text-red-600 focus-visible:ring-2 focus-visible:ring-ring"
            >
              Eliminar operario
            </button>
          )}
        </aside>
      </div>
    </>
  );
}
