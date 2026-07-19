import type { Metadata } from "next";
import Link from "next/link";
import { FieldDetail } from "@/components/fields/field-detail";

/**
 * The field name lives in browser storage, so the server cannot know it at
 * render time - hence a generic title rather than generateMetadata.
 */
export const metadata: Metadata = {
  title: "Parcela",
  description: "Contorno y datos de la parcela.",
};

export default function FieldDetailPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <Link
          href="/dashboard/fields"
          className="text-[12px] text-muted-foreground underline-offset-4 hover:underline"
        >
          ← Parcelas
        </Link>
      </header>

      <FieldDetail />
    </div>
  );
}
