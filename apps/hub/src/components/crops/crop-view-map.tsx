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
import type { Crop } from "@/lib/crops/types";
import type { NearbyStation } from "@/lib/pws/types";

/** Reads the resolved value of a design token, so markers track the theme
 *  instead of hardcoding a colour. */
function tokenColor(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

/**
 * Read-only counterpart to CropMap: renders one crop and frames it, filling
 * whatever container it is dropped into so the parent can overlay cards on top
 * (a full-screen, Google-Maps-style view). Zoom and scale controls are pushed
 * to the bottom-left corner, which the overlays deliberately leave clear.
 *
 * It can also plot nearby PWS stations as points. The map stays presentational:
 * it receives the already-derived `stations` and the `activeStationId`, and
 * reports hover back through `onStationHover`. It never learns where the
 * stations came from — deriving them is the caller's job.
 */
export function CropViewMap({
  crop,
  stations = [],
  activeStationId = null,
  onStationHover,
}: {
  crop: Crop;
  stations?: NearbyStation[];
  activeStationId?: string | null;
  onStationHover?: (id: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const labelsRef = useRef<L.TileLayer | null>(null);
  const shapeRef = useRef<L.Polygon | null>(null);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());
  // Kept in a ref so the marker event handlers (bound once, when markers are
  // created) always call the latest callback without re-binding every render.
  const hoverRef = useRef(onStationHover);
  useEffect(() => {
    hoverRef.current = onStationHover;
  }, [onStationHover]);

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

    // Transparent place-name overlay for basemaps that have no labels of their
    // own (satellite). Added after the base so it draws on top of the imagery,
    // but still under the crop polygon, which lives in a higher pane.
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
    if (!map || crop.ring.length < 3) return;

    shapeRef.current?.remove();
    const polygon = L.polygon(crop.ring, {
      className: "crop-shape",
      weight: 2,
      fillOpacity: 0.25,
    }).addTo(map);
    shapeRef.current = polygon;
  }, [crop]);

  // Station markers + framing. Kept together because the frame has to hold the
  // crop and every station at once, so it depends on both.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || crop.ring.length < 3) return;

    const accent = tokenColor("--brand-accent", "#c2703d");

    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    for (const station of stations) {
      const marker = L.circleMarker(station.location, {
        radius: 6,
        weight: 2,
        color: "#ffffff",
        fillColor: accent,
        fillOpacity: 1,
      })
        .addTo(map)
        .bindTooltip(station.name, { direction: "top", offset: [0, -6] });

      marker.on("mouseover", () => hoverRef.current?.(station.id));
      marker.on("mouseout", () => hoverRef.current?.(null));
      markersRef.current.set(station.id, marker);
    }

    // Frame the crop, extended to include every station so the points are on
    // screen the moment the crop opens.
    const bounds = L.latLngBounds(crop.ring);
    stations.forEach((s) => bounds.extend(s.location));
    map.fitBounds(bounds, { padding: [56, 56] });
  }, [crop, stations]);

  // Reflect the active station: enlarge and recolour its marker, and pan it
  // into view. Hovering a card upstream is what drives this.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const primary = tokenColor("--brand-primary", "#3b5a3b");
    const accent = tokenColor("--brand-accent", "#c2703d");

    markersRef.current.forEach((marker, id) => {
      const active = id === activeStationId;
      marker.setStyle({ fillColor: active ? primary : accent, radius: active ? 9 : 6 });
      if (active) marker.bringToFront();
    });

    if (activeStationId) {
      const marker = markersRef.current.get(activeStationId);
      if (marker) map.panTo(marker.getLatLng(), { animate: true });
    }
  }, [activeStationId]);

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
