/**
 * Open-Meteo forecast client.
 *
 * A forecast is model output for a point, not a station reading — so unlike the
 * PWS layer this talks to Open-Meteo (`api.open-meteo.com/v1/forecast`), which
 * serves national-weather-service model data for any coordinate and needs no API
 * key. We ask for metric units and `timezone=auto`, so values arrive as °C, km/h,
 * mm and cm on the field's local calendar, mapping straight onto our normalized
 * `Forecast`. Weather codes are WMO 4677; we fold them into our provider-agnostic
 * `ForecastCondition` so the glyph never learns who supplied the data.
 */

import type { DailyForecast, Forecast, ForecastCondition } from "../types";

const BASE = "https://api.open-meteo.com/v1/forecast";

/** The daily fields we request, in order; kept as one list so the query string
 *  and the response typing can't drift apart. */
const DAILY = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_sum",
  "precipitation_probability_max",
  "snowfall_sum",
  "wind_speed_10m_max",
  "wind_gusts_10m_max",
  "wind_direction_10m_dominant",
  "uv_index_max",
  "relative_humidity_2m_mean",
  "cloud_cover_mean",
  "sunrise",
  "sunset",
] as const;

/** Carries the HTTP status so the route can tell an upstream failure apart. */
export class OpenMeteoError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "OpenMeteoError";
    this.status = status;
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** GET + parse JSON with exponential backoff on transient failures. */
async function getJson<T>(url: string, tries = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < tries; attempt++) {
    try {
      const res = await fetch(url, { headers: { accept: "application/json" }, cache: "no-store" });
      if (!res.ok) {
        // Open-Meteo returns a JSON `{ reason }` on 400; surface it when present.
        const reason = await res
          .json()
          .then((b: { reason?: string }) => b?.reason)
          .catch(() => undefined);
        throw new OpenMeteoError(reason ?? `Open-Meteo respondió ${res.status}.`, res.status);
      }
      return (await res.json()) as T;
    } catch (error) {
      lastError = error;
      if (attempt < tries - 1) await sleep(2 ** attempt * 300); // 300ms, 600ms
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new OpenMeteoError("No se pudo contactar con Open-Meteo.");
}

interface DailyResponse {
  daily?: {
    time?: string[];
    weather_code?: (number | null)[];
    temperature_2m_max?: (number | null)[];
    temperature_2m_min?: (number | null)[];
    precipitation_sum?: (number | null)[];
    precipitation_probability_max?: (number | null)[];
    snowfall_sum?: (number | null)[];
    wind_speed_10m_max?: (number | null)[];
    wind_gusts_10m_max?: (number | null)[];
    wind_direction_10m_dominant?: (number | null)[];
    uv_index_max?: (number | null)[];
    relative_humidity_2m_mean?: (number | null)[];
    cloud_cover_mean?: (number | null)[];
    sunrise?: (string | null)[];
    sunset?: (string | null)[];
  };
}

const num = (v: number | null | undefined, fallback = 0): number =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;

const numOrNull = (v: number | null | undefined): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

/**
 * WMO 4677 weather code → normalized condition. Bucketed toward the more
 * cautionary reading (freezing drizzle counts as rain, thunder as storm) — this
 * is agronomic UI, so a wetter/harsher glyph is the safer default.
 */
function conditionFromWmo(code: number | null): ForecastCondition {
  if (code === null) return "cloudy";
  if (code === 0 || code === 1) return "clear";
  if (code === 2) return "partly";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 95) return "storm"; // 95, 96, 99
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  return "cloudy";
}

/** WMO 4677 weather code → Spanish phrase, finer-grained than the glyph bucket. */
const WMO_PHRASE: Record<number, string> = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna débil",
  53: "Llovizna moderada",
  55: "Llovizna intensa",
  56: "Llovizna helada débil",
  57: "Llovizna helada intensa",
  61: "Lluvia débil",
  63: "Lluvia moderada",
  65: "Lluvia intensa",
  66: "Lluvia helada débil",
  67: "Lluvia helada intensa",
  71: "Nevada débil",
  73: "Nevada moderada",
  75: "Nevada intensa",
  77: "Granos de nieve",
  80: "Chubascos débiles",
  81: "Chubascos moderados",
  82: "Chubascos violentos",
  85: "Chubascos de nieve débiles",
  86: "Chubascos de nieve intensos",
  95: "Tormenta",
  96: "Tormenta con granizo",
  99: "Tormenta con granizo fuerte",
};

const CONDITION_PHRASE: Record<ForecastCondition, string> = {
  clear: "Despejado",
  partly: "Parcialmente nublado",
  cloudy: "Nublado",
  fog: "Niebla",
  rain: "Lluvia",
  snow: "Nieve",
  storm: "Tormenta",
};

function phraseFor(code: number | null, condition: ForecastCondition): string {
  return (code !== null && WMO_PHRASE[code]) || CONDITION_PHRASE[condition];
}

/**
 * A daily forecast for the point `[lat, lng]`. Keyless; `days` is the horizon
 * (Open-Meteo's `forecast_days`), defaulting to a week.
 */
export async function fetchForecast(opts: {
  lat: number;
  lng: number;
  days?: number;
}): Promise<Forecast> {
  const { lat, lng, days = 7 } = opts;

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    daily: DAILY.join(","),
    forecast_days: String(days),
    timezone: "auto",
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
  });

  const res = await getJson<DailyResponse>(`${BASE}?${params.toString()}`);
  const d = res.daily;
  const count = d?.time?.length ?? 0;

  const built: DailyForecast[] = [];
  for (let i = 0; i < count; i++) {
    const code = numOrNull(d?.weather_code?.[i]);
    const condition = conditionFromWmo(code);
    built.push({
      date: d?.time?.[i] ?? "",
      tempMaxC: numOrNull(d?.temperature_2m_max?.[i]),
      tempMinC: numOrNull(d?.temperature_2m_min?.[i]),
      condition,
      conditionPhrase: phraseFor(code, condition),
      precipChancePct: num(d?.precipitation_probability_max?.[i]),
      qpfMm: num(d?.precipitation_sum?.[i]),
      qpfSnowCm: num(d?.snowfall_sum?.[i]),
      humidityPct: num(d?.relative_humidity_2m_mean?.[i]),
      windSpeedKph: num(d?.wind_speed_10m_max?.[i]),
      windGustKph: num(d?.wind_gusts_10m_max?.[i]),
      windDirDeg: num(d?.wind_direction_10m_dominant?.[i]),
      cloudCoverPct: numOrNull(d?.cloud_cover_mean?.[i]),
      uvIndex: num(d?.uv_index_max?.[i]),
      sunriseLocal: d?.sunrise?.[i] ?? null,
      sunsetLocal: d?.sunset?.[i] ?? null,
    });
  }

  return { location: [lat, lng], days: built };
}
