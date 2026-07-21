/**
 * Configuration for the public weather API the service reads from.
 *
 * This is the *only* PWS configuration there is: provider + credential +
 * display units. It deliberately does NOT list stations — which stations show
 * up near a field is derived from the field's position (see `nearby.ts`), not
 * from here.
 *
 * Stored in localStorage like the other hub domains. It is a demo: the API key
 * never leaves the browser and is not used to make any real request. Treat the
 * warning in the settings UI as load-bearing.
 */

"use client";

import { createSettingsStore } from "@/lib/settings/store";
import type { PwsProvider, Units } from "./types";

export interface PwsSettings {
  provider: PwsProvider;
  /** WU: 32-char key; Ecowitt: application_key. Demo-only, stays local. */
  apiKey: string;
  /** Ecowitt needs a second secret; unused for WU. */
  apiSecret: string;
  units: Units;
  /** Poll cadence in minutes; on-demand is modelled as 0. */
  pollMinutes: number;
}

export const PROVIDER_LABELS: Record<PwsProvider, string> = {
  weather_underground: "Weather Underground",
  ecowitt: "Ecowitt",
};

export const DEFAULT_SETTINGS: PwsSettings = {
  provider: "weather_underground",
  apiKey: "",
  apiSecret: "",
  units: "metric",
  pollMinutes: 5,
};

const store = createSettingsStore<PwsSettings>("hub:pws-settings", DEFAULT_SETTINGS);

/** Reactive read of the current settings; re-renders on save and cross-tab. */
export const usePwsSettings = store.useValue;
export const savePwsSettings = store.save;
export const readPwsSettings = store.read;
