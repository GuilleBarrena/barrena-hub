/**
 * Fetches the 7-day forecast for a point (a field's centroid).
 *
 * Simpler than `use-nearby-stations`: the forecast source (Open-Meteo) is
 * keyless, so there's no `unconfigured` state — a request is well-defined the
 * moment we have a coordinate. The rest of the state machine (loading / error /
 * ready) matches the station hook so the field view can treat both the same way.
 */

"use client";

import { useCallback, useEffect, useState } from "react";

import type { LatLng } from "@/lib/crops/types";
import type { Forecast } from "./types";

export type ForecastState =
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
  const [result, setResult] = useState<FetchResult | null>(null);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  // Primitive inputs so the effect only re-runs when something material changes,
  // not on every render that produces a fresh `center` array.
  const lat = center?.[0] ?? null;
  const lng = center?.[1] ?? null;

  // A request is only well-defined once we have a point; `null` means there's
  // nothing to fetch yet (still loading a field).
  const reqKey = lat !== null && lng !== null ? `${lat},${lng}|${nonce}` : null;

  useEffect(() => {
    if (reqKey === null) return;

    let active = true;
    const controller = new AbortController();

    fetch("/api/pws/forecast", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lat, lng }),
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
  }, [reqKey, lat, lng]);

  // Derived during render — no setState in the effect body. Loading covers both
  // "no field yet" and "request in flight for the current inputs".
  const state: ForecastState =
    lat === null || lng === null
      ? { status: "loading" }
      : result?.key === reqKey
        ? result.status === "ready"
          ? { status: "ready", forecast: result.forecast }
          : { status: "error", message: result.message }
        : { status: "loading" };

  return { state, reload };
}
