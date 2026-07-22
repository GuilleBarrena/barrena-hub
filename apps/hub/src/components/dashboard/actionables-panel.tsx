"use client";

import { useEffect, useState } from "react";
import type { Prioridad, ResultadoAccionables } from "@/lib/actionables/types";
import { PRIORIDAD_META } from "@/lib/actionables/ui";
import { ActionableCard } from "./actionable-card";

const FILTROS: { key: "todas" | Prioridad; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "critica", label: "Críticas" },
  { key: "alta", label: "Altas" },
  { key: "media", label: "Medias" },
];

/** La capa de IA en el panel: convierte todos los datos en acciones. */
export function ActionablesPanel() {
  const [data, setData] = useState<ResultadoAccionables | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<"todas" | Prioridad>("todas");
  // Cada incremento relanza la petición desde el efecto (patrón cancelable).
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      try {
        const res = await fetch("/api/actionables", { method: "POST" });
        if (!res.ok) throw new Error(`Error de la petición (${res.status})`);
        const json = (await res.json()) as ResultadoAccionables;
        if (cancelado) return;
        setData(json);
        setError(null);
        // Compartimos el conjunto con la página del agente para un chat fundamentado.
        try {
          sessionStorage.setItem(
            "hub:accionables",
            JSON.stringify(json.accionables),
          );
        } catch {
          /* almacenamiento no disponible; no es crítico */
        }
      } catch (e) {
        if (!cancelado) setError(e instanceof Error ? e.message : "Algo ha ido mal");
      } finally {
        if (!cancelado) setLoading(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [nonce]);

  // Botón "volver a analizar": alterna el estado de carga desde un manejador de
  // eventos y relanza la petición cambiando el nonce.
  const cargar = () => {
    setLoading(true);
    setError(null);
    setNonce((n) => n + 1);
  };

  const accionables = (data?.accionables ?? [])
    .filter((a) => filtro === "todas" || a.prioridad === filtro)
    .sort((a, b) => PRIORIDAD_META[a.prioridad].orden - PRIORIDAD_META[b.prioridad].orden);

  return (
    <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-black/5">
      {/* Cabecera */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary ${
              loading ? "animate-pulse" : ""
            }`}
            aria-hidden="true"
          >
            <SparkIcon />
          </span>
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
              Acciones recomendadas
              {data && <MotorBadge motor={data.motor} />}
            </h2>
            <p className="text-[12px] text-muted-foreground">
              La IA cruza meteo, cultivos, flota y cuadrillas
            </p>
          </div>
        </div>
        <button
          onClick={cargar}
          disabled={loading}
          className="inline-flex h-9 items-center rounded-lg bg-surface-2 px-3 text-[12px] font-medium text-foreground ring-1 ring-foreground/5 outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {loading ? "Analizando…" : "↻ Volver a analizar"}
        </button>
      </div>

      {/* Titular */}
      {data?.titular && !loading && (
        <p className="mt-4 rounded-xl bg-brand-primary/[0.06] px-4 py-3 text-[13px] text-foreground ring-1 ring-brand-primary/10">
          {data.titular}
        </p>
      )}

      {/* Filtros */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {FILTROS.map((f) => {
          const count =
            f.key === "todas"
              ? data?.accionables.length ?? 0
              : data?.accionables.filter((a) => a.prioridad === f.key).length ?? 0;
          return (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                filtro === f.key
                  ? "bg-foreground text-background"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
              {data && <span className="ml-1.5 opacity-60">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Cuerpo */}
      <div className="mt-4">
        {error && (
          <div className="rounded-xl bg-red-600/5 px-4 py-3 text-[13px] text-red-700 ring-1 ring-red-600/20">
            No se pudieron cargar las acciones: {error}.{" "}
            <button onClick={cargar} className="font-medium underline">
              Reintentar
            </button>
          </div>
        )}

        {loading && !data && (
          <div className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && accionables.length === 0 && !error && (
          <p className="py-6 text-center text-[13px] text-muted-foreground">
            No hay acciones en esta vista.
          </p>
        )}

        {accionables.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2">
            {accionables.map((a) => (
              <ActionableCard key={a.id} item={a} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function MotorBadge({ motor }: { motor: "claude" | "local" }) {
  const live = motor === "claude";
  return (
    <span
      title={
        live
          ? "Generado en vivo por el modelo"
          : "Generado por el motor local integrado (sin clave de API)"
      }
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
        live
          ? "bg-brand-primary/10 text-brand-primary"
          : "bg-surface-2 text-muted-foreground"
      }`}
    >
      {live ? "IA en vivo" : "Motor local"}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl bg-card p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex gap-2">
        <div className="h-4 w-16 rounded-full bg-surface-2" />
        <div className="h-4 w-14 rounded-full bg-surface-2" />
      </div>
      <div className="mt-3 h-4 w-3/4 rounded bg-surface-2" />
      <div className="mt-2 h-3 w-full rounded bg-surface-2" />
      <div className="mt-1.5 h-3 w-5/6 rounded bg-surface-2" />
      <div className="mt-4 h-3 w-1/2 rounded bg-surface-2" />
    </div>
  );
}

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6.3 6.3 3.5 3.5M20.5 20.5l-2.8-2.8M17.7 6.3l2.8-2.8M3.5 20.5l2.8-2.8" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}
