import type { Metadata } from "next";
import { WorkerList } from "@/components/workers/worker-list";

export const metadata: Metadata = {
  title: "Operarios",
  description: "Personal registrado en la explotación.",
};

export default function WorkersPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Operarios
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cuadrillas y personal de Finca La Esperanza.
        </p>
      </header>

      <WorkerList />
    </div>
  );
}
