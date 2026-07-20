import type { LatLng } from "@/lib/fields/types";
import type { TrackPoint } from "./types";

const EARTH_RADIUS_M = 6_371_000;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Great-circle distance between two [lat, lng] points, in metres. */
function haversineMetres([lat1, lng1]: LatLng, [lat2, lng2]: LatLng): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(a)));
}

export interface TrackStats {
  points: number;
  /** Total path length in kilometres. */
  distanceKm: number;
  /** Elapsed time from first to last fix, in minutes. */
  durationMin: number;
  startTime: string;
  endTime: string;
}

/** Summary figures for a vehicle track, or null when there is nothing to show. */
export function trackStats(track: TrackPoint[] | undefined): TrackStats | null {
  if (!track || track.length < 2) return null;

  let metres = 0;
  for (let i = 1; i < track.length; i++) {
    metres += haversineMetres(track[i - 1].at, track[i].at);
  }

  const start = new Date(track[0].time).getTime();
  const end = new Date(track[track.length - 1].time).getTime();

  return {
    points: track.length,
    distanceKm: metres / 1000,
    durationMin: Math.max(0, Math.round((end - start) / 60_000)),
    startTime: track[0].time,
    endTime: track[track.length - 1].time,
  };
}
