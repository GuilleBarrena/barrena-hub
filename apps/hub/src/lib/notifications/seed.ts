import type { Notificacion } from "./types";

// ---------------------------------------------------------------------------
// Notificaciones de muestra que "manda el Agente".
//
// Deterministas y ancladas al mismo dominio que la capa de accionables (helada,
// cosechadora, pulverización, cuadrillas, siembra), de modo que el panel es
// demostrable de extremo a extremo sin conexión. Cada una lleva, cuando tiene
// sentido, un destino donde accionarla.
//
// Los sellos de tiempo se calculan relativos a "ahora" para que siempre se lean
// recientes; por eso es una función y no una constante.
// ---------------------------------------------------------------------------

const MINUTO = 60_000;

/** ISO de hace `minutos` minutos. */
function hace(minutos: number): string {
  return new Date(Date.now() - minutos * MINUTO).toISOString();
}

export function notificacionesSemilla(): Notificacion[] {
  return [
    {
      id: "ntf-helada-p04",
      titulo: "Helada prevista el sábado en Parcela 04",
      mensaje:
        "La previsión marca mínimas de 0 °C de madrugada y el viñedo está en brotación. Conviene preparar protección antihelada.",
      prioridad: "critica",
      ambito: "Meteo",
      creadaEn: hace(8),
      href: "/agent?accion=Proteger%20Parcela%2004%20ante%20la%20helada%20del%20s%C3%A1bado",
      accionLabel: "Preparar plan",
    },
    {
      id: "ntf-cosechadora",
      titulo: "Claas Lexion fuera de servicio",
      mensaje:
        "La única cosechadora de la flota está parada justo antes de la ventana de recolección. Requiere diagnóstico urgente.",
      prioridad: "critica",
      ambito: "Flota",
      creadaEn: hace(34),
      href: "/vehicles",
      accionLabel: "Ver flota",
    },
    {
      id: "ntf-viento-p11",
      titulo: "Viento desaconseja pulverizar en Parcela 11",
      mensaje:
        "Rachas sostenidas por encima de 20 km/h hoy. Pulverizar ahora provoca deriva; hay ventana de viento flojo a media semana.",
      prioridad: "alta",
      ambito: "Meteo",
      creadaEn: hace(96),
      href: "/operations",
      accionLabel: "Reprogramar",
    },
    {
      id: "ntf-cuadrilla-b",
      titulo: "Cuadrilla B por debajo de cobertura",
      mensaje:
        "Diego Salas está de baja y Julián Cid sigue sin asignar. Conviene reequilibrar antes del pico de trabajo de la semana.",
      prioridad: "alta",
      ambito: "Cuadrillas",
      creadaEn: hace(180),
      href: "/workers",
      accionLabel: "Ver operarios",
    },
    {
      id: "ntf-siembra",
      titulo: "Ventana de siembra favorable martes-jueves",
      mensaje:
        "Suelo en tempero y sin lluvia relevante hasta el viernes: mejor momento para sembrar Parcelas 01-03 sin compactar.",
      prioridad: "media",
      ambito: "Operación",
      creadaEn: hace(420),
      href: "/fields",
      accionLabel: "Ver parcelas",
    },
  ];
}
