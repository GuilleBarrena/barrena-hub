import type { Metadata } from "next";
import { AlertRow, Panel, StatTile } from "@/components/dashboard/primitives";
import { ActionablesPanel } from "@/components/dashboard/actionables-panel";
import { alerts, farmSummary, fleetActivity } from "@/lib/sample-data";

export const metadata: Metadata = {
  title: "Inicio",
  description: "Resumen operativo de la explotación.",
};

const STATUS_COLOR: Record<string, string> = {
  "En curso": "text-brand-primary",
  Detenido: "text-brand-accent",
  Finalizado: "text-muted-foreground",
};

export default function DashboardHome() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Inicio
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen operativo de Finca La Esperanza.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Superficie" value={farmSummary.hectares} hint="12 cultivos" />
        <StatTile label="Vehículos activos" value={farmSummary.activeVehicles} hint="de 9 en flota" />
        <StatTile label="Cobertura" value={farmSummary.coverage} hint="campaña en curso" />
        <StatTile label="Tareas abiertas" value={farmSummary.openTasks} hint="4 vencen hoy" />
      </div>

      {/* Capa de IA: convierte todos los datos de entrada en acciones. */}
      <div className="mt-4">
        <ActionablesPanel />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Panel
          title="Actividad de flota"
          subtitle="Últimas pasadas registradas por vehículo."
          className="lg:col-span-3"
        >
          {/* Wide content scrolls inside its own container */}
          <div className="-mx-1 overflow-x-auto px-1">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Vehículo", "Cultivo", "Estado", "Horas"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fleetActivity.map((row) => (
                  <tr key={row.vehicle} className="border-b border-border/60 last:border-0">
                    <td className="py-2.5 font-medium text-foreground">{row.vehicle}</td>
                    <td className="py-2.5 text-muted-foreground">{row.field}</td>
                    <td className={`py-2.5 font-medium ${STATUS_COLOR[row.status] ?? ""}`}>
                      {row.status}
                    </td>
                    <td className="py-2.5 tabular-nums text-muted-foreground">{row.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Alertas"
          subtitle="Avisos activos sobre la explotación."
          className="lg:col-span-2"
        >
          <ul className="divide-y divide-border">
            {alerts.map((a) => (
              <AlertRow key={a.title} {...a} />
            ))}
          </ul>
        </Panel>
      </div>

      <p className="mt-6 text-[11px] text-muted-foreground">
        Todos los valores mostrados son datos de muestra.
      </p>
    </div>
  );
}
