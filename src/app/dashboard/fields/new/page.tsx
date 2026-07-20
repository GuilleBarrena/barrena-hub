import type { Metadata } from "next";
import { FieldForm } from "@/components/fields/field-form";

export const metadata: Metadata = {
  title: "Añadir parcela",
  description: "Dibuje el contorno de una parcela sobre el mapa.",
};

/** Full-screen drawing view: FieldForm breaks out of the dashboard padding and
 *  overlays its controls, so the page is just the component. */
export default function NewFieldPage() {
  return <FieldForm />;
}
