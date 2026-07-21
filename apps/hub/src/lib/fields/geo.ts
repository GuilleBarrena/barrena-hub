import type { Field, GeoJSONFeature, LatLng } from "./types";

const EARTH_RADIUS_M = 6378137;
const toRad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Spherical-excess area of a lat/lng ring, in m². Accurate enough for field
 * boundaries at this scale; a planar shoelace over raw degrees would not be,
 * since a degree of longitude shrinks with latitude.
 */
export function ringAreaM2(ring: LatLng[]): number {
  if (ring.length < 3) return 0;

  let total = 0;
  for (let i = 0; i < ring.length; i++) {
    const [lat1, lng1] = ring[i];
    const [lat2, lng2] = ring[(i + 1) % ring.length];
    total +=
      toRad(lng2 - lng1) * (2 + Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)));
  }

  return Math.abs((total * EARTH_RADIUS_M * EARTH_RADIUS_M) / 2);
}

export function ringAreaHectares(ring: LatLng[]): number {
  return ringAreaM2(ring) / 10_000;
}

/** Display formatting stays in es-ES: the UI is Spanish. */
export function formatHectares(ha: number): string {
  return `${ha.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ha`;
}

/** Simple vertex-average centroid - used only to place map labels. */
export function ringCentroid(ring: LatLng[]): LatLng {
  if (ring.length === 0) return [0, 0];
  const sum = ring.reduce<[number, number]>(
    (acc, [lat, lng]) => [acc[0] + lat, acc[1] + lng],
    [0, 0],
  );
  return [sum[0] / ring.length, sum[1] / ring.length];
}

/** GeoJSON wants [lng, lat] and an explicitly closed ring. */
export function toGeoJSON(field: Field): GeoJSONFeature {
  const coords: [number, number][] = field.ring.map(([lat, lng]) => [lng, lat]);
  if (coords.length > 0) coords.push(coords[0]);

  return {
    type: "Feature",
    geometry: { type: "Polygon", coordinates: [coords] },
    properties: {
      id: field.id,
      name: field.name,
      cropType: field.cropType,
      areaHectares: Number(field.areaHectares.toFixed(4)),
    },
  };
}
