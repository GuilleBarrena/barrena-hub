/** [lat, lng] - the order Leaflet uses, kept consistent end to end. */
export type LatLng = [number, number];

export interface Field {
  id: string;
  name: string;
  cropType: string;
  /**
   * Outer ring, open (the closing vertex is implied, not stored). GeoJSON
   * output re-closes it.
   */
  ring: LatLng[];
  areaHectares: number;
  createdAt: string;
  /** Distinguishes seeded demo rows from ones the user drew. */
  source: "sample" | "user";
}

export type NewField = Omit<Field, "id" | "createdAt" | "areaHectares" | "source">;

/** GeoJSON Polygon, [lng, lat] per the spec - deliberately the reverse of LatLng. */
export interface GeoJSONPolygon {
  type: "Polygon";
  coordinates: [number, number][][];
}

export interface GeoJSONFeature {
  type: "Feature";
  geometry: GeoJSONPolygon;
  properties: Record<string, unknown>;
}
