import {
  createLocalStorageRepository,
  type Repository,
} from "@/lib/storage/local-repository";
import { SAMPLE_MAINTENANCE } from "./seed";
import type { MaintenanceRecord, NewMaintenanceRecord } from "./types";

export type MaintenanceRepository = Repository<
  MaintenanceRecord,
  NewMaintenanceRecord
> & {
  /** Records for one vehicle, most recent service first. */
  listForVehicle(vehicleId: string): Promise<MaintenanceRecord[]>;
};

export function createLocalStorageMaintenanceRepository(): MaintenanceRepository {
  const base = createLocalStorageRepository<
    MaintenanceRecord,
    NewMaintenanceRecord
  >({
    storageKey: "hub.vehicle-maintenance.v1",
    idPrefix: "m",
    samples: SAMPLE_MAINTENANCE,
    build: (draft, meta) => ({ ...draft, ...meta }),
  });

  return {
    ...base,
    async listForVehicle(vehicleId) {
      const all = await base.list();
      return all
        .filter((record) => record.vehicleId === vehicleId)
        .sort((a, b) => b.date.localeCompare(a.date));
    },
  };
}

let instance: MaintenanceRepository | null = null;

/** Selector. Point this at an API-backed repository once there is a backend. */
export function getMaintenanceRepository(): MaintenanceRepository {
  instance ??= createLocalStorageMaintenanceRepository();
  return instance;
}
