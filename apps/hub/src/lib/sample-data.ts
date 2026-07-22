/**
 * SAMPLE DATA - illustrative values for building out the dashboard UI.
 * None of this comes from a real sensor, station or API. Replace these
 * exports with real data sources before showing the dashboard to anyone.
 *
 * Identifiers are English; display strings stay Spanish, matching the UI.
 */

export const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] as const;

/** Daily temperature in °C: mean line, with the min-max band as context. */
export const temperature = {
  mean: [18, 20, 23, 25, 22, 19, 17],
  min: [11, 12, 14, 16, 14, 12, 10],
  max: [24, 27, 30, 32, 28, 25, 22],
};

/** Daily precipitation in mm. */
export const precipitation = [0, 0, 2, 0, 8, 14, 3];

export const currentWeather = {
  temperature: "21,4 °C",
  wind: "14 km/h NO",
  humidity: "58 %",
  precipitation24h: "3,2 mm",
};

export const farmSummary = {
  hectares: "248 ha",
  activeVehicles: "6",
  coverage: "68 %",
  openTasks: "12",
};

export const alerts = [
  {
    level: "serious" as const,
    title: "Riesgo de helada",
    detail: "Cultivo 04 · madrugada del sábado",
  },
  {
    level: "warning" as const,
    title: "Viento sostenido",
    detail: "Cultivo 11 · pulverización desaconsejada",
  },
  {
    level: "good" as const,
    title: "Ventana de siembra",
    detail: "Cultivos 01-03 · martes a jueves",
  },
];

export const fleetActivity = [
  { vehicle: "John Deere 6R", field: "Cultivo 04", status: "En curso", hours: "3,2 h" },
  { vehicle: "New Holland T7", field: "Cultivo 11", status: "En curso", hours: "1,8 h" },
  { vehicle: "Kubota M7", field: "Cultivo 02", status: "Detenido", hours: "0,0 h" },
  { vehicle: "Fendt 700", field: "Cultivo 07", status: "Finalizado", hours: "6,5 h" },
];
