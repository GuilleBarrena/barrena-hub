/**
 * Normalized PWS (personal weather station) model.
 *
 * The shape mirrors Weather Underground's `/v2/pws/observations/current`
 * response so that swapping the sample data for a real WU call later is a
 * one-file change: the fields below are the union we care about, already
 * decoded into metric SI-ish units. A second provider (Ecowitt) would map its
 * own payload into this same `PwsObservation`, so the UI never learns which
 * provider a reading came from.
 */

import type { LatLng } from "@/lib/fields/types";

export type PwsProvider = "weather_underground" | "ecowitt";

/** Display/units toggle, matching WU's `units=m|e` query parameter. */
export type Units = "metric" | "imperial";

/**
 * A single current observation, always stored in metric. Formatters convert to
 * the user's chosen units at the edge (see `format.ts`); nothing downstream
 * re-derives values, so a station read in °F and one read in °C are directly
 * comparable here.
 */
export interface PwsObservation {
  /** ISO-8601 UTC, from WU `obsTimeUtc`. */
  observedAt: string;
  temperatureC: number;
  dewpointC: number;
  humidityPct: number;
  /** Meteorological degrees (0 = N, 90 = E), from WU `winddir`. */
  windDirDeg: number;
  windSpeedKph: number;
  windGustKph: number;
  pressureHpa: number;
  /** Instantaneous rate, WU `metric.precipRate`. */
  precipRateMm: number;
  /** Running total since local midnight, WU `metric.precipTotal`. */
  precipTotalMm: number;
  uv: number;
  solarRadiationWm2: number;
}

/** A station plus its latest reading. `distanceM` is filled in per-field. */
export interface PwsStation {
  /** Provider-native id (WU `stationID`, e.g. "IOLITE12"). */
  id: string;
  /** Human label — WU `neighborhood`. */
  name: string;
  provider: PwsProvider;
  location: LatLng;
  observation: PwsObservation;
}

/** A station resolved against a field: same station, plus how far it sits. */
export interface NearbyStation extends PwsStation {
  /** Great-circle metres from the field centroid. */
  distanceM: number;
}
