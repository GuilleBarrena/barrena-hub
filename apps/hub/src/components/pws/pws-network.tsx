"use client";

import Link from "next/link";

import { Panel, StatTile } from "@/components/dashboard/primitives";
import { StationObservation } from "@/components/pws/station-observation";
import { SAMPLE_STATIONS } from "@/lib/pws/seed";
import { PROVIDER_LABELS, usePwsSettings } from "@/lib/pws/settings";
import {
  formatObservedAt,
  formatPrecip,
  formatTemp,
  formatWind,
  windCardinal,
} from "@/lib/pws/format";

/**
 * The PWS network readout for the meteo page: a headline from a representative
 * station, then every station in the network with its normalized readings.
 *
 * Units and the provider label come from settings (the one place they're
 * configured); the stations themselves don't — they're the sample network.
 */
export function PwsNetwork() {
  const { units, provider, apiKey } = usePwsSettings();
  const stations = SAMPLE_STATIONS;
  // Representative station for the headline tiles.
  const lead = stations[0];
  const o = lead.observation;

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-primary">
          Red de estaciones · vía {PROVIDER_LABELS[provider]}
        </p>
        {apiKey.trim() === "" && (
          <Link
            href="/settings"
            className="rounded-full bg-surface-2 px-3 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            API sin configurar · Ajustes →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label="Temperatura"
          value={formatTemp(o.temperatureC, units)}
          hint={`${lead.name} · punto de rocío ${formatTemp(o.dewpointC, units)}`}
        />
        <StatTile
          label="Viento"
          value={`${formatWind(o.windSpeedKph, units)} ${windCardinal(o.windDirDeg)}`}
          hint={`racha ${formatWind(o.windGustKph, units)}`}
        />
        <StatTile label="Humedad relativa" value={`${o.humidityPct} %`} hint="media de la estación" />
        <StatTile
          label="Precipitación hoy"
          value={formatPrecip(o.precipTotalMm, units)}
          hint="acumulado desde medianoche"
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {stations.map((station) => (
          <Panel
            key={station.id}
            title={station.name}
            subtitle={`${station.id} · ${formatObservedAt(station.observation.observedAt)}`}
          >
            <StationObservation observation={station.observation} units={units} columns={4} />
          </Panel>
        ))}
      </div>
    </section>
  );
}
