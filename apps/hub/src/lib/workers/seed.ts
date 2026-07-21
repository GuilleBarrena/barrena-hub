import type { Worker } from "./types";

/**
 * SAMPLE workers. These are invented people for UI development - not real
 * personnel records. Phone numbers use the 600-block reserved for fiction.
 */
export const SAMPLE_WORKERS: Worker[] = [
  {
    id: "w-sample-01",
    name: "Ana Beltrán",
    role: "Capataz",
    phone: "+34 600 000 001",
    crew: "Cuadrilla A",
    status: "active",
    createdAt: "2026-01-20T08:00:00.000Z",
    source: "sample",
  },
  {
    id: "w-sample-02",
    name: "Ismael Ortiz",
    role: "Tractorista",
    phone: "+34 600 000 002",
    crew: "Cuadrilla A",
    status: "active",
    createdAt: "2026-01-20T08:00:00.000Z",
    source: "sample",
  },
  {
    id: "w-sample-03",
    name: "Rocío Nadal",
    role: "Técnico de campo",
    phone: "+34 600 000 003",
    crew: "Cuadrilla B",
    status: "active",
    createdAt: "2026-01-20T08:00:00.000Z",
    source: "sample",
  },
  {
    id: "w-sample-04",
    name: "Diego Salas",
    role: "Peón agrícola",
    phone: "+34 600 000 004",
    crew: "Cuadrilla B",
    status: "leave",
    createdAt: "2026-01-20T08:00:00.000Z",
    source: "sample",
  },
  {
    id: "w-sample-05",
    name: "Marta Egea",
    role: "Tractorista",
    phone: "+34 600 000 005",
    crew: "Cuadrilla C",
    status: "active",
    createdAt: "2026-01-20T08:00:00.000Z",
    source: "sample",
  },
  {
    id: "w-sample-06",
    name: "Julián Cid",
    role: "Encargado",
    phone: "+34 600 000 006",
    crew: "Sin asignar",
    status: "inactive",
    createdAt: "2026-01-20T08:00:00.000Z",
    source: "sample",
  },
];
