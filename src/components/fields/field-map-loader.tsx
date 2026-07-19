"use client";

import dynamic from "next/dynamic";

/**
 * Leaflet touches `window` at import time, so the map is loaded client-side
 * only. `ssr: false` is not allowed in Server Components, which is why this
 * wrapper exists and is itself a Client Component.
 */
export const FieldMapLoader = dynamic(
  () => import("./field-map").then((m) => m.FieldMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] w-full items-center justify-center rounded-xl bg-surface-2 ring-1 ring-black/10 md:h-[520px]">
        <p className="text-sm text-muted-foreground">Cargando mapa…</p>
      </div>
    ),
  },
);
