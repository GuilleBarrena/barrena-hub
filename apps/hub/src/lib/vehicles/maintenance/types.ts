import type { StoredEntity } from "@/lib/storage/local-repository";

/**
 * A single maintenance intervention logged against a vehicle. Records share
 * one storage collection and are filtered by `vehicleId`, the same way a
 * relational table would foreign-key back to the vehicle.
 *
 * `type` stores its Spanish label directly (like a vehicle's type or a
 * crop's cropType) rather than a code union - it never drives colour logic.
 */
export interface MaintenanceRecord extends StoredEntity {
  vehicleId: string;
  /** Date the work was carried out, as YYYY-MM-DD. */
  date: string;
  type: string;
  /** Engine hours read at the time of the intervention. */
  engineHours: number;
  /** Cost in euros. Zero when not recorded. */
  cost: number;
  notes: string;
}

export type NewMaintenanceRecord = Omit<MaintenanceRecord, keyof StoredEntity>;

export const MAINTENANCE_TYPES = [
  "Cambio de aceite",
  "Cambio de filtros",
  "Revisión general",
  "Neumáticos",
  "Frenos",
  "Reparación",
  "Otros",
];
