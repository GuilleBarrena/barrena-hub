"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ResourceTable, type Column } from "@/components/dashboard/resource-table";
import { Button } from "@barrena/ui/button";
import { formatHectares } from "@/lib/crops/geo";
import { getCropRepository } from "@/lib/crops/repository";
import type { Crop } from "@/lib/crops/types";

const COLUMNS: Column<Crop>[] = [
  { header: "Parcela", cell: (f) => f.name },
  { header: "Cultivo", cell: (f) => f.cropType, className: "text-muted-foreground" },
  {
    header: "Superficie",
    cell: (f) => formatHectares(f.areaHectares),
    className: "tabular-nums text-muted-foreground",
  },
  {
    header: "Origen",
    cell: (f) => (
      <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {f.source === "sample" ? "Muestra" : "Dibujada"}
      </span>
    ),
  },
];

export function CropList() {
  const [crops, setCrops] = useState<Crop[] | null>(null);

  const load = useCallback(() => {
    getCropRepository()
      .list()
      .then(setCrops)
      .catch(() => setCrops([]));
  }, []);

  useEffect(load, [load]);

  // null = not loaded yet. Storage is browser-only, so the first paint has
  // nothing to show and must not claim the list is empty.
  if (crops === null) {
    return <p className="text-sm text-muted-foreground">Cargando parcelas…</p>;
  }

  const totalHectares = crops.reduce((sum, f) => sum + f.areaHectares, 0);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {crops.length} {crops.length === 1 ? "parcela" : "parcelas"} ·{" "}
          {formatHectares(totalHectares)} en total
        </p>
        <Button asChild>
          <Link href="/crops/new">Añadir parcela</Link>
        </Button>
      </div>

      <ResourceTable
        rows={crops}
        columns={COLUMNS}
        hrefFor={(f) => `/crops/${f.id}`}
        onDelete={async (f) => {
          await getCropRepository().remove(f.id);
          load();
        }}
      />

      <p className="mt-6 text-[11px] text-muted-foreground">
        Las parcelas marcadas como muestra son datos de ejemplo. Las que dibuje se
        guardan únicamente en este navegador.
      </p>
    </>
  );
}
