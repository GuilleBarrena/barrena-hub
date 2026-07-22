// ---------------------------------------------------------------------------
// Señales de contexto para un cultivo: qué alertas de la finca le afectan.
//
// Los datos meteorológicos y de alertas son de muestra (ver sample-data). Aquí
// solo cruzamos el nombre del cultivo con el texto de cada alerta para
// mostrar, sobre el mapa, lo que de verdad concierne a ese cultivo.
// ---------------------------------------------------------------------------

import { alerts } from "@/lib/sample-data";

export type CropAlert = (typeof alerts)[number];

/** Número de cultivo a partir de un nombre como "Cultivo 04" → 4. */
function plotNumber(name: string): number | null {
  const m = name.match(/(\d+)/);
  return m ? Number(m[1]) : null;
}

/**
 * Si el texto libre de una alerta menciona un cultivo concreto. Cubre tanto
 * referencias sueltas ("Cultivo 04") como rangos ("Cultivos 01-03").
 */
function detailMatchesPlot(detail: string, plot: number): boolean {
  const range = detail.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (range) {
    const a = Number(range[1]);
    const b = Number(range[2]);
    return plot >= Math.min(a, b) && plot <= Math.max(a, b);
  }
  const nums = detail.match(/\d+/g);
  return nums ? nums.map(Number).includes(plot) : false;
}

/** Alertas de la finca que afectan al cultivo indicado. */
export function alertsForCrop(cropName: string): CropAlert[] {
  const plot = plotNumber(cropName);
  if (plot == null) return [];
  return alerts.filter((a) => detailMatchesPlot(a.detail, plot));
}
