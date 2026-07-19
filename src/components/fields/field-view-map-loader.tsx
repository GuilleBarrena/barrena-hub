"use client";

import dynamic from "next/dynamic";

/** Client-only, for the same reason as FieldMapLoader: Leaflet needs window. */
export const FieldViewMapLoader = dynamic(
  () => import("./field-view-map").then((m) => m.FieldViewMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[360px] w-full items-center justify-center rounded-xl bg-surface-2 ring-1 ring-black/10 md:h-[480px]">
        <p className="text-sm text-muted-foreground">Cargando mapa…</p>
      </div>
    ),
  },
);
