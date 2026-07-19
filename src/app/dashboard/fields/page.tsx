import type { Metadata } from "next";
import { FieldList } from "@/components/fields/field-list";

export const metadata: Metadata = {
  title: "Parcelas",
  description: "Listado de parcelas de la explotación.",
};

export default function FieldsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Parcelas
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Superficie registrada en Finca La Esperanza.
        </p>
      </header>

      <FieldList />
    </div>
  );
}
