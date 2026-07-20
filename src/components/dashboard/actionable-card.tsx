import Link from "next/link";
import type { Accionable } from "@/lib/actionables/types";
import { ESFUERZO_LABEL, PRIORIDAD_META } from "@/lib/actionables/ui";

export function ActionableCard({ item }: { item: Accionable }) {
  const p = PRIORIDAD_META[item.prioridad];
  const critica = item.prioridad === "critica";

  return (
    <article
      className={`rounded-2xl bg-card p-4 shadow-sm ring-1 transition-shadow hover:shadow-md ${
        critica ? "ring-red-600/25" : "ring-black/5"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <span className={`size-2 shrink-0 rounded-full ${p.dot}`} aria-hidden="true" />
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${p.texto}`}>
            {p.label}
          </span>
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {item.ambito}
          </span>
        </span>
        <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
          {item.confianza}% conf.
        </span>
      </div>

      <h3 className="mt-3 text-sm font-semibold leading-snug text-foreground">
        {item.titulo}
      </h3>
      <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
        {item.resumen}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px]">
        <span className="inline-flex items-center gap-1.5 text-foreground">
          <span className="text-brand-accent" aria-hidden="true">
            ◆
          </span>
          {item.impacto}
        </span>
        <span className="text-muted-foreground">Esfuerzo: {ESFUERZO_LABEL[item.esfuerzo]}</span>
      </div>

      {item.pasos?.length > 0 && (
        <details className="group mt-3 border-t border-border pt-3">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-[12px] font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="text-muted-foreground transition-transform group-open:rotate-90" aria-hidden="true">
              ▸
            </span>
            {item.pasos.length} pasos siguientes
          </summary>
          <ol className="mt-3 flex flex-col gap-2">
            {item.pasos.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-[12px] text-foreground">
                <span className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[10px] font-semibold tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>
        </details>
      )}

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {item.fuentes.map((f) => (
            <span
              key={f}
              className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {f}
            </span>
          ))}
        </div>
        <Link
          href={`/dashboard/agent?accion=${encodeURIComponent(item.titulo)}`}
          className="shrink-0 text-[12px] font-medium text-brand-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        >
          Preguntar al agente →
        </Link>
      </div>
    </article>
  );
}
