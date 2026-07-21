import {
  createLocalStorageRepository,
  type Repository,
} from "@/lib/storage/local-repository";
import { ringAreaHectares } from "./geo";
import { SAMPLE_FIELDS } from "./seed";
import type { Field, NewField } from "./types";

export type FieldRepository = Repository<Field, NewField>;

export function createLocalStorageFieldRepository(): FieldRepository {
  return createLocalStorageRepository<Field, NewField>({
    storageKey: "hub.fields.v1",
    idPrefix: "f",
    samples: SAMPLE_FIELDS,
    // Area is derived on create, never taken from the caller.
    build: (draft, base) => ({
      ...draft,
      ...base,
      areaHectares: ringAreaHectares(draft.ring),
    }),
  });
}

let instance: FieldRepository | null = null;

/** Selector. Point this at an API-backed repository once there is a backend. */
export function getFieldRepository(): FieldRepository {
  instance ??= createLocalStorageFieldRepository();
  return instance;
}
