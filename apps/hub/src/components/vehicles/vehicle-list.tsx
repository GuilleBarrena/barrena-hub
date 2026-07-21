"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { StatusBadge } from "@/components/dashboard/primitives";
import { ResourceTable, type Column } from "@/components/dashboard/resource-table";
import { Button } from "@barrena/ui/button";
import { getVehicleRepository } from "@/lib/vehicles/repository";
import { VEHICLE_STATUS, type Vehicle } from "@/lib/vehicles/types";

const COLUMNS: Column<Vehicle>[] = [
  { header: "Vehículo", cell: (v) => v.name },
  { header: "Tipo", cell: (v) => v.vehicleType, className: "text-muted-foreground" },
  { header: "Matrícula", cell: (v) => v.plate, className: "tabular-nums text-muted-foreground" },
  {
    header: "Horas motor",
    cell: (v) => v.engineHours.toLocaleString("es-ES"),
    className: "tabular-nums text-muted-foreground",
  },
  {
    header: "Estado",
    cell: (v) => (
      <StatusBadge level={VEHICLE_STATUS[v.status].level} label={VEHICLE_STATUS[v.status].label} />
    ),
  },
];

export function VehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);

  const load = useCallback(() => {
    getVehicleRepository()
      .list()
      .then(setVehicles)
      .catch(() => setVehicles([]));
  }, []);

  useEffect(load, [load]);

  // null = not loaded yet. Storage is browser-only, so the first paint has
  // nothing to show and must not claim the list is empty.
  if (vehicles === null) {
    return <p className="text-sm text-muted-foreground">Cargando vehículos…</p>;
  }

  const operational = vehicles.filter((v) => v.status === "operational").length;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {vehicles.length} {vehicles.length === 1 ? "vehículo" : "vehículos"} ·{" "}
          {operational} operativos
        </p>
        <Button asChild>
          <Link href="/vehicles/new">Añadir vehículo</Link>
        </Button>
      </div>

      <ResourceTable
        rows={vehicles}
        columns={COLUMNS}
        hrefFor={(v) => `/vehicles/${v.id}`}
        onDelete={async (v) => {
          await getVehicleRepository().remove(v.id);
          load();
        }}
        minWidth={680}
      />

      <p className="mt-6 text-[11px] text-muted-foreground">
        Los vehículos marcados como muestra son datos de ejemplo. Los que añada se
        guardan únicamente en este navegador.
      </p>
    </>
  );
}
