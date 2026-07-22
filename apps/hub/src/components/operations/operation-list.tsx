"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { StatusBadge } from "@/components/dashboard/primitives";
import { ResourceTable, type Column } from "@/components/dashboard/resource-table";
import { Button } from "@barrena/ui/button";
import { getOperationRepository } from "@/lib/operations/repository";
import { loadOperationRefs, type OperationRefs } from "@/lib/operations/references";
import { OPERATION_STATUS, type Operation } from "@/lib/operations/types";

/** ISO date (YYYY-MM-DD) as a short Spanish date. */
function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function columns(refs: OperationRefs): Column<Operation>[] {
  return [
    { header: "Operación", cell: (o) => o.name },
    { header: "Tipo", cell: (o) => o.operationType, className: "text-muted-foreground" },
    {
      header: "Cultivo",
      cell: (o) => refs.crops.get(o.cropId)?.name ?? "—",
      className: "text-muted-foreground",
    },
    {
      header: "Operario",
      cell: (o) => refs.workers.get(o.operatorId)?.name ?? "—",
      className: "text-muted-foreground",
    },
    {
      header: "Vehículo",
      cell: (o) =>
        o.vehicleId ? (
          refs.vehicles.get(o.vehicleId)?.name ?? "—"
        ) : (
          <span className="text-muted-foreground/60">Sin vehículo</span>
        ),
      className: "text-muted-foreground",
    },
    {
      header: "Fecha",
      cell: (o) => formatDate(o.scheduledFor),
      className: "tabular-nums text-muted-foreground",
    },
    {
      header: "Estado",
      cell: (o) => (
        <StatusBadge
          level={OPERATION_STATUS[o.status].level}
          label={OPERATION_STATUS[o.status].label}
        />
      ),
    },
  ];
}

export function OperationList() {
  const [operations, setOperations] = useState<Operation[] | null>(null);
  const [refs, setRefs] = useState<OperationRefs | null>(null);

  const load = useCallback(() => {
    Promise.all([getOperationRepository().list(), loadOperationRefs()])
      .then(([ops, r]) => {
        setOperations(ops);
        setRefs(r);
      })
      .catch(() => {
        setOperations([]);
        setRefs({ workers: new Map(), vehicles: new Map(), crops: new Map() });
      });
  }, []);

  useEffect(load, [load]);

  // null = not loaded yet. Storage is browser-only, so the first paint has
  // nothing to show and must not claim the list is empty.
  if (operations === null || refs === null) {
    return <p className="text-sm text-muted-foreground">Cargando operaciones…</p>;
  }

  const active = operations.filter(
    (o) => o.status === "in-progress" || o.status === "planned",
  ).length;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {operations.length} {operations.length === 1 ? "operación" : "operaciones"} ·{" "}
          {active} activas
        </p>
        <Button asChild>
          <Link href="/operations/new">Añadir operación</Link>
        </Button>
      </div>

      <ResourceTable
        rows={operations}
        columns={columns(refs)}
        hrefFor={(o) => `/operations/${o.id}`}
        onDelete={async (o) => {
          await getOperationRepository().remove(o.id);
          load();
        }}
        minWidth={860}
      />

      <p className="mt-6 text-[11px] text-muted-foreground">
        Las operaciones marcadas como muestra son datos de ejemplo. Las que añada se
        guardan únicamente en este navegador.
      </p>
    </>
  );
}
