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
  });
}

let instance: OperationRepository | null = null;

/** Selector. Point this at an API-backed repository once there is a backend. */
export function getOperationRepository(): OperationRepository {
  instance ??= createLocalStorageOperationRepository();
  return instance;
}
