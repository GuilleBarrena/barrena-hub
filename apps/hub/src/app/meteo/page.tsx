import type { Metadata } from "next";
import { Panel } from "@/components/dashboard/primitives";
import { PrecipitationChart } from "@/components/dashboard/precipitation-chart";
import { TemperatureChart } from "@/components/dashboard/temperature-chart";
import { PwsNetwork } from "@/components/pws/pws-network";

export const metadata: Metadata = {
  title: "Meteo",
  description: "Red de estaciones meteorológicas personales y predicción local.",
};

export default function MeteoPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Meteo
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lecturas en directo de las estaciones cercanas y predicción para Finca La Esperanza.
        </p>
      </header>

      <PwsNetwork />

      {/* Two measures, two scales -> two charts. Never a second y-axis. */}
      <div className="mt-8">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-primary">
          Predicción · próximos 7 días
        </p>
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Temperatura" subtitle="Media diaria y rango mínima-máxima, en °C.">
            <TemperatureChart />
          </Panel>

          <Panel title="Precipitación" subtitle="Acumulado diario previsto, en mm.">
            <PrecipitationChart />
          </Panel>
        </div>
      </div>

      <p className="mt-6 text-[11px] text-muted-foreground">
        Todos los valores mostrados son datos de muestra; no proceden de ninguna
        estación ni servicio de predicción reales.
      </p>
    </div>
  );
}
