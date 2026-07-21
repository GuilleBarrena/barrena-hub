import type { Metadata } from "next";
import Link from "next/link";
import { OperationDetail } from "@/components/operations/operation-detail";

/**
 * The operation lives in browser storage, so the server cannot know its name at
 * render time - hence a generic title rather than generateMetadata.
 */
export const metadata: Metadata = {
  title: "Operación",
  description: "Ficha de la operación y seguimiento del vehículo.",
};

export default function OperationDetailPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <Link
          href="/dashboard/operations"
          className="text-[12px] text-muted-foreground underline-offset-4 hover:underline"
        >
          ← Operaciones
        </Link>
      </header>

      <OperationDetail />
    </div>
  );
}
