/**
 * A tiny line-style weather icon derived from a TWC forecast icon code (0–47).
 *
 * The Weather Company ships ~48 distinct codes; we bucket them into a handful of
 * glyphs that read cleanly at 20px and match the hub's hairline aesthetic (1.6px
 * `currentColor` strokes, no fill). The mapping errs toward the more cautionary
 * reading when a code straddles buckets — a code that mixes rain and snow lands
 * on the wetter/colder glyph — since this is agronomic UI.
 */

type Glyph = "sun" | "moon" | "partly" | "cloud" | "rain" | "storm" | "snow" | "fog" | "wind";

function glyphFor(code: number | null): Glyph {
  if (code === null) return "cloud";
  // Thunder / tropical / tornado.
  if ([0, 1, 2, 3, 4, 37, 38, 47].includes(code)) return "storm";
  // Snow, flurries, blowing snow, wintry mix.
  if ([5, 7, 13, 14, 15, 16, 42, 43, 46].includes(code)) return "snow";
  // Rain, drizzle, showers, sleet, hail, freezing rain.
  if ([6, 8, 9, 10, 11, 12, 17, 18, 35, 39, 40, 45].includes(code)) return "rain";
  // Fog, haze, smoke, dust.
  if ([19, 20, 21, 22].includes(code)) return "fog";
  // Windy / breezy.
  if ([23, 24].includes(code)) return "wind";
  // Cloudy / mostly cloudy (day & night).
  if ([26, 27, 28].includes(code)) return "cloud";
  // Partly cloudy (day & night).
  if ([29, 30].includes(code)) return "partly";
  // Clear / fair at night.
  if ([31, 33].includes(code)) return "moon";
  // Sunny / fair by day / hot.
  if ([32, 34, 36].includes(code)) return "sun";
  return "cloud";
}

/** Human label for the bucket, so the glyph carries an accessible name even when
 *  the API's phrase is missing. */
const GLYPH_LABEL: Record<Glyph, string> = {
  sun: "Despejado",
  moon: "Despejado",
  partly: "Parcialmente nublado",
  cloud: "Nublado",
  rain: "Lluvia",
  storm: "Tormenta",
  snow: "Nieve",
  fog: "Niebla",
  wind: "Viento",
};

const CLOUD_PATH = "M7.5 18h9a3.5 3.5 0 0 0 .4-6.98 5 5 0 0 0-9.65-1.36A3.8 3.8 0 0 0 7.5 18Z";

export function WeatherGlyph({
  code,
  className = "size-5",
  title,
}: {
  code: number | null;
  className?: string;
  title?: string;
}) {
  const g = glyphFor(code);
  const label = title ?? GLYPH_LABEL[g];

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-label={label}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>{label}</title>

      {g === "sun" && (
        <>
          <circle cx="12" cy="12" r="4.2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const r = (deg * Math.PI) / 180;
            const c = Math.cos(r);
            const s = Math.sin(r);
            return (
              <line
                key={deg}
                x1={12 + c * 7}
                y1={12 + s * 7}
                x2={12 + c * 9.2}
                y2={12 + s * 9.2}
              />
            );
          })}
        </>
      )}

      {g === "moon" && <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />}

      {g === "partly" && (
        <>
          <circle cx="8" cy="8.5" r="3" />
          <line x1="8" y1="2.5" x2="8" y2="3.6" />
          <line x1="2.6" y1="8.5" x2="3.7" y2="8.5" />
          <line x1="3.8" y1="4.3" x2="4.6" y2="5.1" />
          <path d="M9 19h7.5a3 3 0 0 0 .3-5.98 4.3 4.3 0 0 0-8.3-1.15A3.3 3.3 0 0 0 9 19Z" />
        </>
      )}

      {g === "cloud" && <path d={CLOUD_PATH} />}

      {g === "rain" && (
        <>
          <path d={CLOUD_PATH} />
          <line x1="9" y1="20" x2="8.2" y2="22" />
          <line x1="12.5" y1="20" x2="11.7" y2="22" />
          <line x1="16" y1="20" x2="15.2" y2="22" />
        </>
      )}

      {g === "storm" && (
        <>
          <path d={CLOUD_PATH} />
          <path d="M12.5 19.5 10.5 22.5h2.4l-1.6 2.4" transform="translate(0 -3)" />
        </>
      )}

      {g === "snow" && (
        <>
          <path d={CLOUD_PATH} />
          <circle cx="9" cy="21" r="0.6" fill="currentColor" stroke="none" />
          <circle cx="12.5" cy="22" r="0.6" fill="currentColor" stroke="none" />
          <circle cx="16" cy="21" r="0.6" fill="currentColor" stroke="none" />
        </>
      )}

      {g === "fog" && (
        <>
          <path d={CLOUD_PATH} opacity="0.75" />
          <line x1="6" y1="21" x2="14" y2="21" />
          <line x1="9" y1="23.2" x2="17" y2="23.2" />
        </>
      )}

      {g === "wind" && (
        <>
          <path d="M3 8h9a2.5 2.5 0 1 0-2.5-2.5" />
          <path d="M3 12h13a2.5 2.5 0 1 1-2.5 2.5" />
          <path d="M3 16h7a2 2 0 1 1-2 2" />
        </>
      )}
    </svg>
  );
}
