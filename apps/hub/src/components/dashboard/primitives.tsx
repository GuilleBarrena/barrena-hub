import type { ReactNode } from "react";

export function Panel({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`min-w-0 rounded-2xl bg-card p-5 ring-1 ring-black/5 shadow-sm ${className}`}
    >
      <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-[12px] text-muted-foreground">{subtitle}</p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/**
 * A headline number. Per the form heuristic a single current value is a stat
 * tile, not a one-bar chart.
 */
export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-card p-4 ring-1 ring-black/5 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums text-foreground">
        {value}
      </p>
      {hint && <p className="mt-1 text-[12px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

const LEVEL_DOT: Record<string, string> = {
  good: "bg-brand-primary",
  warning: "bg-brand-accent",
  serious: "bg-red-600",
};

/**
 * Status badge. The dot is never the only carrier of meaning - the label
 * always ships alongside it.
 */
export function StatusBadge({
  level,
  label,
}: {
  level: "good" | "warning" | "serious";
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span
        className={`size-2 shrink-0 rounded-full ${LEVEL_DOT[level] ?? LEVEL_DOT.warning}`}
        aria-hidden="true"
      />
      <span className="text-foreground">{label}</span>
    </span>
  );
}

/** Key/value list used by the resource detail pages. */
export function DetailList({ items }: { items: [string, string][] }) {
  return (
    <dl className="mt-4 flex flex-col gap-3 text-sm">
      {items.map(([k, v]) => (
        <div key={k} className="flex items-baseline justify-between gap-4">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {k}
          </dt>
          <dd className="text-right tabular-nums text-foreground">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

const LEVELS: Record<string, { dot: string; label: string }> = {
  good: { dot: "bg-brand-primary", label: "Favorable" },
  warning: { dot: "bg-brand-accent", label: "Aviso" },
  serious: { dot: "bg-red-600", label: "Crítico" },
};

/**
 * Status carries an explicit text label alongside the dot - status is never
 * communicated by colour alone.
 */
export function AlertRow({
  level,
  title,
  detail,
}: {
  level: keyof typeof LEVELS | string;
  title: string;
  detail: string;
}) {
  const s = LEVELS[level] ?? LEVELS.warning;
  return (
    <li className="flex items-start gap-3 py-2.5">
      <span className={`mt-1.5 size-2 shrink-0 rounded-full ${s.dot}`} aria-hidden="true" />
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-x-2">
          <span className="text-sm font-medium text-foreground">{title}</span>
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {s.label}
          </span>
        </span>
        <span className="mt-0.5 block text-[12px] text-muted-foreground">{detail}</span>
      </span>
    </li>
  );
}
