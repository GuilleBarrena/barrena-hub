"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { StatusBadge } from "@/components/dashboard/primitives";
import { ResourceTable, type Column } from "@/components/dashboard/resource-table";
import { Button } from "@barrena/ui/button";
import { getWorkerRepository } from "@/lib/workers/repository";
import { WORKER_STATUS, type Worker } from "@/lib/workers/types";

const COLUMNS: Column<Worker>[] = [
  { header: "Operario", cell: (w) => w.name },
  { header: "Puesto", cell: (w) => w.role, className: "text-muted-foreground" },
  { header: "Cuadrilla", cell: (w) => w.crew, className: "text-muted-foreground" },
  { header: "Teléfono", cell: (w) => w.phone, className: "tabular-nums text-muted-foreground" },
  {
    header: "Estado",
    cell: (w) => (
      <StatusBadge level={WORKER_STATUS[w.status].level} label={WORKER_STATUS[w.status].label} />
    ),
  },
];

export function WorkerList() {
  const [workers, setWorkers] = useState<Worker[] | null>(null);

  const load = useCallback(() => {
    getWorkerRepository()
      .list()
      .then(setWorkers)
      .catch(() => setWorkers([]));
  }, []);

  useEffect(load, [load]);

  if (workers === null) {
    return <p className="text-sm text-muted-foreground">Cargando operarios…</p>;
  }

  const active = workers.filter((w) => w.status === "active").length;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {workers.length} {workers.length === 1 ? "operario" : "operarios"} · {active}{" "}
          {active === 1 ? "activo" : "activos"}
        </p>
        <Button asChild>
          <Link href="/dashboard/workers/new">Añadir operario</Link>
        </Button>
      </div>

      <ResourceTable
        rows={workers}
        columns={COLUMNS}
        hrefFor={(w) => `/dashboard/workers/${w.id}`}
        onDelete={async (w) => {
          await getWorkerRepository().remove(w.id);
          load();
        }}
        minWidth={720}
      />

      <p className="mt-6 text-[11px] text-muted-foreground">
        Los operarios marcados como muestra son personas inventadas para desarrollo.
        Los que añada se guardan únicamente en este navegador.
      </p>
    </>
  );
}
