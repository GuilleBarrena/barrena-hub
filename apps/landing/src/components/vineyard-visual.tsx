/**
 * Abstract vineyard drawn in perspective: rows of vines converging toward a
 * vanishing point, with one row highlighted as the autonomous guidance line
 * the tractor follows. Pure SVG + CSS so the hero needs no binary photo asset.
 * The `--trace-length` var feeds the stroke-dash animation in globals.css and
 * is set to comfortably exceed the drawn path length.
 */
export function VineyardVisual() {
  const rows = [-3, -2, -1, 0, 1, 2, 3];
  const vanishX = 400;
  const vanishY = 70;
  const spread = 92; // horizontal gap between rows at the foreground

  return (
    <svg
      viewBox="0 0 800 500"
      role="img"
      aria-label="Vista en perspectiva de un viñedo con la línea de guiado autónomo resaltada"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.95 0.02 200)" />
          <stop offset="100%" stopColor="oklch(0.985 0.002 90)" />
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.93 0.03 130)" />
          <stop offset="100%" stopColor="oklch(0.88 0.05 130)" />
        </linearGradient>
      </defs>

      {/* Sky + ground */}
      <rect x="0" y="0" width="800" height="180" fill="url(#sky)" />
      <rect x="0" y="140" width="800" height="360" fill="url(#ground)" />

      {/* Horizon */}
      <line
        x1="0"
        y1="150"
        x2="800"
        y2="150"
        stroke="oklch(0.8 0.03 130)"
        strokeWidth="1"
      />

      {/* Vine rows converging to the vanishing point */}
      {rows.map((r) => {
        const x = vanishX + r * spread;
        const isCenter = r === 0;
        if (isCenter) return null;
        return (
          <line
            key={r}
            x1={x}
            y1="500"
            x2={vanishX}
            y2={vanishY + 80}
            stroke="var(--color-brand-primary)"
            strokeOpacity={0.28}
            strokeWidth={2}
            strokeLinecap="round"
          />
        );
      })}

      {/* Highlighted guidance row (the path the tractor drives) */}
      <line
        x1={vanishX}
        y1="500"
        x2={vanishX}
        y2={vanishY + 80}
        stroke="var(--color-brand-accent)"
        strokeOpacity={0.25}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <line
        className="guidance-trace"
        style={{ ["--trace-length" as string]: "360" }}
        x1={vanishX}
        y1="500"
        x2={vanishX}
        y2={vanishY + 80}
        stroke="var(--color-brand-accent)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="10 8"
      />

      {/* Vine dots along each row for texture */}
      {rows.map((r) =>
        [0.15, 0.32, 0.52, 0.75, 1].map((t, i) => {
          const x = vanishX + r * spread * t;
          const y = vanishY + 80 + (500 - (vanishY + 80)) * t;
          return (
            <circle
              key={`${r}-${i}`}
              cx={x}
              cy={y}
              r={1 + t * 3.5}
              fill="var(--color-brand-primary)"
              fillOpacity={0.5}
            />
          );
        }),
      )}

      {/* The autonomous rover on the guidance line */}
      <g className="rover-dot">
        <circle
          cx={vanishX}
          cy="360"
          r="16"
          fill="var(--color-brand-accent)"
          fillOpacity="0.18"
        />
        <circle cx={vanishX} cy="360" r="7" fill="var(--color-brand-accent)" />
        <circle cx={vanishX} cy="360" r="3" fill="oklch(0.985 0.002 90)" />
      </g>
    </svg>
  );
}
