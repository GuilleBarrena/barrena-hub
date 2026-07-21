import type { Metadata } from "next";

import { OperationCalendar } from "@/components/operations/operation-calendar";
import { OperationsViewTabs } from "@/components/operations/operations-view-tabs";

export const metadata: Metadata = {
  title: "Calendario de operaciones",
  description: "Las operaciones de campo organizadas por día en un calendario mensual.",
};

export default function OperationsCalendarPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Operaciones
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cada trabajo de campo situado en su día. Pulsa una operación para ver su detalle.
        </p>
      </header>

      <OperationsViewTabs />
      <OperationCalendar />
    </div>
  );
}
