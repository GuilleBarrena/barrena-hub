import { days, temperature } from "@/lib/sample-data";

const W = 600;
const H = 220;
const PAD = { t: 14, r: 16, b: 26, l: 34 };
const plotW = W - PAD.l - PAD.r;
const plotH = H - PAD.t - PAD.b;

const TICKS = [10, 15, 20, 25, 30];
const yMin = 8;
const yMax = 34;

const x = (i: number) => PAD.l + (i * plotW) / (days.length - 1);
const y = (v: number) => PAD.t + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

/**
 * Trend over time -> line, one hue. The min-max band is context for the same
 * measure (temperature), not a second series, so no legend box is needed:
 * the title names what is plotted.
 */
export function TemperatureChart() {
  const { mean, min, max } = temperature;

  const band =
    max.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ") +
    " " +
    min
      .map((v, i) => `${x(min.length - 1 - i).toFixed(1)},${y(min[min.length - 1 - i]).toFixed(1)}`)
      .join(" ");

  const line = mean.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const last = mean.length - 1;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label="Temperatura media diaria en grados Celsius, con banda de mínima y máxima, para los próximos siete días."
      >
        {/* Hairline grid - solid, recessive, never dashed */}
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

        {/* Min-max band: same hue as the line, heavily reduced */}
        <polygon points={band} fill="var(--color-chart-temp)" opacity="0.14" />

        <polyline
          points={line}
          fill="none"
          stroke="var(--color-chart-temp)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {mean.map((v, i) => (
          <circle
            key={i}
            cx={x(i)}
            cy={y(v)}
            r="4"
            fill="var(--color-chart-temp)"
            stroke="var(--color-card)"
            strokeWidth="2"
          >
            <title>{`${days[i]}: media ${v} °C (mín ${min[i]} °C, máx ${max[i]} °C)`}</title>
          </circle>
        ))}

        {/* Selective direct label: the last point only, never every point */}
        <text
          x={x(last)}
          y={y(mean[last]) - 12}
          textAnchor="end"
          className="fill-foreground"
          style={{ fontSize: 11, fontWeight: 600 }}
        >
          {mean[last]} °C
        </text>

        {days.map((d, i) => (
          <text
            key={d}
            x={x(i)}
            y={H - 6}
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ fontSize: 10 }}
          >
            {d}
          </text>
        ))}
      </svg>
      <figcaption className="mt-2 text-[11px] text-muted-foreground">
        Línea: temperatura media. Banda: rango mínima-máxima. Datos de muestra.
      </figcaption>
    </figure>
  );
}
