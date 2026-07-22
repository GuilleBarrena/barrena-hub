"use client";

import dynamic from "next/dynamic";

/**
 * Leaflet touches `window` at import time, so the map is loaded client-side
 * only. `ssr: false` is not allowed in Server Components, which is why this
 * wrapper exists and is itself a Client Component. Fills its (positioned)
 * parent so drawing controls and the form can be overlaid on top.
 */
export const CropMapLoader = dynamic(
  () => import("./crop-map").then((m) => m.CropMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-surface-2">
        <p className="text-sm text-muted-foreground">Cargando mapa…</p>
      </div>
    ),
  },
);
