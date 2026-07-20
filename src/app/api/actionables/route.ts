import { generarAccionables } from "@/lib/actionables/engine";

// Las acciones se derivan de datos operativos y pueden usar el modelo en vivo,
// así que nunca se prerenderiza esta ruta.
export const dynamic = "force-dynamic";

// POST /api/actionables -> ResultadoAccionables
export async function POST() {
  const resultado = await generarAccionables();
  return Response.json(resultado);
}

// GET para comprobaciones rápidas en el navegador.
export async function GET() {
  const resultado = await generarAccionables();
  return Response.json(resultado);
}
