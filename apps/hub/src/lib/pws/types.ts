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

import type { LatLng } from "@/lib/crops/types";

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

/**
 * Normalized daily forecast, one entry per calendar day, always in metric.
 *
 * Mirrors The Weather Company's `/v3/wx/forecast/daily/{n}day` product (the same
 * `api.weather.com` host and API key the PWS calls use — forecasts are a
 * separate product, not a personal-station reading). The top-level response is
 * a set of parallel arrays plus a `daypart` block that splits every day into a
 * day/night pair; we fold the day half — falling back to night once the daytime
 * period has passed (the API nulls it after local midday) — into a single
 * per-day summary so the UI gets exactly one row per day. Units are requested as
 * metric, so values land here as °C, km/h, mm and cm, ready for `format.ts` to
 * convert at the edge like every other observation.
 */
export interface DailyForecast {
  /** Local calendar date, ISO `YYYY-MM-DD` (date part of `validTimeLocal`). */
  date: string;
  /** Localized day-of-week label from `dayOfWeek` (Spanish, per `language`). */
  dayName: string;
  /** Whole-day high, `calendarDayTemperatureMax`. Null only if the API omits it. */
  tempMaxC: number | null;
  /** Whole-day low, `calendarDayTemperatureMin`. */
  tempMinC: number | null;
  /** Long condition phrase for the day part, `wxPhraseLong` (e.g. "Parcialmente nublado"). */
  conditionPhrase: string;
  /** Day narrative sentence, `narrative`. */
  narrative: string;
  /** TWC icon code 0–47, day part; drives the glyph. Null when unavailable. */
  iconCode: number | null;
  /** Chance of precipitation, %, day part `precipChance`. */
  precipChancePct: number;
  /** `rain` | `snow` | `precip`, day part `precipType`. */
  precipType: string;
  /** Liquid-equivalent precipitation forecast for the day, mm, `qpf`. */
  qpfMm: number;
  /** Forecast snow accumulation for the day, cm, `qpfSnow`. */
  qpfSnowCm: number;
  /** Relative humidity, %, day part `relativeHumidity`. */
  humidityPct: number;
  /** Sustained wind, day part `windSpeed`, km/h. */
  windSpeedKph: number;
  /** Wind origin in meteorological degrees, day part `windDirection`. */
  windDirDeg: number;
  /** Cloud cover, %, day part `cloudCover`. Null when unavailable. */
  cloudCoverPct: number | null;
  /** Peak UV index for the day, day part `uvIndex`. */
  uvIndex: number;
  /** Local sunrise/sunset ISO strings, `sunriseTimeLocal` / `sunsetTimeLocal`. */
  sunriseLocal: string | null;
  sunsetLocal: string | null;
}

/** A field's forecast: the centroid it was requested for plus the daily rows. */
export interface Forecast {
  /** Field centroid the forecast was requested for. */
  location: LatLng;
  /** Chronological days (up to the requested horizon, typically 7). */
  days: DailyForecast[];
}
