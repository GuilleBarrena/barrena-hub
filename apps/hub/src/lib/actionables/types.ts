// ---------------------------------------------------------------------------
// Capa de IA — tipos del dominio.
//
// Identificadores en inglés; las cadenas visibles se mantienen en español,
// igual que en el resto de la aplicación.
// ---------------------------------------------------------------------------

export type Prioridad = "critica" | "alta" | "media" | "baja";
export type Esfuerzo = "rapido" | "moderado" | "alto";

/**
 * Una recomendación derivada por la IA a partir de todos los datos de entrada:
 * qué hacer, por qué importa y los pasos concretos para empezar.
 */
export interface Accionable {
  id: string;
  titulo: string;
  resumen: string;
  prioridad: Prioridad;
  /** Ámbito operativo, p. ej. "Meteo", "Flota", "Cuadrillas". */
  ambito: string;
  /** Impacto esperado si se actúa, p. ej. "Evita pérdida de cosecha en 8 ha". */
  impacto: string;
  esfuerzo: Esfuerzo;
  /** Confianza del modelo, 0-100. */
  confianza: number;
  /** Módulos de datos de los que procede, p. ej. ["Meteo", "Parcelas"]. */
  fuentes: string[];
  /** Pasos concretos para ejecutar. */
  pasos: string[];
}

export interface ResultadoAccionables {
  /** Lectura de situación en una frase. */
  titular: string;
  accionables: Accionable[];
  /** Si procede del modelo en vivo o del motor local integrado. */
  motor: "claude" | "local";
  generadoEn: string;
}

export interface MensajeChat {
  role: "user" | "assistant";
  content: string;
}
