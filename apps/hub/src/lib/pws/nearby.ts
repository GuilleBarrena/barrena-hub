/**
 * Resolving which stations sit near a field.
 *
 * This is the whole "which stations show up" story: it is derived purely from
 * the field's position, exactly as WU's real flow works (centroid -> "give me
 * the ones around here"). No configuration decides it — settings only holds the
 * provider/credential used to *fetch*, never the list itself.
 */

import { ringCentroid } from "@/lib/fields/geo";
import type { Field, LatLng } from "@/lib/fields/types";
import { SAMPLE_STATIONS } from "./seed";
import type { NearbyStation, PwsStation } from "./types";

const EARTH_RADIUS_M = 6_371_000;
const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance between two [lat, lng] points, in metres. */
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

/**
 * Stations near a field, nearest first. `radiusM` caps the neighbourhood;
 * `limit` keeps the list card-sized. Both have sane defaults so callers can
 * pass just the field.
 */
export function stationsNearField(
  field: Field,
  {
    stations = SAMPLE_STATIONS,
    radiusM = 12_000,
    limit = 5,
  }: { stations?: PwsStation[]; radiusM?: number; limit?: number } = {},
): NearbyStation[] {
  const center = ringCentroid(field.ring);
  return stations
    .map((station) => ({
      ...station,
      distanceM: haversineMeters(center, station.location),
    }))
    .filter((station) => station.distanceM <= radiusM)
    .sort((a, b) => a.distanceM - b.distanceM)
    .slice(0, limit);
}
