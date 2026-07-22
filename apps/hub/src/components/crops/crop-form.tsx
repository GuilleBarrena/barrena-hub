"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { CropMapLoader } from "@/components/crops/crop-map-loader";
import { LocationSearch } from "@/components/crops/location-search";
import type { MapFocus } from "@/components/crops/crop-map";
import { Button } from "@barrena/ui/button";
import { formatHectares, ringAreaHectares } from "@/lib/crops/geo";
import { getCropRepository } from "@/lib/crops/repository";
import type { Crop, LatLng } from "@/lib/crops/types";

const CROP_TYPES = ["Viñedo", "Cereal", "Olivar", "Almendro", "Hortícola", "Barbecho"];

/** Full-bleed container: cancels the dashboard padding and fills the viewport,
 *  so the drawing map reads edge-to-edge with the form floating over it. */
const STAGE =
  "relative -mx-5 -my-6 h-[calc(100dvh-5.75rem)] overflow-hidden bg-surface-2 " +
  "md:-m-8 md:h-screen";

export function CropForm() {
  const router = useRouter();

  const [points, setPoints] = useState<LatLng[]>([]);
  const [closed, setClosed] = useState(false);
  const [name, setName] = useState("");
  const [cropType, setCropType] = useState(CROP_TYPES[0]);
  const [existing, setExisting] = useState<Crop[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focus, setFocus] = useState<MapFocus | undefined>();

  useEffect(() => {
    getCropRepository()
      .list()
      .then(setExisting)
      .catch(() => setExisting([]));
  }, []);

  const addPoint = useCallback((p: LatLng) => setPoints((prev) => [...prev, p]), []);
  const closeRing = useCallback(() => setClosed(true), []);

  const undo = () => {
    setClosed(false);
    setPoints((prev) => prev.slice(0, -1));
  };

  const clear = () => {
    setClosed(false);
    setPoints([]);
  };

  const areaHectares = points.length >= 3 ? ringAreaHectares(points) : 0;
  const canSave = closed && points.length >= 3 && name.trim().length > 0;

  const status = closed
    ? "Polígono cerrado."
    : points.length === 0
      ? "Haga clic en el mapa para marcar el primer vértice."
      : `${points.length} ${points.length === 1 ? "vértice" : "vértices"}. Haga clic en el primero para cerrar.`;

  async function save() {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      await getCropRepository().create({
        name: name.trim(),
        cropType,
        ring: points,
      });
      router.push("/crops");
      router.refresh();
    } catch {
      setError("No se pudo guardar el cultivo en este navegador.");
      setSaving(false);
    }
  }

  return (
    <div className={STAGE}>
      <CropMapLoader
        points={points}
        onAddPoint={addPoint}
        onCloseRing={closeRing}
        closed={closed}
        existing={existing}
        focus={focus}
      />

      {/* Top-left: back to the list + a place search to jump the map around,
          the way Google Maps lets you fly to a location before working. */}
      <div className="pointer-events-none absolute left-3 top-3 z-[500] flex w-[min(22rem,calc(100%-1.5rem))] flex-col gap-2">
        <Link
          href="/crops"
          className="pointer-events-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-[12px] font-medium text-foreground shadow-sm ring-1 ring-black/10 backdrop-blur transition-colors hover:text-brand-primary"
        >
          ← Cultivos
        </Link>
        <LocationSearch
          onSelect={(r) =>
            setFocus({ center: r.center, bounds: r.bounds, seq: Date.now() })
          }
        />
      </div>

      {/* One control panel over the map: a right rail on desktop, a bottom
          sheet on mobile — so drawing controls and the form never overlap and
          the map stays clear enough to draw on. */}
      <aside
        className="pointer-events-none absolute z-[500] flex flex-col
                   inset-x-3 bottom-3 max-h-[62%]
                   md:inset-x-auto md:bottom-auto md:left-auto md:right-3 md:top-16 md:max-h-[calc(100%-4.5rem)] md:w-[20rem]"
      >
        <div className="pointer-events-auto flex min-h-0 flex-col overflow-y-auto rounded-2xl bg-background/95 p-4 shadow-sm ring-1 ring-black/10 backdrop-blur">
          <h1 className="text-sm font-semibold tracking-tight text-foreground">
            Añadir cultivo
          </h1>
          <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
            Haga clic sobre el mapa para marcar los vértices del contorno y cierre
            el polígono para calcular la superficie.
          </p>

          {/* Drawing controls + live status. */}
          <div className="mt-4 flex flex-col gap-2 border-t border-foreground/5 pt-4">
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={undo} disabled={points.length === 0}>
                Deshacer
              </Button>
              <Button type="button" variant="secondary" onClick={clear} disabled={points.length === 0}>
                Limpiar
              </Button>
              <Button type="button" onClick={closeRing} disabled={closed || points.length < 3}>
                Cerrar polígono
              </Button>
            </div>
            <p className="text-[12px] text-muted-foreground">{status}</p>
          </div>

          {/* Crop data + save. */}
          <div className="mt-4 flex flex-col gap-4 border-t border-foreground/5 pt-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="crop-name"
                className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
              >
                Nombre
              </label>
              <input
                id="crop-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Cultivo 12"
                className="h-10 rounded-lg bg-surface px-3 text-sm text-foreground outline-none
                           ring-1 ring-input focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="crop-type"
                className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
              >
                Tipo de cultivo
              </label>
              <select
                id="crop-type"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="h-10 rounded-lg bg-surface px-3 text-sm text-foreground outline-none
                           ring-1 ring-input focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CROP_TYPES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="rounded-lg bg-surface p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Superficie calculada
              </p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">
                {points.length >= 3 ? formatHectares(areaHectares) : "—"}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Área geodésica sobre el elipsoide, no planar.
              </p>
            </div>

            {error && (
              <p role="alert" className="text-[12px] text-red-600">
                {error}
              </p>
            )}

            <Button type="button" onClick={save} disabled={!canSave || saving}>
              {saving ? "Guardando…" : "Guardar cultivo"}
            </Button>

            <p className="text-[11px] text-muted-foreground">
              Se guarda en este navegador (localStorage), no en un servidor.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
