import {
  createLocalStorageRepository,
  type Repository,
} from "@/lib/storage/local-repository";
import { SAMPLE_VEHICLES } from "./seed";
import type { NewVehicle, Vehicle } from "./types";

export type VehicleRepository = Repository<Vehicle, NewVehicle>;

export function createLocalStorageVehicleRepository(): VehicleRepository {
  return createLocalStorageRepository<Vehicle, NewVehicle>({
    storageKey: "hub.vehicles.v1",
    idPrefix: "v",
    samples: SAMPLE_VEHICLES,
    build: (draft, base) => ({ ...draft, ...base }),
  });
}

let instance: VehicleRepository | null = null;

/** Selector. Point this at an API-backed repository once there is a backend. */
export function getVehicleRepository(): VehicleRepository {
  instance ??= createLocalStorageVehicleRepository();
  return instance;
}
