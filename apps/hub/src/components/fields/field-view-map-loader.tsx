"use client";

import dynamic from "next/dynamic";

/** Client-only, for the same reason as FieldMapLoader: Leaflet needs window.
 *  Fills its (positioned) parent so overlays can be layered on top. */
export const FieldViewMapLoader = dynamic(
  () => import("./field-view-map").then((m) => m.FieldViewMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-surface-2">
        <p className="text-sm text-muted-foreground">Cargando mapa…</p>
      </div>
    ),
  },
);
