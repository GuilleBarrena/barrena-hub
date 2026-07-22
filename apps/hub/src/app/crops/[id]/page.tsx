import type { Metadata } from "next";
import { CropDetail } from "@/components/crops/crop-detail";

/**
 * The crop name lives in browser storage, so the server cannot know it at
 * render time - hence a generic title rather than generateMetadata.
 */
export const metadata: Metadata = {
  title: "Parcela",
  description: "Contorno y datos de la parcela.",
};

/** Full-screen map view: CropDetail breaks out of the dashboard padding and
 *  overlays its cards, so the page is just the component. */
export default function CropDetailPage() {
  return <CropDetail />;
}
