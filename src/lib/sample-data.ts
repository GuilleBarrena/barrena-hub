/**
 * SAMPLE DATA - illustrative values for building out the dashboard UI.
 * None of this comes from a real sensor, station or API. Replace these
 * exports with real data sources before showing the dashboard to anyone.
 */

export const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] as const;

/** Daily temperature in °C: mean line, with the min-max band as context. */
export const temperatura = {
  media: [18, 20, 23, 25, 22, 19, 17],
  min: [11, 12, 14, 16, 14, 12, 10],
  max: [24, 27, 30, 32, 28, 25, 22],
};

/** Daily precipitation in mm. */
export const precipitacion = [0, 0, 2, 0, 8, 14, 3];

export const meteoAhora = {
  temperatura: "21,4 °C",
  viento: "14 km/h NO",
  humedad: "58 %",
  precipitacion24h: "3,2 mm",
};

export const resumenFinca = {
  hectareas: "248 ha",
  vehiculosActivos: "6",
  cobertura: "68 %",
  tareasAbiertas: "12",
};

export const alertas = [
  { nivel: "serious" as const, titulo: "Riesgo de helada", detalle: "Parcela 04 · madrugada del sábado" },
  { nivel: "warning" as const, titulo: "Viento sostenido", detalle: "Parcela 11 · pulverización desaconsejada" },
  { nivel: "good" as const, titulo: "Ventana de siembra", detalle: "Parcelas 01-03 · martes a jueves" },
];

export const actividad = [
  { vehiculo: "John Deere 6R", parcela: "Parcela 04", estado: "En curso", horas: "3,2 h" },
  { vehiculo: "New Holland T7", parcela: "Parcela 11", estado: "En curso", horas: "1,8 h" },
  { vehiculo: "Kubota M7", parcela: "Parcela 02", estado: "Detenido", horas: "0,0 h" },
  { vehiculo: "Fendt 700", parcela: "Parcela 07", estado: "Finalizado", horas: "6,5 h" },
];
