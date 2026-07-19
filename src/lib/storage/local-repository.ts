/**
 * Generic browser-local repository.
 *
 * Fields, vehicles and workers all need the same storage behaviour, so it
 * lives here once. Each domain supplies a storage key, its read-only samples
 * and a `build` step for whatever it derives on create (a field computes its
 * area, for instance).
 *
 * Methods are async even though localStorage is synchronous, so an
 * HTTP-backed implementation drops in without touching call sites.
 */

export interface StoredEntity {
  id: string;
  createdAt: string;
  /** Distinguishes seeded demo rows from ones the user created. */
  source: "sample" | "user";
}

export interface Repository<T extends StoredEntity, TDraft> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  create(draft: TDraft): Promise<T>;
  remove(id: string): Promise<void>;
}

export function createLocalStorageRepository<T extends StoredEntity, TDraft>(config: {
  storageKey: string;
  /** Short prefix for generated ids, e.g. "v" -> "v-1a2b3c4d". */
  idPrefix: string;
  /** Seeded rows. Returned by list() but never written to storage. */
  samples: T[];
  build: (draft: TDraft, base: StoredEntity) => T;
}): Repository<T, TDraft> {
  function readStored(): T[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(config.storageKey);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      // Corrupt or unreadable storage must not take the page down.
      return [];
    }
  }

  function writeStored(rows: T[]) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(config.storageKey, JSON.stringify(rows));
    } catch {
      // Quota or private-mode failures are non-fatal for a browser-local store.
    }
  }

  const repo: Repository<T, TDraft> = {
    async list() {
      return [...config.samples, ...readStored()];
    },

    async get(id) {
      const all = await repo.list();
      return all.find((row) => row.id === id) ?? null;
    },

    async create(draft) {
      const entity = config.build(draft, {
        id: `${config.idPrefix}-${crypto.randomUUID().slice(0, 8)}`,
        createdAt: new Date().toISOString(),
        source: "user",
      });
      writeStored([...readStored(), entity]);
      return entity;
    },

    async remove(id) {
      writeStored(readStored().filter((row) => row.id !== id));
    },
  };

  return repo;
}
