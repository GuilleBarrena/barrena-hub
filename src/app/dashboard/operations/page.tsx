import type { Metadata } from "next";
import { OperationList } from "@/components/operations/operation-list";

export const metadata: Metadata = {
  title: "Operaciones",
  description: "Trabajos que enlazan operario, parcela y vehículo.",
};

export default function OperationsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Operaciones
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Trabajos de campo: cada uno enlaza un operario, una parcela y, si procede,
          un vehículo.
        </p>
      </header>

      <OperationList />
    </div>
  );
}
