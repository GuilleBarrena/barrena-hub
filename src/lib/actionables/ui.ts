import type { Esfuerzo, Prioridad } from "./types";

// Vocabulario visual compartido, alineado con los tokens de marca del panel
// (brand-primary, brand-accent, rojo para crítico).

export const PRIORIDAD_META: Record<
  Prioridad,
  { label: string; dot: string; texto: string; orden: number }
> = {
  critica: { label: "Crítica", dot: "bg-red-600", texto: "text-red-700", orden: 0 },
  alta: { label: "Alta", dot: "bg-brand-accent", texto: "text-brand-accent", orden: 1 },
  media: { label: "Media", dot: "bg-brand-primary", texto: "text-brand-primary", orden: 2 },
  baja: { label: "Baja", dot: "bg-muted-foreground", texto: "text-muted-foreground", orden: 3 },
};

export const ESFUERZO_LABEL: Record<Esfuerzo, string> = {
  rapido: "Rápido",
  moderado: "Moderado",
  alto: "Costoso",
};
