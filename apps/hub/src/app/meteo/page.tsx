import type { Metadata } from "next";
import { MeteoForecast } from "@/components/pws/meteo-forecast";
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
          Lecturas en directo de las estaciones cercanas y predicción a 7 días de cada finca.
        </p>
      </header>

      <PwsNetwork />

      <div className="mt-8">
        <MeteoForecast />
      </div>

      <p className="mt-6 text-[11px] text-muted-foreground">
        Estaciones vía Weather Underground (requiere API key); predicción diaria vía
        Open-Meteo, calculada sobre el centro de cada finca.
      </p>
    </div>
  );
}
