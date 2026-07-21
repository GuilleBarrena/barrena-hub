/**
 * Client-side session for the hub.
 *
 * This is a front-end prototype with no backend, so identity lives entirely in
 * localStorage and a single demo account stands in for a real identity
 * provider. The store mirrors the rest of the hub's external state
 * (`createSettingsStore`, the sidebar's collapse flag): `useSyncExternalStore`
 * gives reactive, cross-tab reads and a stable server snapshot.
 *
 * The server snapshot is always "signed out". That is deliberate: the auth
 * guard (`AppFrame`) renders nothing for protected routes until localStorage is
 * read on the client, so the first paint and hydration agree and a page reload
 * re-runs the same check. When real auth lands, swap this module for a
 * session-backed source and the guard keeps working unchanged.
 */

"use client";

import { useSyncExternalStore } from "react";

export interface Session {
  email: string;
  name: string;
}

/**
 * Demo credentials. The login form is pre-filled with these, so the prototype
 * signs in on the first click. Not a secret — there is no backend to protect.
 */
export const DEMO_CREDENTIALS = {
  email: "guillermobarrena@gmail.com",
  password: "barrena2026",
} as const;

const STORAGE_KEY = "hub:session";

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  window.addEventListener("storage", notify);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", notify);
  };
}

// Referentially-stable snapshot for useSyncExternalStore: only swap the cache
// when the serialization actually changes.
let cache: Session | null = null;

function read(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function getSnapshot(): Session | null {
  const fresh = read();
  if (JSON.stringify(fresh) !== JSON.stringify(cache)) cache = fresh;
  return cache;
}

/** Server and first client render: nobody is known to be signed in yet. */
function getServerSnapshot(): Session | null {
  return null;
}

/** Reactive read; re-renders on sign in/out and on cross-tab writes. */
export function useSession(): Session | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Non-reactive read, for event handlers that just need the current value. */
export function readSession(): Session | null {
  return read();
}

export interface LoginResult {
  ok: boolean;
  error?: string;
}

/** Validate against the demo account and, on success, persist the session. */
export function login(email: string, password: string): LoginResult {
  const emailOk = email.trim().toLowerCase() === DEMO_CREDENTIALS.email;
  const passwordOk = password === DEMO_CREDENTIALS.password;
  if (!emailOk || !passwordOk) {
    return {
      ok: false,
      error: "Credenciales no válidas. Revisa el correo y la contraseña.",
    };
  }

  const session: Session = {
    email: DEMO_CREDENTIALS.email,
    name: "Guillermo Barrena",
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Quota / private mode: non-fatal, still notify this tab.
  }
  emit();
  return { ok: true };
}

/** Clear the session and notify every subscriber. */
export function logout() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Non-fatal: fall through and still notify for this session.
  }
  emit();
}
