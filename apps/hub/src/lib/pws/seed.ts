/**
 * SAMPLE PWS stations scattered around the Olite (Navarra) farm, so that any
 * field opens with a plausible set of neighbours. None of these are real
 * Weather Underground stations and none of the readings come from a sensor —
 * they exist purely to build out the UI. Replace `SAMPLE_STATIONS` with a live
 * `/v2/pws/observations/current` call (keyed off the field centroid) to go real.
 *
 * Identifiers are WU-style (`I` + place + number); display names stay Spanish.
 */

import type { PwsObservation, PwsStation } from "./types";

function obs(o: Partial<PwsObservation>): PwsObservation {
  return {
    observedAt: "2026-07-21T09:00:00.000Z",
    temperatureC: 24,
    dewpointC: 13,
    humidityPct: 55,
    windDirDeg: 315,
    windSpeedKph: 12,
    windGustKph: 24,
    pressureHpa: 1016,
    precipRateMm: 0,
    precipTotalMm: 0,
    uv: 5,
    solarRadiationWm2: 620,
    ...o,
  };
}

export const SAMPLE_STATIONS: PwsStation[] = [
  {
    id: "IOLITE12",
    name: "Olite — Casco viejo",
    provider: "weather_underground",
    location: [42.4812, -1.6503],
    observation: obs({ temperatureC: 24.3, humidityPct: 52, windSpeedKph: 14, windGustKph: 27 }),
  },
  {
    id: "ITAFALLA7",
    name: "Tafalla — La Nava",
    provider: "weather_underground",
    location: [42.5148, -1.6741],
    observation: obs({
      temperatureC: 23.1,
      humidityPct: 58,
      windDirDeg: 300,
      windSpeedKph: 18,
      windGustKph: 33,
      precipRateMm: 0.4,
      precipTotalMm: 2.1,
    }),
  },
  {
    id: "IPITILLAS3",
    name: "Pitillas — Laguna",
    provider: "weather_underground",
    location: [42.4459, -1.6122],
    observation: obs({
      temperatureC: 25.6,
      humidityPct: 47,
      windDirDeg: 330,
      windSpeedKph: 9,
      windGustKph: 19,
      uv: 6,
      solarRadiationWm2: 710,
    }),
  },
  {
    id: "IBEIRE2",
    name: "Beire — Alto",
    provider: "weather_underground",
    location: [42.4623, -1.6389],
    observation: obs({ temperatureC: 24.8, humidityPct: 50, windSpeedKph: 11, dewpointC: 12 }),
  },
  {
    id: "ISANMARTIN9",
    name: "San Martín de Unx",
    provider: "weather_underground",
    location: [42.5271, -1.5876],
    observation: obs({
      temperatureC: 22.4,
      humidityPct: 61,
      windDirDeg: 290,
      windSpeedKph: 16,
      windGustKph: 30,
      pressureHpa: 1014,
    }),
  },
  {
    id: "IMURILLO4",
    name: "Murillo el Cuende",
    provider: "weather_underground",
    location: [42.4358, -1.6604],
    observation: obs({
      temperatureC: 25.1,
      humidityPct: 49,
      windSpeedKph: 13,
      windGustKph: 25,
      precipTotalMm: 0,
    }),
  },
];
