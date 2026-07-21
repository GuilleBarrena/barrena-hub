/**
 * The signed-in user's profile.
 *
 * Single-user for now, mirroring the organization domain: a typed default plus
 * a localStorage-backed store so the settings form can edit it and every reader
 * updates. When real auth lands, swap the store for a session-backed source and
 * nothing downstream changes.
 */

"use client";

import { createSettingsStore } from "@/lib/settings/store";

export interface UserProfile {
  name: string;
  email: string;
  /** Role within the organization, shown on the profile card. */
  role: string;
  phone: string;
  /** UI language tag, es-ES by default. */
  language: string;
}

export const DEFAULT_USER: UserProfile = {
  name: "Guillermo Barrena",
  email: "guillermobarrena@gmail.com",
  role: "Responsable de explotación",
  phone: "+34 600 000 000",
  language: "es-ES",
};

const store = createSettingsStore<UserProfile>("hub:user-profile", DEFAULT_USER);

export const useUserProfile = store.useValue;
export const saveUserProfile = store.save;
