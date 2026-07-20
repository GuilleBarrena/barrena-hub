import { chatConAgente, generarAccionables } from "@/lib/actionables/engine";
import type { Accionable, MensajeChat } from "@/lib/actionables/types";

export const dynamic = "force-dynamic";

// POST /api/agent
// Body: { mensajes: MensajeChat[], accionables?: Accionable[] }
export async function POST(request: Request) {
  let mensajes: MensajeChat[] = [];
  let accionables: Accionable[] | undefined;

  try {
    const body = await request.json();
    if (Array.isArray(body?.mensajes)) mensajes = body.mensajes;
    if (Array.isArray(body?.accionables)) accionables = body.accionables;
  } catch {
    return Response.json({ error: "Cuerpo JSON no válido" }, { status: 400 });
  }

  if (mensajes.length === 0) {
    return Response.json(
      { error: "Se requiere mensajes[]" },
      { status: 400 },
    );
  }

  // Si el cliente no envía acciones (p. ej. enlace directo), las derivamos para
  // que el agente tenga contexto de todas formas.
  if (!accionables || accionables.length === 0) {
    const resultado = await generarAccionables();
    accionables = resultado.accionables;
  }

  const { respuesta, motor } = await chatConAgente(mensajes, accionables);
  return Response.json({ respuesta, motor });
}
