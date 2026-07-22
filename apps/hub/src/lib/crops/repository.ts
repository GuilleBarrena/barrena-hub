import {
  createLocalStorageRepository,
  type Repository,
} from "@/lib/storage/local-repository";
import { ringAreaHectares } from "./geo";
import { SAMPLE_CROPS } from "./seed";
import type { Crop, NewCrop } from "./types";

export type CropRepository = Repository<Crop, NewCrop>;

export function createLocalStorageCropRepository(): CropRepository {
  return createLocalStorageRepository<Crop, NewCrop>({
    storageKey: "hub.crops.v1",
    // Crops were stored as "fields" before the rename; keep that saved data.
    legacyKeys: ["hub.fields.v1"],
    idPrefix: "f",
    samples: SAMPLE_CROPS,
    // Area is derived on create, never taken from the caller.
    build: (draft, base) => ({
      ...draft,
      ...base,
      areaHectares: ringAreaHectares(draft.ring),
    }),
  });
}

let instance: CropRepository | null = null;

/** Selector. Point this at an API-backed repository once there is a backend. */
export function getCropRepository(): CropRepository {
  instance ??= createLocalStorageCropRepository();
  return instance;
}
