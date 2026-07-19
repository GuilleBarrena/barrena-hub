"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { FieldMapLoader } from "@/components/fields/field-map-loader";
import { Button } from "@/components/ui/button";
import { formatHectares, ringAreaHectares } from "@/lib/fields/geo";
import { getFieldRepository } from "@/lib/fields/repository";
import type { Field, LatLng } from "@/lib/fields/types";

const CROP_TYPES = ["Viñedo", "Cereal", "Olivar", "Almendro", "Hortícola", "Barbecho"];

export function FieldForm() {
  const router = useRouter();

  const [points, setPoints] = useState<LatLng[]>([]);
  const [closed, setClosed] = useState(false);
  const [name, setName] = useState("");
  const [cropType, setCropType] = useState(CROP_TYPES[0]);
  const [existing, setExisting] = useState<Field[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFieldRepository()
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

  async function save() {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      await getFieldRepository().create({
        name: name.trim(),
        cropType,
        ring: points,
      });
      router.push("/dashboard/fields");
      router.refresh();
    } catch {
      setError("No se pudo guardar la parcela en este navegador.");
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <FieldMapLoader
          points={points}
          onAddPoint={addPoint}
          onCloseRing={closeRing}
          closed={closed}
          existing={existing}
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button type="button" variant="secondary" onClick={undo} disabled={points.length === 0}>
            Deshacer punto
          </Button>
          <Button type="button" variant="secondary" onClick={clear} disabled={points.length === 0}>
            Limpiar
          </Button>
          <Button type="button" onClick={closeRing} disabled={closed || points.length < 3}>
            Cerrar polígono
          </Button>
          <p className="text-[12px] text-muted-foreground">
            {closed
              ? "Polígono cerrado."
              : points.length === 0
                ? "Haga clic en el mapa para marcar el primer vértice."
                : `${points.length} ${points.length === 1 ? "vértice" : "vértices"}. Haga clic en el primero para cerrar.`}
          </p>
        </div>
      </div>

      <aside className="rounded-2xl bg-card p-5 ring-1 ring-black/5 shadow-sm">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          Datos de la parcela
        </h2>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="field-name"
              className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
            >
              Nombre
            </label>
            <input
              id="field-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Parcela 12"
              className="h-10 rounded-lg bg-surface px-3 text-sm text-foreground outline-none
                         ring-1 ring-input focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="field-crop"
              className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
            >
              Cultivo
            </label>
            <select
              id="field-crop"
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
            {saving ? "Guardando…" : "Guardar parcela"}
          </Button>

          <p className="text-[11px] text-muted-foreground">
            Se guarda en este navegador (localStorage), no en un servidor.
          </p>
        </div>
      </aside>
    </div>
  );
}
