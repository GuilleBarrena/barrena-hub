/**
 * Geo helpers for the PWS layer.
 *
 * "Which stations are near a field" is answered by the provider (see
 * `providers/weather-underground.ts`) off the field's centroid — this file
 * only holds the small geo utilities the client and the provider share.
 */

import type { LatLng } from "@/lib/fields/types";

const EARTH_RADIUS_M = 6_371_000;
const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance between two [lat, lng] points, in metres. Used as a
 *  fallback when the provider doesn't hand back a distance of its own. */
export function haversineMeters(a: LatLng, b: LatLng): number {
  const [lat1, lng1] = a;
  const [lat2, lng2] = b;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(s));
}

/** Human distance: metres under 1 km, otherwise one-decimal km, es-ES. */
export function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 })} km`;
}
