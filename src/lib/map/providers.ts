/**
 * Map provider registry.
 *
 * The map component never names a provider directly - it renders whichever
 * descriptor the selector hands back. Swapping basemap (or moving to a keyed
 * provider) means editing this file only.
 *
 * Adding a vector provider (MapLibre) later means adding `kind: "vector"` with
 * a `styleUrl`, and branching once inside the map component.
 */

export type MapProviderId = "esri-satellite" | "esri-topo" | "osm";

export interface RasterMapProvider {
  id: MapProviderId;
  kind: "raster";
  label: string;
  tileUrl: string;
  attribution: string;
  maxZoom: number;
  /** Set when the provider needs a token; read from env, never hardcoded. */
  requiresApiKey?: boolean;
}

export type MapProvider = RasterMapProvider;

export const MAP_PROVIDERS: Record<MapProviderId, MapProvider> = {
  "esri-satellite": {
    id: "esri-satellite",
    kind: "raster",
    label: "Satélite",
    tileUrl:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Imagery © Esri, Maxar, Earthstar Geographics",
    maxZoom: 19,
  },
  "esri-topo": {
    id: "esri-topo",
    kind: "raster",
    label: "Topográfico",
    tileUrl:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri",
    maxZoom: 19,
  },
  osm: {
    id: "osm",
    kind: "raster",
    label: "Callejero",
    tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors",
    maxZoom: 19,
  },
};

export const DEFAULT_MAP_PROVIDER_ID: MapProviderId =
  (process.env.NEXT_PUBLIC_MAP_PROVIDER as MapProviderId | undefined) ??
  "esri-satellite";

export function getMapProvider(id: MapProviderId = DEFAULT_MAP_PROVIDER_ID): MapProvider {
  return MAP_PROVIDERS[id] ?? MAP_PROVIDERS["esri-satellite"];
}

/** Providers offered in the basemap switcher, in display order. */
export const SELECTABLE_PROVIDERS: MapProviderId[] = [
  "esri-satellite",
  "esri-topo",
  "osm",
];
