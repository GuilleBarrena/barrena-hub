import { NextResponse } from "next/server";

import {
  fetchForecast,
  WeatherUndergroundError,
} from "@/lib/pws/providers/weather-underground";

// Talks to a third-party API with the caller's key; never cache or prerender.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Body {
  lat?: unknown;
  lng?: unknown;
  apiKey?: unknown;
  provider?: unknown;
}

/**
 * The daily forecast for a point. The client posts the field's centroid plus the
 * API key it holds in localStorage; the key travels no further than this handler
 * and Weather Underground. Mirrors the nearby-stations route — same key, same
 * host, different product (a location forecast rather than a station reading).
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Cuerpo de la petición inválido." }, { status: 400 });
  }

  const { lat, lng, apiKey, provider } = body;

  if (typeof lat !== "number" || typeof lng !== "number") {
    return NextResponse.json({ error: "Coordenadas inválidas." }, { status: 400 });
  }
  if (typeof apiKey !== "string" || apiKey.trim() === "") {
    return NextResponse.json({ error: "Falta la API key." }, { status: 400 });
  }
  if (provider !== undefined && provider !== "weather_underground") {
    return NextResponse.json(
      {
        error:
          "Solo Weather Underground ofrece predicción diaria. Cambia el proveedor en Ajustes.",
      },
      { status: 400 },
    );
  }

  try {
    const forecast = await fetchForecast({ lat, lng, apiKey: apiKey.trim(), days: 7 });
    return NextResponse.json({ forecast });
  } catch (error) {
    const authFailed =
      error instanceof WeatherUndergroundError && (error.status === 401 || error.status === 403);
    const message = error instanceof Error ? error.message : "No se pudo cargar la predicción.";
    return NextResponse.json({ error: message }, { status: authFailed ? 401 : 502 });
  }
}
