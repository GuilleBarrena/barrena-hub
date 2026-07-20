"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";

import {
  DEFAULT_MAP_PROVIDER_ID,
  getMapProvider,
  MAP_PROVIDERS,
  SELECTABLE_PROVIDERS,
  type MapProviderId,
} from "@/lib/map/providers";
import type { Field } from "@/lib/fields/types";

/**
 * Read-only counterpart to FieldMap: renders one field and frames it, filling
 * whatever container it is dropped into so the parent can overlay cards on top
 * (a full-screen, Google-Maps-style view). Zoom and scale controls are pushed
 * to the bottom-left corner, which the overlays deliberately leave clear.
 */
export function FieldViewMap({ field }: { field: Field }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const shapeRef = useRef<L.Polygon | null>(null);

  const [providerId, setProviderId] = useState<MapProviderId>(DEFAULT_MAP_PROVIDER_ID);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, { zoomControl: false });
    mapRef.current = map;
    L.control.zoom({ position: "bottomleft" }).addTo(map);
    L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

    // The container is sized by the parent (a viewport-height box); recompute
    // once the layout has settled so tiles and framing use the real size.
    requestAnimationFrame(() => map.invalidateSize());

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const provider = getMapProvider(providerId);
    tileRef.current?.remove();
    tileRef.current = L.tileLayer(provider.tileUrl, {
      attribution: provider.attribution,
      maxZoom: provider.maxZoom,
    }).addTo(map);
    tileRef.current.bringToBack();
  }, [providerId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || field.ring.length < 3) return;

    shapeRef.current?.remove();
    const polygon = L.polygon(field.ring, {
      className: "field-shape",
      weight: 2,
      fillOpacity: 0.25,
    }).addTo(map);
    shapeRef.current = polygon;

    // Frame the field rather than guessing a centre and zoom.
    map.fitBounds(polygon.getBounds(), { padding: [48, 48] });
  }, [field]);

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0 z-0"
        style={{ background: "#e8e6e1" }}
      />

      <div className="pointer-events-none absolute right-3 top-3 z-[500] flex gap-1 rounded-lg bg-background/95 p-1 shadow-sm ring-1 ring-black/10 backdrop-blur">
        {SELECTABLE_PROVIDERS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setProviderId(id)}
            aria-pressed={providerId === id}
            className={`pointer-events-auto rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              providerId === id
                ? "bg-brand-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {MAP_PROVIDERS[id].label}
          </button>
        ))}
      </div>
    </>
  );
}
