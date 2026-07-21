"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { FieldViewMapLoader } from "@/components/fields/field-view-map-loader";
import { Button } from "@barrena/ui/button";
import { formatHectares, toGeoJSON } from "@/lib/fields/geo";
import { getFieldRepository } from "@/lib/fields/repository";
import { alertsForField } from "@/lib/fields/signals";
import type { Field } from "@/lib/fields/types";
import { currentWeather } from "@/lib/sample-data";

type State =
  | { status: "loading" }
  | { status: "found"; field: Field }
  | { status: "missing" };

/** Full-bleed container: cancels the dashboard padding and fills the viewport,
 *  so the map reads edge-to-edge with the cards floating over it. */
const STAGE =
  "relative -mx-5 -my-6 h-[calc(100dvh-5.75rem)] overflow-hidden bg-surface-2 " +
  "md:-m-8 md:h-screen";

const ALERT_META: Record<string, { dot: string; label: string }> = {
  good: { dot: "bg-brand-primary", label: "Favorable" },
  warning: { dot: "bg-brand-accent", label: "Aviso" },
  serious: { dot: "bg-red-600", label: "Crítico" },
};

export function FieldDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    getFieldRepository()
      .get(params.id)
      .then((field) => {
        if (!active) return;
        setState(field ? { status: "found", field } : { status: "missing" });
      })
      .catch(() => active && setState({ status: "missing" }));
    return () => {
      active = false;
    };
  }, [params.id]);

  if (state.status === "loading") {
    return (
      <div className={`${STAGE} flex items-center justify-center`}>
        <p className="text-sm text-muted-foreground">Cargando parcela…</p>
      </div>
    );
  }

  if (state.status === "missing") {
    return (
      <div className={`${STAGE} flex items-center justify-center px-6`}>
        <div className="max-w-sm rounded-2xl bg-card p-6 text-center shadow-sm ring-1 ring-black/5">
          <p className="text-sm font-medium text-foreground">Parcela no encontrada</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Puede que se dibujara en otro navegador: las parcelas propias se guardan
            únicamente en este dispositivo.
          </p>
          <Button asChild variant="secondary" className="mt-4">
            <Link href="/dashboard/fields">Volver al listado</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { field } = state;
  const geojson = JSON.stringify(toGeoJSON(field), null, 2);
  const alerts = alertsForField(field.name);

  async function copyGeoJSON() {
    try {
      await navigator.clipboard.writeText(geojson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function remove() {
    await getFieldRepository().remove(field.id);
    router.push("/dashboard/fields");
    router.refresh();
  }

  return (
    <div className={STAGE}>
      <FieldViewMapLoader field={field} />

      {/* Top-left: back + the field's identity card, Google-Maps style. Height
          is capped on small screens so it never reaches the bottom info column. */}
      <div className="pointer-events-none absolute left-3 top-3 z-[500] flex max-h-[52%] w-[min(20rem,calc(100%-1.5rem))] flex-col gap-2 md:max-h-[calc(100%-1.5rem)]">
        <Link
          href="/dashboard/fields"
          className="pointer-events-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-[12px] font-medium text-foreground shadow-sm ring-1 ring-black/10 backdrop-blur transition-colors hover:text-brand-primary"
        >
          ← Parcelas
        </Link>

        <div className="pointer-events-auto flex min-h-0 flex-col overflow-y-auto rounded-2xl bg-background/95 p-4 shadow-sm ring-1 ring-black/10 backdrop-blur">
          <div className="flex items-start gap-2">
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-accent" aria-hidden="true" />
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold tracking-tight text-foreground">
                {field.name}
              </h1>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {field.cropType} · {formatHectares(field.areaHectares)}
              </p>
            </div>
          </div>

          <dl className="mt-4 flex flex-col gap-2.5 border-t border-foreground/5 pt-4 text-[13px]">
            {(
              [
                ["Cultivo", field.cropType],
                ["Superficie", formatHectares(field.areaHectares)],
                ["Vértices", String(field.ring.length)],
                [
                  "Alta",
                  new Date(field.createdAt).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }),
                ],
                ["Origen", field.source === "sample" ? "Datos de muestra" : "Dibujada"],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {k}
                </dt>
                <dd className="text-right tabular-nums text-foreground">{v}</dd>
              </div>
            ))}
          </dl>

          <details className="mt-4 border-t border-foreground/5 pt-4">
            <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground marker:content-none hover:text-foreground">
              Geometría (GeoJSON)
            </summary>
            <pre className="mt-3 max-h-40 overflow-auto rounded-lg bg-surface p-3 text-[11px] leading-relaxed text-muted-foreground">
              {geojson}
            </pre>
            <Button type="button" variant="secondary" className="mt-3 w-full" onClick={copyGeoJSON}>
              {copied ? "Copiado" : "Copiar GeoJSON"}
            </Button>
          </details>

          {field.source === "user" && (
            <button
              type="button"
              onClick={remove}
              className="mt-3 rounded-lg px-3 py-2 text-sm text-muted-foreground outline-none transition-colors
                         hover:text-red-600 focus-visible:ring-2 focus-visible:ring-ring"
            >
              Eliminar parcela
            </button>
          )}
        </div>
      </div>

      {/* Bottom-right: alerts for this field + the current weather readout,
          stacked as a single info column so they never collide with the
          identity card on narrow screens. */}
      <div className="pointer-events-none absolute bottom-6 right-3 z-[500] flex max-h-[calc(100%-1.5rem)] w-[min(18rem,calc(100%-1.5rem))] flex-col gap-2 overflow-y-auto">
        <div className="pointer-events-auto rounded-2xl bg-background/95 p-4 shadow-sm ring-1 ring-black/10 backdrop-blur">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-primary">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            Alertas de la parcela
          </p>
          {alerts.length > 0 ? (
            <ul className="mt-3 flex flex-col divide-y divide-foreground/5">
              {alerts.map((a) => {
                const m = ALERT_META[a.level] ?? ALERT_META.warning;
                return (
                  <li key={a.title} className="flex items-start gap-2.5 py-2 first:pt-0 last:pb-0">
                    <span className={`mt-1.5 size-2 shrink-0 rounded-full ${m.dot}`} aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-x-2">
                        <span className="text-[13px] font-medium text-foreground">{a.title}</span>
                        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {m.label}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-[12px] text-muted-foreground">{a.detail}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-2 text-[12px] text-muted-foreground">
              Sin alertas activas para esta parcela.
            </p>
          )}
        </div>

        <div className="pointer-events-auto rounded-2xl bg-background/95 p-4 shadow-sm ring-1 ring-black/10 backdrop-blur">
          <p className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Meteo · ahora
            <span className="font-normal normal-case tracking-normal text-muted-foreground/70">Finca</span>
          </p>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
            {(
              [
                ["Temperatura", currentWeather.temperature],
                ["Viento", currentWeather.wind],
                ["Humedad", currentWeather.humidity],
                ["Precip. 24 h", currentWeather.precipitation24h],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</span>
                <span className="text-base font-semibold tabular-nums text-foreground">{v}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-muted-foreground">Datos de muestra.</p>
        </div>
      </div>
    </div>
  );
}
