import type { StoredEntity } from "@/lib/storage/local-repository";

/**
 * Status is a code union, not a display string, because it drives colour and
 * badge logic. Free-text attributes (type) store their Spanish label directly,
 * the same way a field stores its crop.
 */
export type VehicleStatus = "operational" | "maintenance" | "out-of-service";

export interface Vehicle extends StoredEntity {
  name: string;
  vehicleType: string;
  plate: string;
  status: VehicleStatus;
  engineHours: number;
}

export type NewVehicle = Omit<Vehicle, keyof StoredEntity>;

export const VEHICLE_TYPES = [
  "Tractor",
  "Cosechadora",
  "Pulverizador",
  "Remolque",
  "Todoterreno",
];

/** Spanish labels + the alert level each status maps to. */
export const VEHICLE_STATUS: Record<
  VehicleStatus,
  { label: string; level: "good" | "warning" | "serious" }
> = {
  operational: { label: "Operativo", level: "good" },
  maintenance: { label: "En mantenimiento", level: "warning" },
  "out-of-service": { label: "Fuera de servicio", level: "serious" },
};
