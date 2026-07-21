import type { Metadata } from "next";
import Link from "next/link";
import { VehicleDetail } from "@/components/vehicles/vehicle-detail";

/**
 * The vehicle name lives in browser storage, so the server cannot know it at
 * render time - hence a generic title rather than generateMetadata.
 */
export const metadata: Metadata = {
  title: "Vehículo",
  description: "Ficha del vehículo.",
};

export default function VehicleDetailPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <Link
          href="/vehicles"
          className="text-[12px] text-muted-foreground underline-offset-4 hover:underline"
        >
          ← Vehículos
        </Link>
      </header>

      <VehicleDetail />
    </div>
  );
}
