"use client";

import dynamic from "next/dynamic";

/** Client-only, like the field map loaders: Leaflet needs `window`. Fills its
 *  (positioned) parent so a caption can be layered on top. */
export const OperationTrackMapLoader = dynamic(
  () => import("./operation-track-map").then((m) => m.OperationTrackMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-surface-2">
        <p className="text-sm text-muted-foreground">Cargando seguimiento…</p>
      </div>
    ),
  },
);
