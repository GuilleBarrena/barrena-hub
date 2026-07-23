/**
 * Weather Underground (IBM / The Weather Company) PWS client.
 *
 * Runs server-side only (from the /api/pws/nearby route): it takes the caller's
 * API key, discovers the public stations around a point, reads each one's
 * current observation and maps everything into our normalized model.
 *
 * Two endpoints, current as of the v3/v2 API:
 *   - GET /v3/location/near?geocode=LAT,LON&product=pws   → nearby station ids
 *   - GET /v2/pws/observations/current?stationId=ID&units=m → current reading
 *
 * We always request `units=m`, so the `metric` block maps straight onto our
 * (metric) `PwsObservation`; display units are applied later, at the UI edge.
 */

import { haversineMeters } from "../nearby";
import type { DailyForecast, Forecast, NearbyStation, PwsObservation } from "../types";

const BASE = "https://api.weather.com";

/** Carries the HTTP status so the route can distinguish a bad key (401/403)
 *  from an upstream failure and decide whether a retry is worthwhile. */
export class WeatherUndergroundError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "WeatherUndergroundError";
    this.status = status;
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isAuthStatus = (status?: number) => status === 401 || status === 403;

/** GET + parse JSON with exponential backoff on transient failures. Auth
 *  errors are never retried — the key won't get better by asking again. */
async function getJson<T>(url: string, tries = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < tries; attempt++) {
    try {
      const res = await fetch(url, { headers: { accept: "application/json" }, cache: "no-store" });
      if (isAuthStatus(res.status)) {
        throw new WeatherUndergroundError("Weather Underground rechazó la API key.", res.status);
      }
      if (res.status === 204) return {} as T; // no content (e.g. station idle)
      if (!res.ok) {
        throw new WeatherUndergroundError(`Weather Underground respondió ${res.status}.`, res.status);
      }
      return (await res.json()) as T;
    } catch (error) {
      lastError = error;
      if (error instanceof WeatherUndergroundError && isAuthStatus(error.status)) throw error;
      if (attempt < tries - 1) await sleep(2 ** attempt * 300); // 300ms, 600ms
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new WeatherUndergroundError("No se pudo contactar con Weather Underground.");
}

interface NearResponse {
  location?: {
    latitude?: number[];
    longitude?: number[];
    distanceKm?: number[];
    stationId?: string[];
    stationName?: (string | null)[];
  };
}

interface CurrentObservation {
  stationID?: string;
  neighborhood?: string | null;
  obsTimeUtc?: string;
  lat?: number;
  lon?: number;
  humidity?: number | null;
  winddir?: number | null;
  uv?: number | null;
  solarRadiation?: number | null;
  metric?: {
    temp?: number | null;
    dewpt?: number | null;
    windSpeed?: number | null;
    windGust?: number | null;
    pressure?: number | null;
    precipRate?: number | null;
    precipTotal?: number | null;
  } | null;
}

interface CurrentResponse {
  observations?: CurrentObservation[];
}

/** Coerce a possibly-null API number into a finite number. */
const num = (v: number | null | undefined, fallback = 0): number =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;

/** Like `num`, but keeps `null` when the API has no value — for fields whose
 *  absence is meaningful (a missing high isn't a 0 °C high). */
const numOrNull = (v: number | null | undefined): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

function normalize(obs: CurrentObservation): PwsObservation | null {
  const m = obs.metric;
  if (!m) return null;
  return {
    observedAt: obs.obsTimeUtc ?? new Date().toISOString(),
    temperatureC: num(m.temp),
    dewpointC: num(m.dewpt),
    humidityPct: num(obs.humidity),
    windDirDeg: num(obs.winddir),
    windSpeedKph: num(m.windSpeed),
    windGustKph: num(m.windGust),
    pressureHpa: num(m.pressure),
    precipRateMm: num(m.precipRate),
    precipTotalMm: num(m.precipTotal),
    uv: num(obs.uv),
    solarRadiationWm2: num(obs.solarRadiation),
  };
}

/**
 * Stations near `[lat, lng]`, nearest first, each with a current reading.
 * Stations that fail individually (offline, no current data) are skipped; a
 * bad key or a total upstream failure throws.
 */
export async function fetchNearbyStations(opts: {
  lat: number;
  lng: number;
  apiKey: string;
  limit?: number;
}): Promise<NearbyStation[]> {
  const { lat, lng, apiKey, limit = 6 } = opts;
  const key = encodeURIComponent(apiKey);

  const near = await getJson<NearResponse>(
    `${BASE}/v3/location/near?geocode=${lat},${lng}&product=pws&format=json&apiKey=${key}`,
  );
  const loc = near.location;
  if (!loc?.stationId?.length) return [];

  const candidates = loc.stationId.slice(0, limit).map((id, i) => ({
    id,
    name: loc.stationName?.[i]?.trim() || id,
    location: [num(loc.latitude?.[i], lat), num(loc.longitude?.[i], lng)] as [number, number],
    distanceM: num(loc.distanceKm?.[i]) * 1000,
  }));

  const settled = await Promise.all(
    candidates.map(async (c): Promise<NearbyStation | null> => {
      try {
        const current = await getJson<CurrentResponse>(
          `${BASE}/v2/pws/observations/current?stationId=${encodeURIComponent(c.id)}&format=json&units=m&apiKey=${key}`,
        );
        const obs = current.observations?.[0];
        const observation = obs ? normalize(obs) : null;
        if (!obs || !observation) return null;

        const location: [number, number] = [num(obs.lat, c.location[0]), num(obs.lon, c.location[1])];
        return {
          id: c.id,
          name: obs.neighborhood?.trim() || c.name,
          provider: "weather_underground",
          location,
          distanceM: c.distanceM || haversineMeters([lat, lng], location),
          observation,
        };
      } catch (error) {
        // A bad key affects every call — surface it rather than swallowing.
        if (error instanceof WeatherUndergroundError && isAuthStatus(error.status)) throw error;
        return null;
      }
    }),
  );

  return settled
    .filter((s): s is NearbyStation => s !== null)
    .sort((a, b) => a.distanceM - b.distanceM);
}

/**
 * The `daypart` block: every field is a flat array of length `2 * days`,
 * interleaved [day, night, day, night, …]. So day `i`'s daytime value sits at
 * index `2i` and its nighttime value at `2i + 1`. The catch: after local midday
 * the very first (today-daytime) slot is `null` while the rest stay aligned, so
 * readers must tolerate a null head, never shift the array.
 */
interface DaypartBlock {
  cloudCover?: (number | null)[];
  iconCode?: (number | null)[];
  precipChance?: (number | null)[];
  precipType?: (string | null)[];
  relativeHumidity?: (number | null)[];
  uvIndex?: (number | null)[];
  windDirection?: (number | null)[];
  windSpeed?: (number | null)[];
  wxPhraseLong?: (string | null)[];
}

interface DailyForecastResponse {
  dayOfWeek?: (string | null)[];
  validTimeLocal?: (string | null)[];
  narrative?: (string | null)[];
  calendarDayTemperatureMax?: (number | null)[];
  calendarDayTemperatureMin?: (number | null)[];
  temperatureMax?: (number | null)[];
  temperatureMin?: (number | null)[];
  qpf?: (number | null)[];
  qpfSnow?: (number | null)[];
  sunriseTimeLocal?: (string | null)[];
  sunsetTimeLocal?: (string | null)[];
  daypart?: (DaypartBlock | null)[];
}

/** Prefer day `i`'s daytime value; fall back to its nighttime value when the
 *  daytime slot is null (i.e. today, after midday). */
function daypartValue<T>(arr: (T | null)[] | undefined, dayIdx: number): T | null {
  if (!arr) return null;
  const day = arr[dayIdx * 2];
  const night = arr[dayIdx * 2 + 1];
  return (day ?? night) ?? null;
}

/**
 * A daily forecast for the point `[lat, lng]`. Uses the same key and host as the
 * PWS calls, but a different product (`/v3/wx/forecast/daily/{days}day`), which
 * returns model data for the location rather than any single station's reading.
 * We request `units=m` so everything arrives in metric, matching our store.
 */
export async function fetchForecast(opts: {
  lat: number;
  lng: number;
  apiKey: string;
  days?: 5 | 7 | 10 | 15;
}): Promise<Forecast> {
  const { lat, lng, apiKey, days = 7 } = opts;
  const key = encodeURIComponent(apiKey);

  const res = await getJson<DailyForecastResponse>(
    `${BASE}/v3/wx/forecast/daily/${days}day?geocode=${lat},${lng}&units=m&language=es-ES&format=json&apiKey=${key}`,
  );

  const count = res.dayOfWeek?.length ?? res.validTimeLocal?.length ?? 0;
  const dp = res.daypart?.[0] ?? undefined;

  const built: DailyForecast[] = [];
  for (let i = 0; i < count; i++) {
    built.push({
      date: (res.validTimeLocal?.[i] ?? "").slice(0, 10),
      dayName: res.dayOfWeek?.[i]?.trim() || "",
      // calendar-day extremes are present for every day (including today);
      // the plain temperatureMax/Min are the fallback if the API omits them.
      tempMaxC: numOrNull(res.calendarDayTemperatureMax?.[i] ?? res.temperatureMax?.[i]),
      tempMinC: numOrNull(res.calendarDayTemperatureMin?.[i] ?? res.temperatureMin?.[i]),
      conditionPhrase: daypartValue(dp?.wxPhraseLong, i)?.trim() || "",
      narrative: res.narrative?.[i]?.trim() || "",
      iconCode: numOrNull(daypartValue(dp?.iconCode, i)),
      precipChancePct: num(daypartValue(dp?.precipChance, i)),
      precipType: daypartValue(dp?.precipType, i)?.trim() || "precip",
      qpfMm: num(res.qpf?.[i]),
      qpfSnowCm: num(res.qpfSnow?.[i]),
      humidityPct: num(daypartValue(dp?.relativeHumidity, i)),
      windSpeedKph: num(daypartValue(dp?.windSpeed, i)),
      windDirDeg: num(daypartValue(dp?.windDirection, i)),
      cloudCoverPct: numOrNull(daypartValue(dp?.cloudCover, i)),
      uvIndex: num(daypartValue(dp?.uvIndex, i)),
      sunriseLocal: res.sunriseTimeLocal?.[i] ?? null,
      sunsetLocal: res.sunsetTimeLocal?.[i] ?? null,
    });
  }

  return { location: [lat, lng], days: built };
}
