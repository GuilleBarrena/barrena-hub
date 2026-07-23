/**
 * Fetches the 7-day forecast for a point (a field's centroid).
 *
 * Same state machine as `use-nearby-stations`, so the field view can treat the
 * forecast and the station list identically:
 *   - `unconfigured` when no API key is stored — the UI prompts to set one up,
 *     never sample data;
 *   - `loading` / `error` around the request;
 *   - `ready` with the real forecast from the provider.
 */

"use client";

import { useCallback, useEffect, useState } from "react";

import type { LatLng } from "@/lib/crops/types";
import { usePwsSettings } from "./settings";
import type { Forecast } from "./types";

export type ForecastState =
  | { status: "unconfigured" }
  | { status: "loading" }
  | { status: "ready"; forecast: Forecast }
  | { status: "error"; message: string };

export interface ForecastResult {
  state: ForecastState;
  /** Re-run the request; used by the error state's retry affordance. */
  reload: () => void;
}

/** The async outcome, tagged with the request it belongs to so a stale result
 *  is ignored once the inputs change. */
type FetchResult =
  | { key: string; status: "ready"; forecast: Forecast }
  | { key: string; status: "error"; message: string };

export function useForecast(center: LatLng | null): ForecastResult {
  const { apiKey, provider } = usePwsSettings();
  const [result, setResult] = useState<FetchResult | null>(null);
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

    fetch("/api/pws/forecast", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lat, lng, apiKey: key, provider }),
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as {
          forecast?: Forecast;
          error?: string;
        };
        if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
        return data.forecast ?? { location: [lat, lng] as LatLng, days: [] };
      })
      .then((forecast) => {
        if (active) setResult({ key: reqKey, status: "ready", forecast });
      })
      .catch((error: unknown) => {
        if (!active || controller.signal.aborted) return;
        setResult({
          key: reqKey,
          status: "error",
          message: error instanceof Error ? error.message : "No se pudo cargar la predicción.",
        });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [reqKey, lat, lng, key, provider]);

  // Derived during render — no setState in the effect body. Loading covers both
  // "no field yet" and "request in flight for the current inputs".
  const state: ForecastState =
    lat === null || lng === null
      ? { status: "loading" }
      : key === ""
        ? { status: "unconfigured" }
        : result?.key === reqKey
          ? result.status === "ready"
            ? { status: "ready", forecast: result.forecast }
            : { status: "error", message: result.message }
          : { status: "loading" };

  return { state, reload };
}
