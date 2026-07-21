/**
 * Fetches the PWS stations near a point and tracks which one is active.
 *
 * The state machine is the point of this hook:
 *   - `unconfigured` when no API key is stored — the UI shows a prompt to set
 *     one up, never sample data;
 *   - `loading` / `error` around the request;
 *   - `ready` with the real stations from the provider.
 *
 * `activeId` is the ephemeral hover handle shared with the map, exactly as
 * before: the card list sets it, the map reads it to pan.
 */

"use client";

import { useCallback, useEffect, useState } from "react";

import type { LatLng } from "@/lib/fields/types";
import { usePwsSettings } from "./settings";
import type { NearbyStation } from "./types";

export type NearbyState =
  | { status: "unconfigured" }
  | { status: "loading" }
  | { status: "ready"; stations: NearbyStation[] }
  | { status: "error"; message: string };

export interface NearbyStationsResult {
  state: NearbyState;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  /** Re-run the request; used by the error state's retry affordance. */
  reload: () => void;
}

/** The async outcome, tagged with the request it belongs to so a stale result
 *  is ignored once the inputs change. */
type FetchResult =
  | { key: string; status: "ready"; stations: NearbyStation[] }
  | { key: string; status: "error"; message: string };

export function useNearbyStations(center: LatLng | null): NearbyStationsResult {
  const { apiKey, provider } = usePwsSettings();
  const [result, setResult] = useState<FetchResult | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  // Primitive inputs so the effect only re-runs when something material changes,
  // not on every render that produces a fresh `center` array.
  const lat = center?.[0] ?? null;
  const lng = center?.[1] ?? null;
  const key = apiKey.trim();

  // A request is only well-defined once we have both a point and a key; `null`
  // means there's nothing to fetch (still loading a field, or unconfigured).
  const reqKey =
    lat !== null && lng !== null && key !== ""
      ? `${lat},${lng}|${provider}|${key}|${nonce}`
      : null;

  useEffect(() => {
    if (reqKey === null) return;

    let active = true;
    const controller = new AbortController();

    fetch("/api/pws/nearby", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lat, lng, apiKey: key, provider }),
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as {
          stations?: NearbyStation[];
          error?: string;
        };
        if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
        return data.stations ?? [];
      })
      .then((stations) => {
        if (active) setResult({ key: reqKey, status: "ready", stations });
      })
      .catch((error: unknown) => {
        if (!active || controller.signal.aborted) return;
        setResult({
          key: reqKey,
          status: "error",
          message: error instanceof Error ? error.message : "No se pudieron cargar las estaciones.",
        });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [reqKey, lat, lng, key, provider]);

  // Derived during render — no setState in the effect body. Loading covers both
  // "no field yet" and "request in flight for the current inputs".
  const state: NearbyState =
    lat === null || lng === null
      ? { status: "loading" }
      : key === ""
        ? { status: "unconfigured" }
        : result?.key === reqKey
          ? result.status === "ready"
            ? { status: "ready", stations: result.stations }
            : { status: "error", message: result.message }
          : { status: "loading" };

  return { state, activeId, setActiveId, reload };
}
