// ---------------------------------------------------------------------------
// Notificaciones — tipos del dominio.
//
// Una notificación es algo que el Agente de Hub te empuja para accionar:
// un aviso derivado de los datos de la finca con, cuando procede, un destino
// concreto donde resolverlo. Reutiliza la escala de prioridad de la capa de
// accionables para mantener un vocabulario visual único en todo el panel.
//
// Identificadores en inglés; las cadenas visibles en español, igual que en el
// resto de la aplicación.
// ---------------------------------------------------------------------------

import type { Prioridad } from "@/lib/actionables/types";

export type { Prioridad };

export interface Notificacion {
  id: string;
  titulo: string;
  /** 1-2 frases: qué ha detectado el agente y por qué te lo manda. */
  mensaje: string;
  prioridad: Prioridad;
  /** Ámbito operativo, p. ej. "Meteo", "Flota", "Cuadrillas". */
  ambito: string;
  /** Momento en que el agente la emitió, en ISO 8601. */
  creadaEn: string;
  /** Destino donde accionar la notificación, si lo hay. */
  href?: string;
  /** Etiqueta del enlace de acción, p. ej. "Ver cultivo". */
  accionLabel?: string;
}
