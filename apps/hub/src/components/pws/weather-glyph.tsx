/**
 * A tiny line-style weather icon for a normalized `ForecastCondition`.
 *
 * The glyph is chosen from our provider-agnostic condition (providers map their
 * native codes onto it), so the icons read identically whoever supplied the
 * forecast. Drawn to match the hub's hairline aesthetic: 1.6px `currentColor`
 * strokes, no fill, legible at ~20px.
 */

import type { ForecastCondition } from "@/lib/pws/types";

const LABEL: Record<ForecastCondition, string> = {
  clear: "Despejado",
  partly: "Parcialmente nublado",
  cloudy: "Nublado",
  fog: "Niebla",
  rain: "Lluvia",
  snow: "Nieve",
  storm: "Tormenta",
};

const CLOUD_PATH = "M7.5 18h9a3.5 3.5 0 0 0 .4-6.98 5 5 0 0 0-9.65-1.36A3.8 3.8 0 0 0 7.5 18Z";

export function WeatherGlyph({
  condition,
  className = "size-5",
  title,
}: {
  condition: ForecastCondition;
  className?: string;
  title?: string;
}) {
  const label = title ?? LABEL[condition];

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

      {condition === "clear" && (
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

      {condition === "partly" && (
        <>
          <circle cx="8" cy="8.5" r="3" />
          <line x1="8" y1="2.5" x2="8" y2="3.6" />
          <line x1="2.6" y1="8.5" x2="3.7" y2="8.5" />
          <line x1="3.8" y1="4.3" x2="4.6" y2="5.1" />
          <path d="M9 19h7.5a3 3 0 0 0 .3-5.98 4.3 4.3 0 0 0-8.3-1.15A3.3 3.3 0 0 0 9 19Z" />
        </>
      )}

      {condition === "cloudy" && <path d={CLOUD_PATH} />}

      {condition === "rain" && (
        <>
          <path d={CLOUD_PATH} />
          <line x1="9" y1="20" x2="8.2" y2="22" />
          <line x1="12.5" y1="20" x2="11.7" y2="22" />
          <line x1="16" y1="20" x2="15.2" y2="22" />
        </>
      )}

      {condition === "storm" && (
        <>
          <path d={CLOUD_PATH} />
          <path d="M12.5 16.5 10.5 19.5h2.4l-1.6 2.4" />
        </>
      )}

      {condition === "snow" && (
        <>
          <path d={CLOUD_PATH} />
          <circle cx="9" cy="21" r="0.6" fill="currentColor" stroke="none" />
          <circle cx="12.5" cy="22" r="0.6" fill="currentColor" stroke="none" />
          <circle cx="16" cy="21" r="0.6" fill="currentColor" stroke="none" />
        </>
      )}

      {condition === "fog" && (
        <>
          <path d={CLOUD_PATH} opacity="0.75" />
          <line x1="6" y1="21" x2="14" y2="21" />
          <line x1="9" y1="23.2" x2="17" y2="23.2" />
        </>
      )}
    </svg>
  );
}
