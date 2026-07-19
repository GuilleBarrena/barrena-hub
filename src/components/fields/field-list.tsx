"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { formatHectares } from "@/lib/fields/geo";
import { getFieldRepository } from "@/lib/fields/repository";
import type { Field } from "@/lib/fields/types";

export function FieldList() {
  const [fields, setFields] = useState<Field[] | null>(null);

  const load = useCallback(() => {
    getFieldRepository()
      .list()
      .then(setFields)
      .catch(() => setFields([]));
  }, []);

  useEffect(load, [load]);

  async function remove(id: string) {
    await getFieldRepository().remove(id);
    load();
  }

  // null = not loaded yet. Storage is browser-only, so the first paint has
  // nothing to show and must not claim the list is empty.
  if (fields === null) {
    return <p className="text-sm text-muted-foreground">Cargando parcelas…</p>;
  }

  const totalHectares = fields.reduce((sum, f) => sum + f.areaHectares, 0);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {fields.length} {fields.length === 1 ? "parcela" : "parcelas"} ·{" "}
          {formatHectares(totalHectares)} en total
        </p>
        <Button asChild>
          <Link href="/dashboard/fields/new">Añadir parcela</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-black/5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {["Parcela", "Cultivo", "Superficie", "Origen", ""].map((h, i) => (
                  <th
                    key={h || i}
                    scope="col"
                    className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((f) => (
                <tr key={f.id} className="border-b border-border/60 last:border-0">
                  <td className="px-5 py-3 font-medium text-foreground">{f.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{f.cropType}</td>
                  <td className="px-5 py-3 tabular-nums text-muted-foreground">
                    {formatHectares(f.areaHectares)}
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {f.source === "sample" ? "Muestra" : "Dibujada"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {f.source === "user" && (
                      <button
                        type="button"
                        onClick={() => remove(f.id)}
                        className="rounded-md px-2 py-1 text-[12px] text-muted-foreground outline-none
                                   transition-colors hover:text-red-600 focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-6 text-[11px] text-muted-foreground">
        Las parcelas marcadas como muestra son datos de ejemplo. Las que dibuje se
        guardan únicamente en este navegador.
      </p>
    </>
  );
}
