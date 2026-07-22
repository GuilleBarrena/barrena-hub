// ---------------------------------------------------------------------------
// Geocodificación de lugares (buscador del mapa).
//
// Usa Nominatim (OpenStreetMap), el mismo ecosistema que los mapas base. No
// requiere clave. La petición sale del navegador del usuario; respetamos la
// política de uso limitando la frecuencia desde el componente (debounce) y
// pidiendo pocos resultados.
// ---------------------------------------------------------------------------

import type { LatLng } from "@/lib/crops/types";

export interface GeocodeResult {
  /** Texto legible del lugar, p. ej. "Olite, Navarra, España". */
  label: string;
  /** Centro [lat, lng], en el orden que usa Leaflet. */
  center: LatLng;
  /** Caja envolvente [[sur, oeste], [norte, este]] para encuadrar el lugar. */
  bounds?: [LatLng, LatLng];
}

interface NominatimItem {
  lat: string;
  lon: string;
  display_name: string;
  /** [sur, norte, oeste, este] como cadenas. */
  boundingbox?: [string, string, string, string];
}

const ENDPOINT = "https://nominatim.openstreetmap.org/search";

/**
 * Busca lugares por texto libre. Devuelve [] para consultas demasiado cortas.
 * Propaga la señal de aborto para poder cancelar peticiones en curso.
 */
export async function geocode(
  query: string,
  signal?: AbortSignal,
): Promise<GeocodeResult[]> {
  const q = query.trim();
  if (q.length < 3) return [];

  const url = new URL(ENDPOINT);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("q", q);
  url.searchParams.set("limit", "6");
  url.searchParams.set("accept-language", "es");

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Geocodificación fallida (${res.status})`);

  const data = (await res.json()) as NominatimItem[];
  return data.map((item) => {
    const center: LatLng = [Number(item.lat), Number(item.lon)];
    let bounds: [LatLng, LatLng] | undefined;
    if (item.boundingbox) {
      const [s, n, w, e] = item.boundingbox.map(Number);
      if ([s, n, w, e].every(Number.isFinite)) {
        bounds = [
          [s, w],
          [n, e],
        ];
      }
    }
    return { label: item.display_name, center, bounds };
  });
}
