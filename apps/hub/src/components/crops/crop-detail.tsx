"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CropViewMapLoader } from "@/components/crops/crop-view-map-loader";
import { CropForecast } from "@/components/pws/crop-forecast";
import { NearbyStations } from "@/components/pws/nearby-stations";
import { Button } from "@barrena/ui/button";
import { formatHectares, ringCentroid, toGeoJSON } from "@/lib/crops/geo";
import { getCropRepository } from "@/lib/crops/repository";
import { alertsForCrop } from "@/lib/crops/signals";
import type { Crop } from "@/lib/crops/types";
import { useForecast } from "@/lib/pws/use-forecast";
import { useNearbyStations } from "@/lib/pws/use-nearby-stations";
import { usePwsSettings } from "@/lib/pws/settings";

type State =
  | { status: "loading" }
  | { status: "found"; crop: Crop }
  | { status: "missing" };

/** Full-bleed container: cancels the dashboard padding and fills the viewport,
 *  so the map reads edge-to-edge with the cards floating over it. */
const STAGE =
  "relative -mx-5 -my-6 h-[calc(100dvh-5.75rem)] overflow-hidden bg-surface-2 " +
  "md:-m-8 md:h-[calc(100dvh-3.5rem)]";

const ALERT_META: Record<string, { dot: string; label: string }> = {
  good: { dot: "bg-brand-primary", label: "Favorable" },
  warning: { dot: "bg-brand-accent", label: "Aviso" },
  serious: { dot: "bg-red-600", label: "Crítico" },
};

export function CropDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });
  const [copied, setCopied] = useState(false);

  // Called unconditionally (before the early returns) so hook order stays fixed
  // whether the crop is still loading, missing, or found. Stations are looked
  // up from the crop's centroid, so the hook takes a coordinate, not the crop.
  const { units } = usePwsSettings();
  const center =
    state.status === "found" ? ringCentroid(state.crop.ring) : null;
  const { state: nearby, activeId, setActiveId, reload } = useNearbyStations(center);
  const { state: forecast, reload: reloadForecast } = useForecast(center);
  const stations = nearby.status === "ready" ? nearby.stations : [];

  useEffect(() => {
    let active = true;
    getCropRepository()
      .get(params.id)
      .then((crop) => {
        if (!active) return;
        setState(crop ? { status: "found", crop } : { status: "missing" });
      })
      .catch(() => active && setState({ status: "missing" }));
    return () => {
      active = false;
    };
  }, [params.id]);

  if (state.status === "loading") {
    return (
      <div className={`${STAGE} flex items-center justify-center`}>
        <p className="text-sm text-muted-foreground">Cargando cultivo…</p>
      </div>
    );
  }

  if (state.status === "missing") {
    return (
      <div className={`${STAGE} flex items-center justify-center px-6`}>
        <div className="max-w-sm rounded-2xl bg-card p-6 text-center shadow-sm ring-1 ring-black/5">
          <p className="text-sm font-medium text-foreground">Cultivo no encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Puede que se dibujara en otro navegador: los cultivos propios se guardan
            únicamente en este dispositivo.
          </p>
          <Button asChild variant="secondary" className="mt-4">
            <Link href="/crops">Volver al listado</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { crop } = state;
  const geojson = JSON.stringify(toGeoJSON(crop), null, 2);
  const alerts = alertsForCrop(crop.name);

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
    await getCropRepository().remove(crop.id);
    router.push("/crops");
    router.refresh();
  }

  return (
    // Two layouts from one tree. On mobile this is a normal, vertically
    // scrolling page: a map hero followed by the info cards stacked in flow.
    // From `md` up it becomes the immersive, full-bleed map with the cards
    // floating over it in the corners (Google-Maps style).
    <div className="-mx-5 -mt-6 md:relative md:-m-8 md:h-[calc(100dvh-3.5rem)] md:overflow-hidden md:bg-surface-2">
      {/* Map. A fixed-height hero on mobile; fills the whole stage on desktop
          so the corner cards can float over it. */}
      {/* `z-0` gives the hero its own stacking context so the overlay controls
          below (back link, layer toggle at z-[500]) stay contained and never
          paint over the sticky mobile header when the page scrolls. */}
      <div className="relative z-0 h-[46vh] min-h-[17rem] overflow-hidden bg-surface-2 md:absolute md:inset-0 md:h-full md:min-h-0">
        <CropViewMapLoader
          crop={crop}
          stations={stations}
          activeStationId={activeId}
          onStationHover={setActiveId}
        />

        {/* Back control floats over the map on both layouts. */}
        <Link
          href="/crops"
          className="absolute left-3 top-3 z-[500] inline-flex w-fit items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-[12px] font-medium text-foreground shadow-sm ring-1 ring-black/10 backdrop-blur transition-colors hover:text-brand-primary"
        >
          ← Cultivos
        </Link>
      </div>

      {/* Identity card. In flow below the map on mobile; floating top-left on
          desktop (nudged down so it clears the back control). */}
      <div className="relative z-10 px-5 pt-4 md:pointer-events-none md:absolute md:left-3 md:top-14 md:z-[500] md:flex md:max-h-[calc(100%-4.5rem)] md:w-[min(20rem,calc(100%-1.5rem))] md:flex-col md:px-0 md:pt-0">
        <div className="pointer-events-auto flex flex-col rounded-2xl bg-background/95 p-4 shadow-sm ring-1 ring-black/10 backdrop-blur md:min-h-0 md:overflow-y-auto">
          <div className="flex items-start gap-2">
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-accent" aria-hidden="true" />
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold tracking-tight text-foreground">
                {crop.name}
              </h1>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {crop.cropType} · {formatHectares(crop.areaHectares)}
              </p>
            </div>
          </div>

          <dl className="mt-4 flex flex-col gap-2.5 border-t border-foreground/5 pt-4 text-[13px]">
            {(
              [
                ["Tipo de cultivo", crop.cropType],
                ["Superficie", formatHectares(crop.areaHectares)],
                ["Vértices", String(crop.ring.length)],
                [
                  "Alta",
                  new Date(crop.createdAt).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }),
                ],
                ["Origen", crop.source === "sample" ? "Datos de muestra" : "Dibujado"],
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

          {crop.source === "user" && (
            <button
              type="button"
              onClick={remove}
              className="mt-3 rounded-lg px-3 py-2 text-sm text-muted-foreground outline-none transition-colors
                         hover:text-red-600 focus-visible:ring-2 focus-visible:ring-ring"
            >
              Eliminar cultivo
            </button>
          )}
        </div>
      </div>

      {/* Alerts + the nearby-station readout. Stacked in flow under the
          identity card on mobile; floating bottom-right on desktop. */}
      <div className="relative z-10 flex flex-col gap-3 px-5 pb-10 pt-3 md:pointer-events-none md:absolute md:bottom-6 md:right-3 md:z-[500] md:max-h-[calc(100%-1.5rem)] md:w-[min(18rem,calc(100%-1.5rem))] md:gap-2 md:overflow-y-auto md:px-0 md:pb-0 md:pt-0">
        <div className="pointer-events-auto rounded-2xl bg-background/95 p-4 shadow-sm ring-1 ring-black/10 backdrop-blur">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-primary">
            <span className="size-1.5 rounded-full bg-brand-primary" />
            Alertas del cultivo
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
              Sin alertas activas para este cultivo.
            </p>
          )}
        </div>

        <CropForecast state={forecast} units={units} onRetry={reloadForecast} />

        <NearbyStations
          state={nearby}
          activeId={activeId}
          onActivate={setActiveId}
          onRetry={reload}
          units={units}
        />
      </div>
    </div>
  );
}
