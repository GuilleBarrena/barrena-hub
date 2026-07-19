import type { Metadata } from "next";
import { Panel, StatTile } from "@/components/dashboard/primitives";
import { PrecipitationChart } from "@/components/dashboard/precipitation-chart";
import { TemperatureChart } from "@/components/dashboard/temperature-chart";
import { meteoAhora } from "@/lib/sample-data";

export const metadata: Metadata = {
  title: "Meteo",
  description: "Predicción local y alertas meteorológicas por finca.",
};

export default function MeteoPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Meteo
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Predicción local para Finca La Esperanza · próximos 7 días.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Temperatura" value={meteoAhora.temperatura} hint="sensación 20,1 °C" />
        <StatTile label="Viento" value={meteoAhora.viento} hint="racha 26 km/h" />
        <StatTile label="Humedad relativa" value={meteoAhora.humedad} hint="punto de rocío 12 °C" />
        <StatTile label="Precipitación 24 h" value={meteoAhora.precipitacion24h} hint="acumulado" />
      </div>

      {/* Two measures, two scales -> two charts. Never a second y-axis. */}
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Temperatura" subtitle="Media diaria y rango mínima-máxima, en °C.">
          <TemperatureChart />
        </Panel>

        <Panel title="Precipitación" subtitle="Acumulado diario previsto, en mm.">
          <PrecipitationChart />
        </Panel>
      </div>

      <p className="mt-6 text-[11px] text-muted-foreground">
        Todos los valores mostrados son datos de muestra; no proceden de ninguna
        estación ni servicio de predicción.
      </p>
    </div>
  );
}
