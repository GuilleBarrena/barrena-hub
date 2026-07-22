"use client";

import Link from "next/link";

import { Panel, StatTile } from "@/components/dashboard/primitives";
import { StationObservation } from "@/components/pws/station-observation";
import { FARM_CENTER } from "@/lib/crops/seed";
import { usePwsSettings } from "@/lib/pws/settings";
import { useNearbyStations } from "@/lib/pws/use-nearby-stations";
import {
  formatObservedAt,
  formatPrecip,
  formatTemp,
  formatWind,
  windCardinal,
} from "@/lib/pws/format";
import { formatDistance } from "@/lib/pws/nearby";

/**
 * The PWS network readout for the meteo page: real stations around the farm,
 * with a headline from the nearest one. With no API key it prompts to configure
 * it — there is no sample fallback.
 */
export function PwsNetwork() {
  const { units } = usePwsSettings();
  const { state, reload } = useNearbyStations(FARM_CENTER);

  return (
    <section>
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-primary">
        Red de estaciones · vía Weather Underground
      </p>

      {state.status === "unconfigured" && (
        <Panel
          title="Conecta tu API meteorológica"
          subtitle="El servicio lee las estaciones de Weather Underground con tu API key."
        >
          <p className="text-sm text-muted-foreground">
            Aún no hay ninguna API key configurada, así que no se pueden traer lecturas reales.
          </p>
          <Link
            href="/settings"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Configurar API →
          </Link>
        </Panel>
      )}

      {state.status === "loading" && (
        <p className="text-sm text-muted-foreground">Cargando estaciones cercanas…</p>
      )}

      {state.status === "error" && (
        <Panel title="No se pudieron cargar las estaciones" subtitle="Revisa la configuración de la API.">
          <p className="text-sm text-red-600">{state.message}</p>
          <button
            type="button"
            onClick={reload}
            className="mt-3 text-sm font-medium text-brand-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            Reintentar
          </button>
        </Panel>
      )}

      {state.status === "ready" && state.stations.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No se han encontrado estaciones públicas alrededor de la finca.
        </p>
      )}

      {state.status === "ready" && state.stations.length > 0 && (
        <>
          {(() => {
            const lead = state.stations[0];
            const o = lead.observation;
            return (
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
                <StatTile label="Humedad relativa" value={`${o.humidityPct} %`} hint="estación más cercana" />
                <StatTile
                  label="Precipitación hoy"
                  value={formatPrecip(o.precipTotalMm, units)}
                  hint="acumulado desde medianoche"
                />
              </div>
            );
          })()}

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {state.stations.map((station) => (
              <Panel
                key={station.id}
                title={station.name}
                subtitle={`${station.id} · ${formatDistance(station.distanceM)} · ${formatObservedAt(
                  station.observation.observedAt,
                )}`}
              >
                <StationObservation observation={station.observation} units={units} columns={4} />
              </Panel>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
