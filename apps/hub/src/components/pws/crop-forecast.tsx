"use client";

import Link from "next/link";

import type { Units } from "@/lib/pws/types";
import type { DailyForecast } from "@/lib/pws/types";
import type { ForecastState } from "@/lib/pws/use-forecast";
import {
  capitalize,
  formatLocalHm,
  formatPercent,
  formatPrecip,
  formatTemp,
  formatWind,
  windCardinal,
} from "@/lib/pws/format";
import { WeatherGlyph } from "./weather-glyph";

/**
 * The 7-day forecast for the field, one expandable row per day.
 *
 * Same card shell and state machine as `NearbyStations` so the two weather
 * panels read as a set: when there's no API key it prompts to configure one
 * rather than inventing data, and it surfaces load/error states the same way.
 * A collapsed row is a compact strip (glyph · day · precip chance · min→max with
 * a shared-scale range bar); expanding it reveals the full daily detail the
 * forecast product carries — wind, humidity, cloud cover, UV, sun times and the
 * narrative — because "as much data as possible" is the whole point here.
 */
export function CropForecast({
  state,
  units,
  onRetry,
}: {
  state: ForecastState;
  units: Units;
  onRetry: () => void;
}) {
  return (
    <div className="pointer-events-auto rounded-2xl bg-background/95 p-4 shadow-sm ring-1 ring-black/10 backdrop-blur">
      <p className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-primary">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-brand-primary" />
          Predicción · 7 días
        </span>
        {state.status === "ready" && (
          <span className="font-normal normal-case tracking-normal text-muted-foreground/70">
            {state.forecast.days.length}
          </span>
        )}
      </p>

      {state.status === "unconfigured" && (
        <div className="mt-3">
          <p className="text-[12px] text-muted-foreground">
            Configura la API meteorológica para ver la predicción a 7 días de esta zona.
          </p>
          <Link
            href="/settings"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Configurar API →
          </Link>
        </div>
      )}

      {state.status === "loading" && (
        <p className="mt-3 text-[12px] text-muted-foreground">Cargando predicción…</p>
      )}

      {state.status === "error" && (
        <div className="mt-3">
          <p className="text-[12px] text-red-600">{state.message}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-[12px] font-medium text-brand-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            Reintentar
          </button>
        </div>
      )}

      {state.status === "ready" && state.forecast.days.length === 0 && (
        <p className="mt-3 text-[12px] text-muted-foreground">
          No hay predicción disponible para este cultivo.
        </p>
      )}

      {state.status === "ready" && state.forecast.days.length > 0 && (
        <ForecastDays days={state.forecast.days} units={units} />
      )}
    </div>
  );
}

function ForecastDays({ days, units }: { days: DailyForecast[]; units: Units }) {
  // One temperature scale shared by every row, so the range bars are directly
  // comparable across the week rather than each self-normalizing.
  const temps = days
    .flatMap((d) => [d.tempMinC, d.tempMaxC])
    .filter((n): n is number => n !== null);
  const lo = temps.length ? Math.min(...temps) : 0;
  const hi = temps.length ? Math.max(...temps) : 1;
  const span = hi - lo || 1;
  const pct = (v: number) => ((v - lo) / span) * 100;

  return (
    <>
      <ul className="mt-3 flex flex-col divide-y divide-foreground/5">
        {days.map((day, i) => (
          <ForecastRow key={day.date || i} day={day} index={i} units={units} pct={pct} />
        ))}
      </ul>
      <p className="mt-3 text-[10px] text-muted-foreground">
        Predicción diaria · vía Weather Underground
      </p>
    </>
  );
}

/** "Hoy" for the first row, otherwise a 3-letter day label. */
function dayLabel(day: DailyForecast, index: number): string {
  if (index === 0) return "Hoy";
  return capitalize(day.dayName).slice(0, 3);
}

/** Day-of-month from the ISO date, for the small secondary label. */
function dayOfMonth(date: string): string {
  const d = Number(date.slice(8, 10));
  return Number.isFinite(d) && d > 0 ? String(d) : "";
}

function ForecastRow({
  day,
  index,
  units,
  pct,
}: {
  day: DailyForecast;
  index: number;
  units: Units;
  pct: (v: number) => number;
}) {
  const hasRange = day.tempMinC !== null && day.tempMaxC !== null;

  return (
    <li>
      <details className="group py-2 first:pt-0 last:pb-0">
        <summary className="grid cursor-pointer list-none grid-cols-[1.25rem_2.75rem_1fr] items-center gap-2 marker:content-none">
          <WeatherGlyph
            code={day.iconCode}
            title={day.conditionPhrase || undefined}
            className="size-5 text-brand-primary"
          />

          <span className="min-w-0">
            <span className="block text-[13px] font-medium capitalize leading-tight text-foreground">
              {dayLabel(day, index)}
            </span>
            <span className="block text-[10px] tabular-nums leading-tight text-muted-foreground">
              {day.precipChancePct > 0 ? `${formatPercent(day.precipChancePct)} lluvia` : dayOfMonth(day.date)}
            </span>
          </span>

          {/* min → range bar → max, on the shared week scale. */}
          <span className="flex items-center gap-1.5">
            <span className="w-10 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
              {day.tempMinC !== null ? formatTemp(day.tempMinC, units) : "—"}
            </span>
            <span className="relative h-1 flex-1 rounded-full bg-surface-2">
              {hasRange && (
                <span
                  className="absolute inset-y-0 rounded-full bg-[var(--color-chart-temp)]"
                  style={{
                    left: `${pct(day.tempMinC as number)}%`,
                    right: `${100 - pct(day.tempMaxC as number)}%`,
                  }}
                />
              )}
            </span>
            <span className="w-10 shrink-0 text-[11px] font-medium tabular-nums text-foreground">
              {day.tempMaxC !== null ? formatTemp(day.tempMaxC, units) : "—"}
            </span>
          </span>
        </summary>

        <ForecastDetail day={day} units={units} />
      </details>
    </li>
  );
}

function ForecastDetail({ day, units }: { day: DailyForecast; units: Units }) {
  const rows: [string, string][] = [
    ["Condición", day.conditionPhrase || "—"],
    ["Prob. lluvia", formatPercent(day.precipChancePct)],
    ["Precip.", formatPrecip(day.qpfMm, units)],
    ["Viento", `${formatWind(day.windSpeedKph, units)} ${windCardinal(day.windDirDeg)}`],
    ["Humedad", formatPercent(day.humidityPct)],
    ["Nubosidad", day.cloudCoverPct !== null ? formatPercent(day.cloudCoverPct) : "—"],
    ["UV", String(day.uvIndex)],
    ["Sol", `${formatLocalHm(day.sunriseLocal)}–${formatLocalHm(day.sunsetLocal)}`],
  ];
  if (day.qpfSnowCm > 0) rows.push(["Nieve", `${day.qpfSnowCm} cm`]);

  return (
    <div className="mt-2.5 rounded-lg bg-surface p-3">
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-2">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              {k}
            </dt>
            <dd className="text-right text-[11px] tabular-nums text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
      {day.narrative && (
        <p className="mt-2.5 border-t border-foreground/5 pt-2.5 text-[11px] leading-relaxed text-muted-foreground">
          {day.narrative}
        </p>
      )}
    </div>
  );
}
