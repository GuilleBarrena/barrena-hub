import type { Metadata } from "next";
import Link from "next/link";
import { OperationForm } from "@/components/operations/operation-form";

export const metadata: Metadata = {
  title: "Añadir operación",
  description: "Alta de una operación de campo.",
};

export default function NewOperationPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <Link
          href="/operations"
          className="text-[12px] text-muted-foreground underline-offset-4 hover:underline"
        >
          ← Operaciones
        </Link>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Añadir operación
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enlace un operario y una parcela, y opcionalmente un vehículo.
        </p>
      </header>

      <OperationForm />
    </div>
  );
}
