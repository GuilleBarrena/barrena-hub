import { SAMPLE_CROPS } from "@/lib/crops/seed";
import type { Crop, LatLng } from "@/lib/crops/types";
import type { Operation, TrackPoint } from "./types";

/**
 * SAMPLE operations. These wire together the sample operators, crops and
 * vehicles so the list and detail views have something to show. Not a real
 * work log.
 */

const cropById = (id: string): Crop | undefined =>
  SAMPLE_CROPS.find((f) => f.id === id);

/**
 * Fabricate a plausible vehicle pass over a crop: back-and-forth rows across
 * its bounding box, inset from the edges so the trace sits inside the plot.
 * Real telemetry would replace this wholesale; it exists only so the tracking
 * map has a line to draw.
 */
function serpentineTrack(
  ring: LatLng[],
  { passes, startISO, minutesPerRow }: { passes: number; startISO: string; minutesPerRow: number },
): TrackPoint[] {
  const lats = ring.map((p) => p[0]);
  const lngs = ring.map((p) => p[1]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // Inset 12% so the pass reads as inside the parcel, not tracing its border.
  const insetLat = (maxLat - minLat) * 0.12;
  const insetLng = (maxLng - minLng) * 0.12;
  const left = minLng + insetLng;
  const right = maxLng - insetLng;

  const points: TrackPoint[] = [];
  const startMs = new Date(startISO).getTime();
  let pointIndex = 0;

  for (let row = 0; row < passes; row++) {
    // Evenly spaced rows from bottom to top of the inset box.
    const t = passes === 1 ? 0.5 : row / (passes - 1);
    const lat = minLat + insetLat + t * (maxLat - minLat - 2 * insetLat);
    // Alternate sweep direction each row, like a tractor turning at the headland.
    const [from, to] = row % 2 === 0 ? [left, right] : [right, left];
    const steps = 6;
    for (let s = 0; s <= steps; s++) {
      const lng = from + (to - from) * (s / steps);
      const time = new Date(
        startMs + pointIndex * ((minutesPerRow * 60_000) / (steps + 1)),
      ).toISOString();
      points.push({ at: [lat, lng], time });
      pointIndex++;
    }
  }

  return points;
}

const ring01 = cropById("f-sample-01")?.ring ?? [];
const ring02 = cropById("f-sample-02")?.ring ?? [];
const ring07 = cropById("f-sample-07")?.ring ?? [];

export const SAMPLE_OPERATIONS: Operation[] = [
  {
    id: "op-sample-01",
    name: "Pulverización Parcela 01",
    operationType: "Pulverización",
    operatorId: "w-sample-02",
    cropId: "f-sample-01",
    vehicleId: "v-sample-06",
    status: "completed",
    scheduledFor: "2026-07-15",
    notes: "Tratamiento fungicida preventivo antes de la ola de calor.",
    track: serpentineTrack(ring01, {
      passes: 6,
      startISO: "2026-07-15T06:30:00.000Z",
      minutesPerRow: 12,
    }),
    createdAt: "2026-07-14T09:00:00.000Z",
    source: "sample",
  },
  {
    id: "op-sample-02",
    name: "Siembra Parcela 02",
    operationType: "Siembra",
    operatorId: "w-sample-05",
    cropId: "f-sample-02",
    vehicleId: "v-sample-01",
    status: "in-progress",
    scheduledFor: "2026-07-20",
    notes: "Siembra de cereal de invierno. Densidad estándar.",
    track: serpentineTrack(ring02, {
      passes: 5,
      startISO: "2026-07-20T05:45:00.000Z",
      minutesPerRow: 15,
    }),
    createdAt: "2026-07-18T11:30:00.000Z",
    source: "sample",
  },
  {
    id: "op-sample-03",
    name: "Laboreo Parcela 07",
    operationType: "Laboreo",
    operatorId: "w-sample-02",
    cropId: "f-sample-07",
    vehicleId: "v-sample-04",
    status: "planned",
    scheduledFor: "2026-07-24",
    track: serpentineTrack(ring07, {
      passes: 4,
      startISO: "2026-07-24T06:00:00.000Z",
      minutesPerRow: 18,
    }),
    createdAt: "2026-07-19T08:15:00.000Z",
    source: "sample",
  },
  {
    id: "op-sample-04",
    name: "Inspección Parcela 04",
    operationType: "Poda",
    operatorId: "w-sample-03",
    cropId: "f-sample-04",
    // No vehicle: a walking crop inspection needs no machine, and therefore
    // has no track to draw.
    vehicleId: null,
    status: "planned",
    scheduledFor: "2026-07-22",
    notes: "Revisión de viñedo a pie, sin maquinaria.",
    createdAt: "2026-07-19T08:20:00.000Z",
    source: "sample",
  },
];
