/**
 * Display formatting for observations. Values are stored in metric; these
 * helpers convert to the user's chosen units at the very edge, so the UI is the
 * only place that ever knows about °F or mph.
 *
 * All numeric output goes through es-ES so decimals render with a comma, like
 * the rest of the hub.
 */

import type { PwsObservation, Units } from "./types";

const num = (v: number, digits = 0) =>
  v.toLocaleString("es-ES", { minimumFractionDigits: digits, maximumFractionDigits: digits });

const cToF = (c: number) => (c * 9) / 5 + 32;
const kphToMph = (k: number) => k / 1.609344;
const mmToIn = (mm: number) => mm / 25.4;
const hpaToInHg = (h: number) => h / 33.8639;

/** 16-point compass label for a meteorological wind direction. */
const COMPASS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO"];
export function windCardinal(deg: number): string {
  return COMPASS[Math.round(deg / 22.5) % 16];
}

export function formatTemp(c: number, units: Units): string {
  return units === "imperial" ? `${num(cToF(c), 1)} °F` : `${num(c, 1)} °C`;
}

export function formatWind(kph: number, units: Units): string {
  return units === "imperial" ? `${num(kphToMph(kph))} mph` : `${num(kph)} km/h`;
}

export function formatPrecip(mm: number, units: Units): string {
  return units === "imperial" ? `${num(mmToIn(mm), 2)} in` : `${num(mm, 1)} mm`;
}

export function formatPressure(hpa: number, units: Units): string {
  return units === "imperial" ? `${num(hpaToInHg(hpa), 2)} inHg` : `${num(hpa)} hPa`;
}

export interface ObservationRow {
  label: string;
  value: string;
}

/** The observation flattened into label/value rows for a card or a table. */
export function observationRows(o: PwsObservation, units: Units): ObservationRow[] {
  return [
    { label: "Temperatura", value: formatTemp(o.temperatureC, units) },
    { label: "Humedad", value: `${num(o.humidityPct)} %` },
    { label: "Viento", value: `${formatWind(o.windSpeedKph, units)} ${windCardinal(o.windDirDeg)}` },
    { label: "Racha", value: formatWind(o.windGustKph, units) },
    { label: "Punto de rocío", value: formatTemp(o.dewpointC, units) },
    { label: "Presión", value: formatPressure(o.pressureHpa, units) },
    { label: "Precip. hoy", value: formatPrecip(o.precipTotalMm, units) },
    { label: "UV", value: num(o.uv) },
  ];
}

/** "hace 12 min" style relative label for an observation time. */
export function formatObservedAt(iso: string, now: Date = new Date()): string {
  const diffMin = Math.round((now.getTime() - new Date(iso).getTime()) / 60000);
  if (diffMin < 1) return "ahora mismo";
  if (diffMin < 60) return `hace ${diffMin} min`;
  const h = Math.floor(diffMin / 60);
  return `hace ${h} h`;
}
