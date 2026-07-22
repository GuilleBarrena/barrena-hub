/**
 * Generic browser-local repository.
 *
 * Crops, vehicles and workers all need the same storage behaviour, so it
 * lives here once. Each domain supplies a storage key, its read-only samples
 * and a `build` step for whatever it derives on create (a crop computes its
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
  /**
   * Storage keys this store used to live under. On first read, if the current
   * key holds nothing, data from the first legacy key that has any is moved
   * across and the legacy key cleared - so a renamed store keeps saved data.
   */
  legacyKeys?: string[];
  /**
   * Normalises a stored row whose persisted shape predates the current type
   * (e.g. an attribute renamed on the entity). Applied to every row on read,
   * so it must be idempotent. Runs after any legacy-key move.
   */
  migrateRow?: (row: unknown) => T;
}): Repository<T, TDraft> {
  let legacyMoved = false;
  /** One-time: adopt data left under an old key if the current one is empty. */
  function moveLegacyData() {
    if (legacyMoved) return;
    legacyMoved = true;
    if (!config.legacyKeys?.length) return;
    try {
      // A present current key (even "[]") wins: the user is already migrated.
      if (window.localStorage.getItem(config.storageKey) != null) return;
      for (const key of config.legacyKeys) {
        const raw = window.localStorage.getItem(key);
        if (raw == null) continue;
        window.localStorage.setItem(config.storageKey, raw);
        window.localStorage.removeItem(key);
        return;
      }
    } catch {
      // A failed migration must never take the page down.
    }
  }

  function readStored(): T[] {
    if (typeof window === "undefined") return [];
    moveLegacyData();
    try {
      const raw = window.localStorage.getItem(config.storageKey);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return config.migrateRow ? parsed.map(config.migrateRow) : (parsed as T[]);
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
