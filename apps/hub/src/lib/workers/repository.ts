import {
  createLocalStorageRepository,
  type Repository,
} from "@/lib/storage/local-repository";
import { SAMPLE_WORKERS } from "./seed";
import type { NewWorker, Worker } from "./types";

export type WorkerRepository = Repository<Worker, NewWorker>;

export function createLocalStorageWorkerRepository(): WorkerRepository {
  return createLocalStorageRepository<Worker, NewWorker>({
    storageKey: "hub.workers.v1",
    idPrefix: "w",
    samples: SAMPLE_WORKERS,
    build: (draft, base) => ({ ...draft, ...base }),
  });
}

let instance: WorkerRepository | null = null;

/** Selector. Point this at an API-backed repository once there is a backend. */
export function getWorkerRepository(): WorkerRepository {
  instance ??= createLocalStorageWorkerRepository();
  return instance;
}
