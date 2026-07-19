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
import { FARM_CENTER, INITIAL_ZOOM } from "@/lib/fields/seed";
import type { Field, LatLng } from "@/lib/fields/types";

export function FieldMap({
  points,
  onAddPoint,
  onCloseRing,
  closed,
  existing = [],
}: {
  points: LatLng[];
  onAddPoint: (p: LatLng) => void;
  onCloseRing: () => void;
  closed: boolean;
  existing?: Field[];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const drawLayerRef = useRef<L.LayerGroup | null>(null);
  const existingLayerRef = useRef<L.LayerGroup | null>(null);

  const [providerId, setProviderId] = useState<MapProviderId>(DEFAULT_MAP_PROVIDER_ID);

  // The map click handler is bound once, so it must read the *current*
  // callbacks rather than the ones captured at mount. Syncing happens in an
  // effect, never during render: a render can be discarded and replayed.
  const handlers = useRef({ onAddPoint, closed });
  useEffect(() => {
    handlers.current = { onAddPoint, closed };
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: FARM_CENTER,
      zoom: INITIAL_ZOOM,
    });
    mapRef.current = map;

    existingLayerRef.current = L.layerGroup().addTo(map);
    drawLayerRef.current = L.layerGroup().addTo(map);
    L.control.scale({ imperial: false }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      if (handlers.current.closed) return;
      handlers.current.onAddPoint([e.latlng.lat, e.latlng.lng]);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Basemap swap: driven entirely by the provider descriptor.
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

  // Existing fields, as muted context beneath the one being drawn.
  useEffect(() => {
    const layer = existingLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    for (const f of existing) {
      if (f.ring.length < 3) continue;
      L.polygon(f.ring, {
        className: "field-context",
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.08,
      })
        .bindTooltip(`${f.name} · ${f.cropType}`, { direction: "center" })
        .addTo(layer);
    }
  }, [existing]);

  // The polygon under construction.
  useEffect(() => {
    const layer = drawLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    if (points.length > 1) {
      const shape = closed
        ? L.polygon(points, { className: "field-shape", weight: 2, fillOpacity: 0.25 })
        : L.polyline(points, { className: "field-shape", weight: 2 });
      shape.addTo(layer);
    }

    points.forEach((p, i) => {
      const isFirst = i === 0;
      const marker = L.circleMarker(p, {
        radius: isFirst && !closed ? 7 : 5,
        className: "field-vertex",
        weight: 2,
        fillOpacity: 1,
      }).addTo(layer);

      // Clicking the first vertex closes the ring - the conventional gesture.
      if (isFirst && !closed && points.length >= 3) {
        marker
          .bindTooltip("Cerrar polígono", { direction: "top" })
          .on("click", (e) => {
            L.DomEvent.stopPropagation(e);
            onCloseRing();
          });
      }
    });
  }, [points, closed, onCloseRing]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="h-[420px] w-full overflow-hidden rounded-xl ring-1 ring-black/10 md:h-[520px]"
        // Leaflet needs the container to have height before it initialises.
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
