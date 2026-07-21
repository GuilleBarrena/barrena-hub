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
import type { TrackPoint } from "@/lib/operations/types";

/**
 * Renders a vehicle's pass over its field: the parcel outline for context, plus
 * the GPS trace drawn on top with start and end markers. Frames the field so
 * the whole plot is in view. Read-only, fills its positioned parent the same
 * way FieldViewMap does, so a caption can float over it.
 */
export function OperationTrackMap({
  field,
  track,
}: {
  field: Field;
  track: TrackPoint[];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const labelsRef = useRef<L.TileLayer | null>(null);
  const overlayRef = useRef<L.LayerGroup | null>(null);

  const [providerId, setProviderId] = useState<MapProviderId>(DEFAULT_MAP_PROVIDER_ID);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, { zoomControl: false });
    mapRef.current = map;
    L.control.zoom({ position: "bottomleft" }).addTo(map);
    L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

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

    labelsRef.current?.remove();
    labelsRef.current = null;
    if (provider.labelsUrl) {
      labelsRef.current = L.tileLayer(provider.labelsUrl, {
        maxZoom: provider.maxZoom,
      }).addTo(map);
    }
  }, [providerId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    overlayRef.current?.remove();
    const group = L.layerGroup().addTo(map);
    overlayRef.current = group;

    // The parcel outline sits underneath as context - muted, so the trace reads
    // as the subject.
    let framingBounds: L.LatLngBounds | null = null;
    if (field.ring.length >= 3) {
      const polygon = L.polygon(field.ring, {
        color: "#ffffff",
        weight: 1.5,
        opacity: 0.7,
        fillOpacity: 0.05,
        dashArray: "4 4",
      }).addTo(group);
      framingBounds = polygon.getBounds();
    }

    if (track.length > 0) {
      const latlngs = track.map((p) => p.at);
      const line = L.polyline(latlngs, {
        color: "#f97316",
        weight: 3,
        opacity: 0.95,
      }).addTo(group);

      const start = latlngs[0];
      const end = latlngs[latlngs.length - 1];
      L.circleMarker(start, {
        radius: 6,
        color: "#ffffff",
        weight: 2,
        fillColor: "#16a34a",
        fillOpacity: 1,
      })
        .bindTooltip("Inicio", { direction: "top" })
        .addTo(group);
      L.circleMarker(end, {
        radius: 6,
        color: "#ffffff",
        weight: 2,
        fillColor: "#dc2626",
        fillOpacity: 1,
      })
        .bindTooltip("Fin", { direction: "top" })
        .addTo(group);

      framingBounds = framingBounds
        ? framingBounds.extend(line.getBounds())
        : line.getBounds();
    }

    if (framingBounds && framingBounds.isValid()) {
      map.fitBounds(framingBounds, { padding: [40, 40] });
    }
  }, [field, track]);

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
