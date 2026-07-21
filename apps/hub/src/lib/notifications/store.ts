import { useCallback } from "react";
import { useSyncExternalStore } from "react";

// ---------------------------------------------------------------------------
// Estado persistido de las notificaciones (qué ha leído y descartado el
// usuario), como conjuntos de ids en localStorage.
//
// Se expone por `useSyncExternalStore` —igual que la preferencia de la barra
// lateral— para que el render del servidor y el del primer cliente coincidan
// (ambos parten del conjunto vacío del snapshot de servidor, sin desajuste de
// hidratación) y para re-renderizar ante cambios, aquí y en otras pestañas, sin
// llamar a setState dentro de un efecto.
// ---------------------------------------------------------------------------

const VACIO: Set<string> = new Set();

// Snapshot cacheado por clave: `useSyncExternalStore` exige que getSnapshot
// devuelva la MISMA referencia mientras no haya cambios.
const snapshots = new Map<string, Set<string>>();
const subscriptores = new Map<string, Set<() => void>>();

function leer(clave: string): Set<string> {
  try {
    const raw = window.localStorage.getItem(clave);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(
      Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [],
    );
  } catch {
    return new Set();
  }
}

function escribir(clave: string, valor: Set<string>) {
  try {
    window.localStorage.setItem(clave, JSON.stringify([...valor]));
  } catch {
    // Almacenamiento no disponible; no es crítico.
  }
}

function asegurar(clave: string): Set<string> {
  let s = snapshots.get(clave);
  if (!s) {
    s = leer(clave);
    snapshots.set(clave, s);
  }
  return s;
}

function emitir(clave: string) {
  subscriptores.get(clave)?.forEach((notify) => notify());
}

function subscribe(clave: string, notify: () => void) {
  let subs = subscriptores.get(clave);
  if (!subs) {
    subs = new Set();
    subscriptores.set(clave, subs);
  }
  subs.add(notify);

  const alCambiarAlmacenamiento = (e: StorageEvent) => {
    if (e.key === clave) {
      snapshots.set(clave, leer(clave));
      notify();
    }
  };
  window.addEventListener("storage", alCambiarAlmacenamiento);

  return () => {
    subs.delete(notify);
    window.removeEventListener("storage", alCambiarAlmacenamiento);
  };
}

/** Añade ids al conjunto de la clave y persiste (referencia nueva → re-render). */
export function anadirIds(clave: string, ids: string[]) {
  if (ids.length === 0) return;
  const next = new Set(asegurar(clave));
  ids.forEach((id) => next.add(id));
  snapshots.set(clave, next);
  escribir(clave, next);
  emitir(clave);
}

/** Lee, de forma reactiva, el conjunto de ids persistido bajo `clave`. */
export function useConjuntoPersistido(clave: string): Set<string> {
  return useSyncExternalStore(
    useCallback((notify) => subscribe(clave, notify), [clave]),
    useCallback(() => asegurar(clave), [clave]),
    () => VACIO,
  );
}
