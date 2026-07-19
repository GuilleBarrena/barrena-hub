import type { Metadata } from "next";
import { VehicleList } from "@/components/vehicles/vehicle-list";

export const metadata: Metadata = {
  title: "Vehículos",
  description: "Flota registrada en la explotación.",
};

export default function VehiclesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Vehículos
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Flota registrada en Finca La Esperanza.
        </p>
      </header>

      <VehicleList />
    </div>
  );
}
