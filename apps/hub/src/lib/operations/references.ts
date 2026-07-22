import { getCropRepository } from "@/lib/crops/repository";
import type { Crop } from "@/lib/crops/types";
import { getVehicleRepository } from "@/lib/vehicles/repository";
import type { Vehicle } from "@/lib/vehicles/types";
import { getWorkerRepository } from "@/lib/workers/repository";
import type { Worker } from "@/lib/workers/types";

/**
 * An operation stores only ids for its operator, crop and vehicle. Both the
 * list and the detail need the actual rows to show names and, for the vehicle,
 * its track's crop. Loading them once here keeps that resolution in one place.
 */
export interface OperationRefs {
  workers: Map<string, Worker>;
  vehicles: Map<string, Vehicle>;
  crops: Map<string, Crop>;
}

export async function loadOperationRefs(): Promise<OperationRefs> {
  const [workers, vehicles, crops] = await Promise.all([
    getWorkerRepository().list(),
    getVehicleRepository().list(),
    getCropRepository().list(),
  ]);
  return {
    workers: new Map(workers.map((w) => [w.id, w])),
    vehicles: new Map(vehicles.map((v) => [v.id, v])),
    crops: new Map(crops.map((f) => [f.id, f])),
  };
}
