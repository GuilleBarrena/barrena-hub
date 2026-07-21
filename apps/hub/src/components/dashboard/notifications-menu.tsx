"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Notificacion } from "@/lib/notifications/types";
import { notificacionesSemilla } from "@/lib/notifications/seed";
import { anadirIds, useConjuntoPersistido } from "@/lib/notifications/store";
import { PRIORIDAD_META } from "@/lib/actionables/ui";

// Claves de persistencia. Solo guardamos el estado que el usuario controla
// (qué ha leído y qué ha descartado); la lista en sí procede de la semilla.
const KEY_LEIDAS = "hub:notif-leidas";
const KEY_DESCARTADAS = "hub:notif-descartadas";

/**
 * Menú de notificaciones del header: una campana con contador de no leídas y un
 * panel desplegable con lo que el Agente te manda para accionar.
 *
 * El estado de leídas/descartadas se persiste en localStorage. Se inicia vacío
 * en el render del servidor y del primer cliente (mismo contador → sin desajuste
 * de hidratación) y se rehidrata tras montar.
 */
export function NotificationsMenu() {
  // La lista se genera una vez por montaje. Al ir en el layout, el menú persiste
  // entre navegaciones, así que basta con estado local.
  const [items] = useState<Notificacion[]>(() => notificacionesSemilla());
  const leidas = useConjuntoPersistido(KEY_LEIDAS);
  const descartadas = useConjuntoPersistido(KEY_DESCARTADAS);
  const [abierto, setAbierto] = useState(false);

  const contenedorRef = useRef<HTMLDivElement>(null);

  const visibles = useMemo(
    () =>
      items
        .filter((n) => !descartadas.has(n.id))
        .sort(
          (a, b) =>
            PRIORIDAD_META[a.prioridad].orden - PRIORIDAD_META[b.prioridad].orden ||
            b.creadaEn.localeCompare(a.creadaEn),
        ),
    [items, descartadas],
  );

  const noLeidas = visibles.filter((n) => !leidas.has(n.id)).length;

  const marcarLeida = (id: string) => {
    if (!leidas.has(id)) anadirIds(KEY_LEIDAS, [id]);
  };

  const marcarTodasLeidas = () => {
    anadirIds(KEY_LEIDAS, visibles.map((n) => n.id));
  };

  const descartar = (id: string) => {
    anadirIds(KEY_DESCARTADAS, [id]);
  };

  // Cierre por click fuera y por Escape mientras está abierto.
  useEffect(() => {
    if (!abierto) return;
    const alClicar = (e: MouseEvent) => {
      if (!contenedorRef.current?.contains(e.target as Node)) setAbierto(false);
    };
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("mousedown", alClicar);
    document.addEventListener("keydown", alTeclear);
    return () => {
      document.removeEventListener("mousedown", alClicar);
      document.removeEventListener("keydown", alTeclear);
    };
  }, [abierto]);

  return (
    <div ref={contenedorRef} className="relative">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-label={
          noLeidas > 0
            ? `Notificaciones, ${noLeidas} sin leer`
            : "Notificaciones"
        }
        className="relative flex size-9 items-center justify-center rounded-lg
                   text-muted-foreground outline-none transition-colors
                   hover:bg-surface-2/60 hover:text-foreground
                   focus-visible:ring-2 focus-visible:ring-ring
                   aria-expanded:bg-surface-2/60 aria-expanded:text-foreground"
      >
        <BellIcon />
        {noLeidas > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center
                       rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-4
                       text-white ring-2 ring-background tabular-nums"
          >
            {noLeidas > 9 ? "9+" : noLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <div
          role="menu"
          aria-label="Notificaciones"
          className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-1.5rem))]
                     origin-top-right overflow-hidden rounded-2xl bg-card
                     shadow-lg ring-1 ring-black/10"
        >
          {/* Cabecera */}
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold tracking-tight text-foreground">
                Notificaciones
              </p>
              <p className="text-[11px] text-muted-foreground">
                {noLeidas > 0
                  ? `${noLeidas} sin leer · del Agente`
                  : "Al día · del Agente"}
              </p>
            </div>
            {noLeidas > 0 && (
              <button
                type="button"
                onClick={marcarTodasLeidas}
                className="shrink-0 rounded-md px-2 py-1 text-[11px] font-medium text-brand-primary
                           outline-none transition-colors hover:bg-brand-primary/10
                           focus-visible:ring-2 focus-visible:ring-ring"
              >
                Marcar todo leído
              </button>
            )}
          </div>

          {/* Lista */}
          {visibles.length === 0 ? (
            <p className="px-4 py-10 text-center text-[13px] text-muted-foreground">
              No hay notificaciones.
            </p>
          ) : (
            <ul className="max-h-[min(28rem,70vh)] divide-y divide-border overflow-y-auto">
              {visibles.map((n) => (
                <NotificacionItem
                  key={n.id}
                  item={n}
                  leida={leidas.has(n.id)}
                  onLeida={() => marcarLeida(n.id)}
                  onDescartar={() => descartar(n.id)}
                  onNavegar={() => {
                    marcarLeida(n.id);
                    setAbierto(false);
                  }}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function NotificacionItem({
  item,
  leida,
  onLeida,
  onDescartar,
  onNavegar,
}: {
  item: Notificacion;
  leida: boolean;
  onLeida: () => void;
  onDescartar: () => void;
  onNavegar: () => void;
}) {
  const p = PRIORIDAD_META[item.prioridad];
  return (
    <li
      role="menuitem"
      onMouseEnter={onLeida}
      className={`group relative flex gap-3 px-4 py-3 transition-colors hover:bg-surface-2/50 ${
        leida ? "" : "bg-brand-primary/[0.04]"
      }`}
    >
      {/* Punto de prioridad; doble como indicador de no leída. */}
      <span className="mt-1.5 shrink-0" aria-hidden="true">
        <span className={`block size-2 rounded-full ${p.dot}`} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${p.texto}`}>
            {p.label}
          </span>
          <span className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {item.ambito}
          </span>
          <span className="ml-auto shrink-0 text-[11px] tabular-nums text-muted-foreground">
            {formatearRelativo(item.creadaEn)}
          </span>
        </div>

        <p className={`mt-1 text-[13px] leading-snug ${leida ? "font-medium text-foreground" : "font-semibold text-foreground"}`}>
          {item.titulo}
        </p>
        <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
          {item.mensaje}
        </p>

        {item.href && (
          <Link
            href={item.href}
            onClick={onNavegar}
            className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-brand-primary
                       outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            {item.accionLabel ?? "Ver"} →
          </Link>
        )}
      </div>

      {/* Descartar */}
      <button
        type="button"
        onClick={onDescartar}
        aria-label={`Descartar: ${item.titulo}`}
        title="Descartar"
        className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-md
                   text-muted-foreground opacity-0 outline-none transition-opacity
                   hover:bg-surface-2 hover:text-foreground focus-visible:opacity-100
                   focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
      >
        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    </li>
  );
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

/** Tiempo relativo compacto en español: "ahora", "hace 8 min", "hace 3 h", "hace 2 d". */
function formatearRelativo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60_000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return `hace ${d} d`;
}
