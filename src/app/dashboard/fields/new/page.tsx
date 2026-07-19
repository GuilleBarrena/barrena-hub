import type { Metadata } from "next";
import Link from "next/link";
import { FieldForm } from "@/components/fields/field-form";

export const metadata: Metadata = {
  title: "Añadir parcela",
  description: "Dibuje el contorno de una parcela sobre el mapa.",
};

export default function NewFieldPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <Link
          href="/dashboard/fields"
          className="text-[12px] text-muted-foreground underline-offset-4 hover:underline"
        >
          ← Parcelas
        </Link>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Añadir parcela
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Haga clic sobre el mapa para marcar los vértices del contorno y cierre el
          polígono para calcular la superficie.
        </p>
      </header>

      <FieldForm />
    </div>
  );
}
