import {
  alerts,
  currentWeather,
  days,
  farmSummary,
  fleetActivity,
  precipitation,
  temperature,
} from "@/lib/sample-data";
import { SAMPLE_CROPS } from "@/lib/crops/seed";
import { SAMPLE_VEHICLES } from "@/lib/vehicles/seed";
import { VEHICLE_STATUS } from "@/lib/vehicles/types";
import { SAMPLE_WORKERS } from "@/lib/workers/seed";
import { WORKER_STATUS } from "@/lib/workers/types";

// ---------------------------------------------------------------------------
// Reúne TODOS los datos de entrada que vigila Hub (cultivos, flota, cuadrillas,
// meteo, alertas y actividad) en un único contexto que la capa de IA razona
// para producir acciones. En producción estas fuentes se sustituirían por
// integraciones reales; aquí son datos de muestra para que todo funcione de
// extremo a extremo.
// ---------------------------------------------------------------------------

export interface InstantaneaFinca {
  finca: string;
  resumen: typeof farmSummary;
  meteoActual: typeof currentWeather;
  cultivos: { nombre: string; tipoCultivo: string; hectareas: number }[];
  vehiculos: { nombre: string; tipo: string; estado: string; horas: number }[];
  operarios: { nombre: string; rol: string; cuadrilla: string; estado: string }[];
  alertas: { nivel: string; titulo: string; detalle: string }[];
  flota: typeof fleetActivity;
  prevision: { dia: string; tempMin: number; tempMax: number; lluviaMm: number }[];
}

export function reunirDatos(): InstantaneaFinca {
  return {
    finca: "Finca La Esperanza",
    resumen: farmSummary,
    meteoActual: currentWeather,
    cultivos: SAMPLE_CROPS.map((f) => ({
      nombre: f.name,
      tipoCultivo: f.cropType,
      hectareas: Math.round(f.areaHectares * 10) / 10,
    })),
    vehiculos: SAMPLE_VEHICLES.map((v) => ({
      nombre: v.name,
      tipo: v.vehicleType,
      estado: VEHICLE_STATUS[v.status].label,
      horas: v.engineHours,
    })),
    operarios: SAMPLE_WORKERS.map((w) => ({
      nombre: w.name,
      rol: w.role,
      cuadrilla: w.crew,
      estado: WORKER_STATUS[w.status].label,
    })),
    alertas: alerts.map((a) => ({
      nivel: a.level,
      titulo: a.title,
      detalle: a.detail,
    })),
    flota: fleetActivity,
    prevision: days.map((d, i) => ({
      dia: d,
      tempMin: temperature.min[i],
      tempMax: temperature.max[i],
      lluviaMm: precipitation[i],
    })),
  };
}

/** Serializa la instantánea a texto legible para alimentar al modelo. */
export function datosAContexto(d: InstantaneaFinca): string {
  const bloque = (titulo: string, cuerpo: string) => `### ${titulo}\n${cuerpo}`;

  return [
    `Explotación: ${d.finca}`,
    bloque(
      "Resumen",
      `Superficie ${d.resumen.hectares} · Vehículos activos ${d.resumen.activeVehicles} · Cobertura ${d.resumen.coverage} · Tareas abiertas ${d.resumen.openTasks}`,
    ),
    bloque(
      "Meteo actual",
      `Temperatura ${d.meteoActual.temperature} · Viento ${d.meteoActual.wind} · Humedad ${d.meteoActual.humidity} · Precipitación 24 h ${d.meteoActual.precipitation24h}`,
    ),
    bloque(
      "Previsión 7 días (mín/máx °C, lluvia mm)",
      d.prevision
        .map((p) => `${p.dia}: ${p.tempMin}/${p.tempMax} °C, ${p.lluviaMm} mm`)
        .join(" · "),
    ),
    bloque(
      "Alertas activas",
      d.alertas.map((a) => `[${a.nivel}] ${a.titulo} — ${a.detalle}`).join("\n"),
    ),
    bloque(
      "Cultivos",
      d.cultivos
        .map((p) => `${p.nombre}: ${p.tipoCultivo}, ${p.hectareas} ha`)
        .join("\n"),
    ),
    bloque(
      "Flota (vehículos y estado)",
      d.vehiculos
        .map((v) => `${v.nombre} (${v.tipo}) — ${v.estado}, ${v.horas} h motor`)
        .join("\n"),
    ),
    bloque(
      "Actividad reciente de flota",
      d.flota
        .map((f) => `${f.vehicle} en ${f.field}: ${f.status}, ${f.hours}`)
        .join("\n"),
    ),
    bloque(
      "Operarios y cuadrillas",
      d.operarios
        .map((w) => `${w.nombre} — ${w.rol}, ${w.cuadrilla}, ${w.estado}`)
        .join("\n"),
    ),
  ].join("\n\n");
}
