import type { MaintenanceRecord } from "./types";

/**
 * SAMPLE maintenance history. Keyed to the sample vehicles in
 * `@/lib/vehicles/seed` by `vehicleId`. Not a real service register.
 */
export const SAMPLE_MAINTENANCE: MaintenanceRecord[] = [
  {
    id: "m-sample-01",
    vehicleId: "v-sample-01",
    date: "2026-06-12",
    type: "Cambio de aceite",
    engineHours: 3000,
    cost: 210,
    notes: "Aceite y filtro de aceite.",
    createdAt: "2026-06-12T09:00:00.000Z",
    source: "sample",
  },
  {
    id: "m-sample-02",
    vehicleId: "v-sample-01",
    date: "2026-03-04",
    type: "Revisión general",
    engineHours: 2680,
    cost: 480,
    notes: "Revisión de las 2500 horas.",
    createdAt: "2026-03-04T09:00:00.000Z",
    source: "sample",
  },
  {
    id: "m-sample-03",
    vehicleId: "v-sample-03",
    date: "2026-07-01",
    type: "Reparación",
    engineHours: 4010,
    cost: 1250,
    notes: "Sustitución de la bomba hidráulica.",
    createdAt: "2026-07-01T09:00:00.000Z",
    source: "sample",
  },
  {
    id: "m-sample-04",
    vehicleId: "v-sample-05",
    date: "2026-05-20",
    type: "Frenos",
    engineHours: 5180,
    cost: 640,
    notes: "Pastillas y discos delanteros.",
    createdAt: "2026-05-20T09:00:00.000Z",
    source: "sample",
  },
];
