// ---------------------------------------------------------------------------
// Señales de contexto para una parcela: qué alertas de la finca le afectan.
//
// Los datos meteorológicos y de alertas son de muestra (ver sample-data). Aquí
// solo cruzamos el nombre de la parcela con el texto de cada alerta para
// mostrar, sobre el mapa, lo que de verdad concierne a esa parcela.
// ---------------------------------------------------------------------------

import { alerts } from "@/lib/sample-data";

export type FieldAlert = (typeof alerts)[number];

/** Número de parcela a partir de un nombre como "Parcela 04" → 4. */
function plotNumber(name: string): number | null {
  const m = name.match(/(\d+)/);
  return m ? Number(m[1]) : null;
}

/**
 * Si el texto libre de una alerta menciona una parcela concreta. Cubre tanto
 * referencias sueltas ("Parcela 04") como rangos ("Parcelas 01-03").
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

/** Alertas de la finca que afectan a la parcela indicada. */
export function alertsForField(fieldName: string): FieldAlert[] {
  const plot = plotNumber(fieldName);
  if (plot == null) return [];
  return alerts.filter((a) => detailMatchesPlot(a.detail, plot));
}
