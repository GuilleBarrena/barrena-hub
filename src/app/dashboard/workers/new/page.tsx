import type { Metadata } from "next";
import Link from "next/link";
import { WorkerForm } from "@/components/workers/worker-form";

export const metadata: Metadata = {
  title: "Añadir operario",
  description: "Alta de un operario en la explotación.",
};

export default function NewWorkerPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <Link
          href="/dashboard/workers"
          className="text-[12px] text-muted-foreground underline-offset-4 hover:underline"
        >
          ← Operarios
        </Link>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Añadir operario
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registre a una persona y asígnela a una cuadrilla.
        </p>
      </header>

      <WorkerForm />
    </div>
  );
}
