/**
 * A tiny localStorage-backed store for a single settings object.
 *
 * The hub already leans on `useSyncExternalStore` for external state (the
 * sidebar's collapse flag). This generalises that pattern so the PWS API
 * config and the org/user profiles all get reactive, cross-tab reads and a
 * stable server snapshot from one place, instead of hand-rolling each one.
 *
 * Values are merged over `defaults` on read, so adding a field later never
 * yields `undefined` for blobs written by an older build.
 */

"use client";

import { useSyncExternalStore } from "react";

export interface SettingsStore<T> {
  /** Reactive read; re-renders on save and on cross-tab writes. */
  useValue(): T;
  /** Persist and notify every subscriber. */
  save(next: T): void;
  /** Non-reactive read, for event handlers that just need the current value. */
  read(): T;
}

export function createSettingsStore<T extends object>(
  storageKey: string,
  defaults: T,
): SettingsStore<T> {
  const listeners = new Set<() => void>();
  // useSyncExternalStore needs a referentially-stable snapshot while nothing
  // changed; only swap the cache when the serialization actually differs.
  let cache: T = defaults;

  function read(): T {
    if (typeof window === "undefined") return defaults;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return defaults;
      return { ...defaults, ...(JSON.parse(raw) as Partial<T>) };
    } catch {
      return defaults;
    }
  }

  function getSnapshot(): T {
    const fresh = read();
    if (JSON.stringify(fresh) !== JSON.stringify(cache)) cache = fresh;
    return cache;
  }

  function subscribe(notify: () => void) {
    listeners.add(notify);
    window.addEventListener("storage", notify);
    return () => {
      listeners.delete(notify);
      window.removeEventListener("storage", notify);
    };
  }

  function save(next: T) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Quota / private mode: non-fatal, still notify this tab.
    }
    listeners.forEach((notify) => notify());
  }

  return {
    read,
    save,
    useValue: () => useSyncExternalStore(subscribe, getSnapshot, () => defaults),
  };
}
