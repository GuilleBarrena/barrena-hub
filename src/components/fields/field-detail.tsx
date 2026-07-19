"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { FieldViewMapLoader } from "@/components/fields/field-view-map-loader";
import { Button } from "@/components/ui/button";
import { formatHectares, toGeoJSON } from "@/lib/fields/geo";
import { getFieldRepository } from "@/lib/fields/repository";
import type { Field } from "@/lib/fields/types";

type State =
  | { status: "loading" }
  | { status: "found"; field: Field }
  | { status: "missing" };

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
    return <p className="text-sm text-muted-foreground">Cargando parcela…</p>;
  }

  if (state.status === "missing") {
    return (
      <div className="rounded-2xl bg-card p-6 ring-1 ring-black/5">
        <p className="text-sm font-medium text-foreground">Parcela no encontrada</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Puede que se dibujara en otro navegador: las parcelas propias se guardan
          únicamente en este dispositivo.
        </p>
        <Button asChild variant="secondary" className="mt-4">
          <Link href="/dashboard/fields">Volver al listado</Link>
        </Button>
      </div>
    );
  }

  const { field } = state;
  const geojson = JSON.stringify(toGeoJSON(field), null, 2);

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
    <>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          {field.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {field.cropType} · {formatHectares(field.areaHectares)}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FieldViewMapLoader field={field} />
        </div>

        <aside className="flex flex-col gap-4">
        <div className="rounded-2xl bg-card p-5 ring-1 ring-black/5 shadow-sm">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Detalles</h2>
          <dl className="mt-4 flex flex-col gap-3 text-sm">
            {[
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
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {k}
                </dt>
                <dd className="text-right tabular-nums text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl bg-card p-5 ring-1 ring-black/5 shadow-sm">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Geometría</h2>
          <p className="mt-1 text-[12px] text-muted-foreground">
            GeoJSON en EPSG:4326, anillo cerrado.
          </p>
          <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-surface p-3 text-[11px] leading-relaxed text-muted-foreground">
            {geojson}
          </pre>
          <Button type="button" variant="secondary" className="mt-3 w-full" onClick={copyGeoJSON}>
            {copied ? "Copiado" : "Copiar GeoJSON"}
          </Button>
        </div>

          {field.source === "user" && (
            <button
              type="button"
              onClick={remove}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground outline-none transition-colors
                         hover:text-red-600 focus-visible:ring-2 focus-visible:ring-ring"
            >
              Eliminar parcela
            </button>
          )}
        </aside>
      </div>
    </>
  );
}
