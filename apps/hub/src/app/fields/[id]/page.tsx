import type { Metadata } from "next";
import { FieldDetail } from "@/components/fields/field-detail";

/**
 * The field name lives in browser storage, so the server cannot know it at
 * render time - hence a generic title rather than generateMetadata.
 */
export const metadata: Metadata = {
  title: "Parcela",
  description: "Contorno y datos de la parcela.",
};

/** Full-screen map view: FieldDetail breaks out of the dashboard padding and
 *  overlays its cards, so the page is just the component. */
export default function FieldDetailPage() {
  return <FieldDetail />;
}
