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
 * A normalized sky condition — the union the forecast UI understands, decoupled
 * from any provider's own coding. Providers map their native codes (Open-Meteo's
 * WMO weather code, TWC's icon code, …) onto this small set, and the glyph is
 * chosen from here so the icons stay identical whoever supplied the data.
 */
export type ForecastCondition =
  | "clear"
  | "partly"
  | "cloudy"
  | "fog"
  | "rain"
  | "snow"
  | "storm";

/**
 * Normalized daily forecast, one entry per calendar day, always in metric.
 *
 * A forecast is model output for the field's coordinates, not a station reading
 * — personal weather stations report the present, never a prediction. The data
 * comes from Open-Meteo (`api.open-meteo.com/v1/forecast`, keyless), requested
 * in metric so values land here as °C, km/h, mm and cm, ready for `format.ts` to
 * convert at the edge like every other measure. The day-of-week label is derived
 * at render from `date`, keeping this shape provider-agnostic.
 */
export interface DailyForecast {
  /** Local calendar date, ISO `YYYY-MM-DD`. */
  date: string;
  /** Whole-day high, °C. Null only if the provider omits it. */
  tempMaxC: number | null;
  /** Whole-day low, °C. */
  tempMinC: number | null;
  /** Normalized sky condition, driving the glyph. */
  condition: ForecastCondition;
  /** Human phrase for the condition, in Spanish (e.g. "Parcialmente nublado"). */
  conditionPhrase: string;
  /** Chance of precipitation, %. */
  precipChancePct: number;
  /** Liquid-equivalent precipitation total for the day, mm. */
  qpfMm: number;
  /** Forecast snow accumulation for the day, cm. */
  qpfSnowCm: number;
  /** Mean relative humidity, %. */
  humidityPct: number;
  /** Peak sustained wind for the day, km/h. */
  windSpeedKph: number;
  /** Peak wind gust for the day, km/h. */
  windGustKph: number;
  /** Dominant wind origin in meteorological degrees. */
  windDirDeg: number;
  /** Mean cloud cover, %. Null when unavailable. */
  cloudCoverPct: number | null;
  /** Peak UV index for the day. */
  uvIndex: number;
  /** Local sunrise/sunset ISO strings (no offset — already local). */
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
