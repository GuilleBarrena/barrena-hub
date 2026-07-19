import { days, precipitation } from "@/lib/sample-data";

const W = 600;
const H = 220;
const PAD = { t: 14, r: 16, b: 26, l: 34 };
const plotW = W - PAD.l - PAD.r;
const plotH = H - PAD.t - PAD.b;

const TICKS = [0, 5, 10, 15];
const yMax = 16;

const step = plotW / precipitation.length;
// Thin marks: a column filling its whole slot reads as a heavy block. Cap the
// width so the surface gap between bars stays generous.
const barW = Math.min(34, step * 0.46);
const R = 4; // rounded data-end

const y = (v: number) => PAD.t + plotH - (v / yMax) * plotH;

/** Top-rounded column anchored to the baseline. */
function columnPath(cx: number, top: number, base: number, w: number) {
  const r = Math.min(R, (base - top) / 2, w / 2);
  const l = cx - w / 2;
  const rt = cx + w / 2;
  return `M ${l} ${base} L ${l} ${top + r} Q ${l} ${top} ${l + r} ${top} L ${rt - r} ${top} Q ${rt} ${top} ${rt} ${top + r} L ${rt} ${base} Z`;
}

/**
 * Precipitation is a second measure on its own scale, so it gets its own
 * chart rather than a second y-axis on the temperature plot.
 */
export function PrecipitationChart() {
  const base = PAD.t + plotH;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label="Precipitación diaria prevista en milímetros para los próximos siete días."
      >
        {TICKS.map((t) => (
          <g key={t}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={y(t)}
              y2={y(t)}
              stroke="var(--color-chart-grid)"
              strokeWidth="1"
            />
            <text
              x={PAD.l - 8}
              y={y(t)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-muted-foreground"
              style={{ fontSize: 10 }}
            >
              {t}
            </text>
          </g>
        ))}

        {precipitation.map((v, i) => {
          const cx = PAD.l + step * i + step / 2;
          return (
            <g key={i}>
              {v > 0 ? (
                <path d={columnPath(cx, y(v), base, barW)} fill="var(--color-chart-precip)">
                  <title>{`${days[i]}: ${v} mm`}</title>
                </path>
              ) : (
                // A zero reads as an empty slot, not a missing one.
                <line
                  x1={cx - barW / 2}
                  x2={cx + barW / 2}
                  y1={base}
                  y2={base}
                  stroke="var(--color-chart-grid)"
                  strokeWidth="2"
                >
                  <title>{`${days[i]}: 0 mm`}</title>
                </line>
              )}
              {v > 0 && (
                <text
                  x={cx}
                  y={y(v) - 7}
                  textAnchor="middle"
                  className="fill-foreground"
                  style={{ fontSize: 10, fontWeight: 600 }}
                >
                  {v}
                </text>
              )}
              <text
                x={cx}
                y={H - 6}
                textAnchor="middle"
                className="fill-muted-foreground"
                style={{ fontSize: 10 }}
              >
                {days[i]}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-[11px] text-muted-foreground">
        Precipitación acumulada por día, en mm. Datos de muestra.
      </figcaption>
    </figure>
  );
}
