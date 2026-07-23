"use client";

import { useEffect, useState } from "react";

import { Panel } from "@/components/dashboard/primitives";
import { WeatherGlyph } from "./weather-glyph";
import { formatHectares, ringCentroid } from "@/lib/crops/geo";
import { getCropRepository } from "@/lib/crops/repository";
import type { Crop } from "@/lib/crops/types";
import {
  formatPercent,
  formatPrecip,
  formatTempShort,
  formatWind,
  tempUnitLabel,
  weekdayShort,
  windCardinal,
} from "@/lib/pws/format";
import { usePwsSettings } from "@/lib/pws/settings";
import type { DailyForecast, Units } from "@/lib/pws/types";
import { useForecast } from "@/lib/pws/use-forecast";

/**
 * The 7-day forecast for the meteo page, one finca at a time.
 *
 * Fincas come from the same repository the crops screens use; picking one drives
 * a real Open-Meteo forecast for its centroid (keyless, model data — not a
 * station reading). The presentation is a horizontal day strip rather than the
 * expandable rows the crop-detail overlay uses, because a wide dashboard has room
 * to show the whole week at a glance.
 */
export function MeteoForecast() {
  const { units } = usePwsSettings();
  const [crops, setCrops] = useState<Crop[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getCropRepository()
      .list()
      .then((rows) => active && setCrops(rows))
      .catch(() => active && setCrops([]));
    return () => {
      active = false;
    };
  }, []);

  const selected = crops?.find((c) => c.id === selectedId) ?? crops?.[0] ?? null;
  const center = selected ? ringCentroid(selected.ring) : null;

  // Called unconditionally so hook order is stable whatever the crop state is.
  const { state, reload } = useForecast(center);

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-primary">
          Predicción · próximos 7 días por finca
        </p>
        <p className="text-[11px] text-muted-foreground">
          Modelo local para cada finca · vía Open-Meteo
        </p>
      </div>

      {crops === null && (
        <p className="text-sm text-muted-foreground">Cargando fincas…</p>
      )}

      {crops !== null && crops.length === 0 && (
        <Panel title="No hay fincas todavía" subtitle="Dibuja un cultivo para ver su predicción.">
          <p className="text-sm text-muted-foreground">
            La predicción se calcula sobre el centro de cada finca; aún no hay ninguna.
          </p>
        </Panel>
      )}

      {crops !== null && crops.length > 0 && selected && (
        <>
          {/* Finca picker. */}
          <div className="mb-4 flex flex-wrap gap-2">
            {crops.map((crop) => {
              const active = crop.id === selected.id;
              return (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => setSelectedId(crop.id)}
                  aria-pressed={active}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                    active
                      ? "bg-brand-primary text-primary-foreground"
                      : "bg-surface-2 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {crop.name}
                </button>
              );
            })}
          </div>

          <Panel
            title={selected.name}
            subtitle={`${selected.cropType} · ${formatHectares(selected.areaHectares)} · temperaturas en ${tempUnitLabel(units)}`}
          >
            {state.status === "loading" && (
              <p className="text-sm text-muted-foreground">Cargando predicción…</p>
            )}

            {state.status === "error" && (
              <div>
                <p className="text-sm text-red-600">{state.message}</p>
                <button
                  type="button"
                  onClick={reload}
                  className="mt-2 text-sm font-medium text-brand-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Reintentar
                </button>
              </div>
            )}

            {state.status === "ready" && state.forecast.days.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No hay predicción disponible para esta finca.
              </p>
            )}

            {state.status === "ready" && state.forecast.days.length > 0 && (
              <ForecastStrip days={state.forecast.days} units={units} />
            )}
          </Panel>
        </>
      )}
    </section>
  );
}

function ForecastStrip({ days, units }: { days: DailyForecast[]; units: Units }) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {days.map((day, i) => (
        <DayColumn key={day.date || i} day={day} index={i} units={units} />
      ))}
    </div>
  );
}

function DayColumn({
  day,
  index,
  units,
}: {
  day: DailyForecast;
  index: number;
  units: Units;
}) {
  const label = index === 0 ? "Hoy" : weekdayShort(day.date);
  const isToday = index === 0;

  return (
    <div
      className={`flex min-w-[5rem] flex-1 flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-center ${
        isToday ? "bg-surface-2" : ""
      }`}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>

      <WeatherGlyph
        condition={day.condition}
        title={day.conditionPhrase || undefined}
        className="size-7 text-brand-primary"
      />

      <span className="line-clamp-2 min-h-[2.4em] text-[10px] leading-tight text-muted-foreground">
        {day.conditionPhrase}
      </span>

      <span className="tabular-nums">
        <span className="text-sm font-semibold text-foreground">
          {day.tempMaxC !== null ? formatTempShort(day.tempMaxC, units) : "—"}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {" / "}
          {day.tempMinC !== null ? formatTempShort(day.tempMinC, units) : "—"}
        </span>
      </span>

      {day.precipChancePct > 0 ? (
        <span className="text-[10px] tabular-nums text-brand-primary">
          {formatPercent(day.precipChancePct)} · {formatPrecip(day.qpfMm, units)}
        </span>
      ) : (
        <span className="text-[10px] text-muted-foreground/70">sin lluvia</span>
      )}

      <span className="text-[10px] tabular-nums text-muted-foreground">
        {formatWind(day.windSpeedKph, units)} {windCardinal(day.windDirDeg)}
      </span>
    </div>
  );
}
