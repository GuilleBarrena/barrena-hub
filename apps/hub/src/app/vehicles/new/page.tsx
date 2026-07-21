import type { Metadata } from "next";
import Link from "next/link";
import { VehicleForm } from "@/components/vehicles/vehicle-form";

export const metadata: Metadata = {
  title: "Añadir vehículo",
  description: "Alta de un vehículo en la flota.",
};

export default function NewVehiclePage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <Link
          href="/vehicles"
          className="text-[12px] text-muted-foreground underline-offset-4 hover:underline"
        >
          ← Vehículos
        </Link>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Añadir vehículo
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registre una máquina en la flota de la explotación.
        </p>
      </header>

      <VehicleForm />
    </div>
  );
}
