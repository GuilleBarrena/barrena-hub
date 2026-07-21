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

/**
 * A place to fly the map to. `seq` is bumped on every search so re-selecting
 * the same location still moves the map.
 */
export interface MapFocus {
  center: LatLng;
  bounds?: [LatLng, LatLng];
  seq: number;
}

export function FieldMap({
  points,
  onAddPoint,
  onCloseRing,
  closed,
  existing = [],
  focus,
}: {
  points: LatLng[];
  onAddPoint: (p: LatLng) => void;
  onCloseRing: () => void;
  closed: boolean;
  existing?: Field[];
  focus?: MapFocus;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const labelsRef = useRef<L.TileLayer | null>(null);
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
      zoomControl: false,
    });
    mapRef.current = map;

    existingLayerRef.current = L.layerGroup().addTo(map);
    drawLayerRef.current = L.layerGroup().addTo(map);
    // Controls live in the bottom-left corner, which the overlay panels leave
    // clear, so the map reads as full-screen with cards floating over it.
    L.control.zoom({ position: "bottomleft" }).addTo(map);
    L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

    // The container is sized by the parent (a viewport-height box); recompute
    // once the layout has settled.
    requestAnimationFrame(() => map.invalidateSize());

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

    // Transparent place-name overlay for basemaps that have no labels of their
    // own (satellite), so towns stay findable while drawing. It sits above the
    // imagery but below the field vectors, which live in a higher pane.
    labelsRef.current?.remove();
    labelsRef.current = null;
    if (provider.labelsUrl) {
      labelsRef.current = L.tileLayer(provider.labelsUrl, {
        maxZoom: provider.maxZoom,
      }).addTo(map);
    }
  }, [providerId]);

  // Fly to a searched location. Prefer the bounding box so a town frames as a
  // town and a single address as a close-up, falling back to a fixed zoom.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focus) return;

    if (focus.bounds) {
      map.flyToBounds(focus.bounds, { maxZoom: 17, duration: 1.1 });
    } else {
      map.flyTo(focus.center, 16, { duration: 1.1 });
    }
  }, [focus]);

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
    <>
      <div
        ref={containerRef}
        className="absolute inset-0 z-0"
        // Leaflet needs the container to have height before it initialises;
        // the positioned parent provides it.
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
