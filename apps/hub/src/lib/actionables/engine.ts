import type { Accionable, MensajeChat, ResultadoAccionables } from "./types";
import { datosAContexto, reunirDatos, type InstantaneaFinca } from "./context";
import { accionablesLocales, respuestaLocal } from "./mock";

// ---------------------------------------------------------------------------
// La capa de IA de Hub.
//
// Todo pasa por aquí. Si hay ANTHROPIC_API_KEY, usamos Claude para razonar
// sobre los datos de la finca; si no, un motor local determinista mantiene el
// producto funcionando de extremo a extremo. Quien llama no necesita saber qué
// ruta se ejecutó: la forma del resultado es idéntica.
//
// Se usa `fetch` contra la API de Mensajes en lugar de un SDK para no añadir
// dependencias y respetar el proxy de red del entorno. Ante cualquier fallo,
// se recurre al motor local: la IA nunca debe tumbar el producto.
// ---------------------------------------------------------------------------

const MODEL = process.env.HUB_AI_MODEL || "claude-sonnet-5";
const API_URL = "https://api.anthropic.com/v1/messages";

function apiKey(): string | undefined {
  return process.env.ANTHROPIC_API_KEY?.trim() || undefined;
}

interface RespuestaMensajes {
  content?: { type: string; text?: string }[];
}

async function llamarClaude(
  system: string,
  messages: { role: "user" | "assistant"; content: string }[],
  maxTokens: number,
): Promise<string> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey() as string,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Anthropic API ${res.status}: ${detail.slice(0, 200)}`);
  }

  const data = (await res.json()) as RespuestaMensajes;
  return (data.content ?? [])
    .filter((b) => b.type === "text" && typeof b.text === "string")
    .map((b) => b.text as string)
    .join("");
}

const SISTEMA_ACCIONABLES = `Eres Hub, un analista de IA que vigila todos los datos operativos de una explotación agrícola y los convierte en una lista corta de acciones de alto impacto.

Recibirás una instantánea de la finca: resumen, meteo actual y previsión, alertas, parcelas, flota y cuadrillas. Tu trabajo:
- Sintetiza CRUZANDO fuentes: las mejores acciones conectan puntos (p. ej. una alerta de helada + un cultivo sensible en una parcela concreta + la disponibilidad de cuadrilla).
- Devuelve solo lo de mayor palanca. Calidad sobre cantidad: entre 4 y 6 acciones.
- Sé concreto y accionable hoy. Todo en español de España, tono técnico y sobrio.

Responde ÚNICAMENTE con un objeto JSON (sin prosa, sin vallas de código) con esta forma:

{
  "titular": string,              // una frase que resuma la situación global
  "accionables": Array<{
    "titulo": string,             // <= 70 caracteres, en imperativo
    "resumen": string,            // 1-2 frases: qué pasa y por qué importa
    "prioridad": "critica" | "alta" | "media" | "baja",
    "ambito": string,             // etiqueta corta: "Meteo", "Flota", "Cuadrillas", "Parcelas", "Operación"
    "impacto": string,            // resultado esperado concreto
    "esfuerzo": "rapido" | "moderado" | "alto",
    "confianza": number,          // 0-100
    "fuentes": string[],          // módulos de datos usados
    "pasos": string[]             // 2-4 pasos concretos
  }>
}`;

export async function generarAccionables(): Promise<ResultadoAccionables> {
  const datos = reunirDatos();
  const generadoEn = new Date().toISOString();

  if (!apiKey()) {
    const { titular, accionables } = accionablesLocales(datos);
    return { titular, accionables, motor: "local", generadoEn };
  }

  try {
    const texto = await llamarClaude(
      SISTEMA_ACCIONABLES,
      [
        {
          role: "user",
          content: `Estos son los datos actuales que vigila Hub:\n\n${datosAContexto(
            datos,
          )}\n\nGenera ahora el JSON de acciones.`,
        },
      ],
      2000,
    );

    const parsed = extraerJson(texto) as {
      titular?: string;
      accionables?: Accionable[];
    };

    const accionables = (parsed.accionables ?? []).map((a, i) => ({
      ...a,
      id: a.id || `acc-${i + 1}`,
    }));

    return {
      titular: parsed.titular || "Aquí es donde su atención rinde más.",
      accionables,
      motor: "claude",
      generadoEn,
    };
  } catch (err) {
    console.error("[hub] fallo al generar acciones, uso motor local:", err);
    const { titular, accionables } = accionablesLocales(datos);
    return { titular, accionables, motor: "local", generadoEn };
  }
}

const SISTEMA_AGENTE = `Eres el Agente de Hub, un copiloto de operaciones agrícolas integrado en el panel, cercano y directo.

Tienes contexto completo de los datos en vivo de la finca y de las acciones que Hub ha propuesto. Ayuda a decidir el siguiente paso: priorizar, redactar planes, estimar impacto y responder preguntas ancladas en los datos.

Estilo:
- Conciso y directo. Empieza por la respuesta.
- Cita números y acciones concretas cuando sean relevantes.
- Al proponer trabajo, da pasos ordenados y concretos.
- Si te piden algo que los datos no soportan, dilo con claridad.
- Responde siempre en español de España.`;

export async function chatConAgente(
  mensajes: MensajeChat[],
  accionables: Accionable[],
): Promise<{ respuesta: string; motor: "claude" | "local" }> {
  const datos = reunirDatos();

  if (!apiKey()) {
    return { respuesta: respuestaLocal(mensajes, accionables), motor: "local" };
  }

  const contexto = [
    "## Datos en vivo de la finca",
    datosAContexto(datos),
    "",
    "## Acciones que Hub ha propuesto",
    accionables
      .map(
        (a, i) =>
          `${i + 1}. [${a.prioridad}] ${a.titulo} — ${a.resumen} (impacto: ${a.impacto})`,
      )
      .join("\n"),
  ].join("\n");

  try {
    const respuesta = await llamarClaude(
      `${SISTEMA_AGENTE}\n\n---\nCONTEXTO (no lo repitas literalmente; úsalo para fundamentar):\n${contexto}`,
      mensajes.map((m) => ({ role: m.role, content: m.content })),
      1200,
    );
    return { respuesta: respuesta.trim() || "…", motor: "claude" };
  } catch (err) {
    console.error("[hub] fallo en el chat del agente, uso motor local:", err);
    return { respuesta: respuestaLocal(mensajes, accionables), motor: "local" };
  }
}

/** Extrae el primer objeto JSON de la respuesta del modelo, tolerando texto suelto. */
function extraerJson(texto: string): unknown {
  const vallado = texto.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidato = vallado ? vallado[1] : texto;
  const ini = candidato.indexOf("{");
  const fin = candidato.lastIndexOf("}");
  if (ini === -1 || fin === -1) throw new Error("Sin objeto JSON en la respuesta");
  return JSON.parse(candidato.slice(ini, fin + 1));
}

// Reexport para consumidores que necesiten la forma de la instantánea.
export type { InstantaneaFinca };
