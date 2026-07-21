import type { LatLng } from "@/lib/fields/types";
import type { StoredEntity } from "@/lib/storage/local-repository";

/**
 * An operation is the link between an operator (worker), a field, and
 * optionally a vehicle: the record of a task carried out on a parcel. When a
 * vehicle is assigned it can carry a GPS track, so the pass is drawn on the map.
 *
 * Status is a code union, not a display string, because it drives colour and
 * badge logic. `operationType` stores its Spanish label directly, the same way
 * a vehicle stores its type or a field its crop.
 */
export type OperationStatus =
  | "planned"
  | "in-progress"
  | "completed"
  | "cancelled";

/** A single GPS fix along a vehicle's pass. Reuses the field [lat, lng] order. */
export interface TrackPoint {
  /** [lat, lng] - the order Leaflet uses, kept consistent end to end. */
  at: LatLng;
  /** ISO timestamp of the fix. */
  time: string;
}

export interface Operation extends StoredEntity {
  name: string;
  operationType: string;
  /** Worker who runs the operation. Always set. */
  operatorId: string;
  /** Parcel the operation is carried out on. Always set. */
  fieldId: string;
  /** Machine assigned, if any. Null when the work needs no vehicle. */
  vehicleId: string | null;
  status: OperationStatus;
  /** Day the operation is planned for / took place, as an ISO date (YYYY-MM-DD). */
  scheduledFor: string;
  notes?: string;
  /**
   * Vehicle GPS trace for the operation, oldest fix first. Only present when a
   * vehicle is assigned and has reported telemetry; user-created operations
   * start without one.
   */
  track?: TrackPoint[];
}

export type NewOperation = Omit<Operation, keyof StoredEntity>;

export const OPERATION_TYPES = [
  "Siembra",
  "Pulverización",
  "Abonado",
  "Laboreo",
  "Cosecha",
  "Riego",
  "Poda",
];

/** Spanish labels + the alert level each status maps to. */
export const OPERATION_STATUS: Record<
  OperationStatus,
  { label: string; level: "good" | "warning" | "serious" }
> = {
  planned: { label: "Planificada", level: "warning" },
  "in-progress": { label: "En curso", level: "good" },
  completed: { label: "Completada", level: "good" },
  cancelled: { label: "Cancelada", level: "serious" },
};
