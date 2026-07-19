import { ringAreaHectares } from "./geo";
import { SAMPLE_FIELDS } from "./seed";
import type { Field, NewField } from "./types";

/**
 * Storage boundary for fields.
 *
 * Every method is async even though localStorage is synchronous, so swapping
 * in an HTTP-backed implementation later is a drop-in change rather than a
 * refactor of every call site.
 */
export interface FieldRepository {
  list(): Promise<Field[]>;
  get(id: string): Promise<Field | null>;
  create(draft: NewField): Promise<Field>;
  remove(id: string): Promise<void>;
}

const STORAGE_KEY = "hub.fields.v1";

function readStored(): Field[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Field[]) : [];
  } catch {
    // Corrupt or unreadable storage must not take the page down.
    return [];
  }
}

function writeStored(fields: Field[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
  } catch {
    // Quota or private-mode failures are non-fatal for a browser-local store.
  }
}

/**
 * Browser-local implementation. Seeded sample fields are returned alongside
 * stored ones but never written to storage, so they cannot be mutated or
 * duplicated by the user.
 */
export function createLocalStorageFieldRepository(): FieldRepository {
  const repo: FieldRepository = {
    async list() {
      return [...SAMPLE_FIELDS, ...readStored()];
    },

    async get(id) {
      const all = await repo.list();
      return all.find((f) => f.id === id) ?? null;
    },

    async create(draft) {
      const field: Field = {
        ...draft,
        id: `f-${crypto.randomUUID().slice(0, 8)}`,
        areaHectares: ringAreaHectares(draft.ring),
        createdAt: new Date().toISOString(),
        source: "user",
      };
      writeStored([...readStored(), field]);
      return field;
    },

    async remove(id) {
      writeStored(readStored().filter((f) => f.id !== id));
    },
  };

  return repo;
}

let instance: FieldRepository | null = null;

/** Selector. Point this at an API-backed repository once there is a backend. */
export function getFieldRepository(): FieldRepository {
  instance ??= createLocalStorageFieldRepository();
  return instance;
}
