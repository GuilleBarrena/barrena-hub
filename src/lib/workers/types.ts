import type { StoredEntity } from "@/lib/storage/local-repository";

export type WorkerStatus = "active" | "leave" | "inactive";

export interface Worker extends StoredEntity {
  name: string;
  role: string;
  phone: string;
  crew: string;
  status: WorkerStatus;
}

export type NewWorker = Omit<Worker, keyof StoredEntity>;

export const WORKER_ROLES = [
  "Tractorista",
  "Capataz",
  "Peón agrícola",
  "Técnico de campo",
  "Encargado",
];

export const WORKER_CREWS = ["Cuadrilla A", "Cuadrilla B", "Cuadrilla C", "Sin asignar"];

/** Spanish labels + the alert level each status maps to. */
export const WORKER_STATUS: Record<
  WorkerStatus,
  { label: string; level: "good" | "warning" | "serious" }
> = {
  active: { label: "Activo", level: "good" },
  leave: { label: "De baja", level: "serious" },
  inactive: { label: "Inactivo", level: "warning" },
};
