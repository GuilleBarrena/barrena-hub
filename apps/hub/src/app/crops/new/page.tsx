import type { Metadata } from "next";
import { CropForm } from "@/components/crops/crop-form";

export const metadata: Metadata = {
  title: "Añadir parcela",
  description: "Dibuje el contorno de una parcela sobre el mapa.",
};

/** Full-screen drawing view: CropForm breaks out of the dashboard padding and
 *  overlays its controls, so the page is just the component. */
export default function NewCropPage() {
  return <CropForm />;
}
