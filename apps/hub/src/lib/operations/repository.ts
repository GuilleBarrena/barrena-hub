import {
  createLocalStorageRepository,
  type Repository,
} from "@/lib/storage/local-repository";
import { SAMPLE_OPERATIONS } from "./seed";
import type { NewOperation, Operation } from "./types";

export type OperationRepository = Repository<Operation, NewOperation>;

export function createLocalStorageOperationRepository(): OperationRepository {
  return createLocalStorageRepository<Operation, NewOperation>({
    storageKey: "hub.operations.v1",
    idPrefix: "op",
    samples: SAMPLE_OPERATIONS,
    build: (draft, base) => ({ ...draft, ...base }),
    // The crop reference was called `fieldId` before the rename. Read older
    // saved operations by folding it into `cropId`; idempotent once migrated.
    migrateRow: (row) => {
      const { fieldId, cropId, ...rest } = row as Operation & {
        fieldId?: string;
        cropId?: string;
      };
      return { ...rest, cropId: cropId ?? fieldId ?? "" } as Operation;
    },
  });
}

let instance: OperationRepository | null = null;

/** Selector. Point this at an API-backed repository once there is a backend. */
export function getOperationRepository(): OperationRepository {
  instance ??= createLocalStorageOperationRepository();
  return instance;
}
