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

/** Read-only counterpart to FieldMap: renders one field and frames it. */
export function FieldViewMap({ field }: { field: Field }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const shapeRef = useRef<L.Polygon | null>(null);

  const [providerId, setProviderId] = useState<MapProviderId>(DEFAULT_MAP_PROVIDER_ID);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current);
    mapRef.current = map;
    L.control.scale({ imperial: false }).addTo(map);

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
    map.fitBounds(polygon.getBounds(), { padding: [24, 24] });
  }, [field]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="h-[360px] w-full overflow-hidden rounded-xl ring-1 ring-black/10 md:h-[480px]"
        style={{ background: "#e8e6e1" }}
      />

      <div className="pointer-events-none absolute right-3 top-3 z-[400] flex gap-1 rounded-lg bg-background/95 p-1 shadow-sm ring-1 ring-black/10">
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
    </div>
  );
}
