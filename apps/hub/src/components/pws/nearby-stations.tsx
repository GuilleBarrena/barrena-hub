"use client";

import type { NearbyStation, Units } from "@/lib/pws/types";
import { formatDistance } from "@/lib/pws/nearby";
import { formatObservedAt, formatTemp, formatWind, windCardinal } from "@/lib/pws/format";

/**
 * The list side of the field view: one card per nearby station. Pointing at a
 * card lifts `activeId`, which the map reads to pan — that hover-to-move link is
 * the whole point, so the handlers cover mouse and keyboard both.
 *
 * The list owns none of the "which stations" logic; it just renders whatever
 * the shared hook derived from the field's position.
 */
export function NearbyStations({
  stations,
  activeId,
  onActivate,
  units,
}: {
  stations: NearbyStation[];
  activeId: string | null;
  onActivate: (id: string | null) => void;
  units: Units;
}) {
  return (
    <div className="pointer-events-auto rounded-2xl bg-background/95 p-4 shadow-sm ring-1 ring-black/10 backdrop-blur">
      <p className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-primary">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-brand-primary" />
          Estaciones cercanas
        </span>
        <span className="font-normal normal-case tracking-normal text-muted-foreground/70">
          {stations.length}
        </span>
      </p>

      {stations.length === 0 ? (
        <p className="mt-3 text-[12px] text-muted-foreground">
          No hay estaciones registradas en el entorno de esta parcela.
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-1.5">
          {stations.map((station) => {
            const active = station.id === activeId;
            return (
              <li key={station.id}>
                <button
                  type="button"
                  onMouseEnter={() => onActivate(station.id)}
                  onMouseLeave={() => onActivate(null)}
                  onFocus={() => onActivate(station.id)}
                  onBlur={() => onActivate(null)}
                  aria-pressed={active}
                  className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left outline-none transition-colors
                              focus-visible:ring-2 focus-visible:ring-ring
                              ${active ? "bg-surface-2" : "hover:bg-surface-2/60"}`}
                >
                  <span
                    aria-hidden="true"
                    className={`size-2.5 shrink-0 rounded-full ring-2 transition-colors
                                ${active ? "bg-brand-primary ring-brand-primary/30" : "bg-brand-accent ring-transparent"}`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[13px] font-medium text-foreground">
                        {station.name}
                      </span>
                      <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                        {formatDistance(station.distanceM)}
                      </span>
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="tabular-nums text-foreground">
                        {formatTemp(station.observation.temperatureC, units)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {formatWind(station.observation.windSpeedKph, units)}{" "}
                        {windCardinal(station.observation.windDirDeg)}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {stations.length > 0 && (
        <p className="mt-3 text-[10px] text-muted-foreground">
          Datos de muestra · {formatObservedAt(stations[0].observation.observedAt)}
        </p>
      )}
    </div>
  );
}
