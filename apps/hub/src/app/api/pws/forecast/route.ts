import { NextResponse } from "next/server";

import { fetchForecast, OpenMeteoError } from "@/lib/pws/providers/open-meteo";

// Talks to a third-party API; never cache or prerender.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Body {
  lat?: unknown;
  lng?: unknown;
}

/**
 * The daily forecast for a point (a field's centroid). Unlike the nearby-station
 * route this needs no API key — Open-Meteo is keyless — so the handler only
 * validates the coordinate and proxies the call, keeping the browser off a
 * cross-origin request and giving one place to shape errors.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Cuerpo de la petición inválido." }, { status: 400 });
  }

  const { lat, lng } = body;

  if (typeof lat !== "number" || typeof lng !== "number") {
    return NextResponse.json({ error: "Coordenadas inválidas." }, { status: 400 });
  }

  try {
    const forecast = await fetchForecast({ lat, lng, days: 7 });
    return NextResponse.json({ forecast });
  } catch (error) {
    const status = error instanceof OpenMeteoError && error.status === 400 ? 400 : 502;
    const message = error instanceof Error ? error.message : "No se pudo cargar la predicción.";
    return NextResponse.json({ error: message }, { status });
  }
}
