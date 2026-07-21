import { getFieldRepository } from "@/lib/fields/repository";
import type { Field } from "@/lib/fields/types";
import { getVehicleRepository } from "@/lib/vehicles/repository";
import type { Vehicle } from "@/lib/vehicles/types";
import { getWorkerRepository } from "@/lib/workers/repository";
import type { Worker } from "@/lib/workers/types";

/**
 * An operation stores only ids for its operator, field and vehicle. Both the
 * list and the detail need the actual rows to show names and, for the vehicle,
 * its track's field. Loading them once here keeps that resolution in one place.
 */
export interface OperationRefs {
  workers: Map<string, Worker>;
  vehicles: Map<string, Vehicle>;
  fields: Map<string, Field>;
}

export async function loadOperationRefs(): Promise<OperationRefs> {
  const [workers, vehicles, fields] = await Promise.all([
    getWorkerRepository().list(),
    getVehicleRepository().list(),
    getFieldRepository().list(),
  ]);
  return {
    workers: new Map(workers.map((w) => [w.id, w])),
    vehicles: new Map(vehicles.map((v) => [v.id, v])),
    fields: new Map(fields.map((f) => [f.id, f])),
  };
}
