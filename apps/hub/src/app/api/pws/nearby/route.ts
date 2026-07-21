import { NextResponse } from "next/server";

import {
  fetchNearbyStations,
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
 * Discovers the PWS stations around a point. The client posts the field's
 * centroid plus the API key it holds in localStorage; the key travels no
 * further than this handler and Weather Underground.
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
          "Solo Weather Underground permite descubrir estaciones cercanas. Cambia el proveedor en Ajustes.",
      },
      { status: 400 },
    );
  }

  try {
    const stations = await fetchNearbyStations({ lat, lng, apiKey: apiKey.trim(), limit: 6 });
    return NextResponse.json({ stations });
  } catch (error) {
    const authFailed = error instanceof WeatherUndergroundError && (error.status === 401 || error.status === 403);
    const message = error instanceof Error ? error.message : "No se pudieron cargar las estaciones.";
    return NextResponse.json({ error: message }, { status: authFailed ? 401 : 502 });
  }
}
