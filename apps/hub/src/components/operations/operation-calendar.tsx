"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getOperationRepository } from "@/lib/operations/repository";
import { loadOperationRefs, type OperationRefs } from "@/lib/operations/references";
import { OPERATION_STATUS, type Operation } from "@/lib/operations/types";

/** Alert level → dot colour, mirroring the tokens the status badge uses. */
const LEVEL_DOT: Record<string, string> = {
  good: "bg-brand-primary",
  warning: "bg-brand-accent",
  serious: "bg-red-600",
};

/** Monday-first weekday initials, the Spanish convention. */
const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

/** A local ISO date (YYYY-MM-DD) for a Date, avoiding the UTC shift `toISOString` brings. */
function isoDay(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Monday-index of a day: Mon = 0 … Sun = 6, shifting JS's Sunday-first week. */
function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

/**
 * The 42 cells (6 weeks) that cover `month`, each tagged with whether it falls
 * inside the month. A fixed grid keeps the calendar's height steady as you page
 * between months rather than jumping between five and six rows.
 */
function monthCells(year: number, month: number): { date: Date; inMonth: boolean }[] {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - mondayIndex(first));
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    return { date, inMonth: date.getMonth() === month };
  });
}

export function OperationCalendar() {
  const [operations, setOperations] = useState<Operation[] | null>(null);
  const [refs, setRefs] = useState<OperationRefs | null>(null);
  // `null` until the browser paints, so the first server render (which has no
  // access to local time) doesn't lock onto a month the client would disagree
  // with. The effect sets it to the real "today".
  const [cursor, setCursor] = useState<{ year: number; month: number } | null>(null);

  useEffect(() => {
    const now = new Date();
    const thisMonth = { year: now.getFullYear(), month: now.getMonth() };

    Promise.all([getOperationRepository().list(), loadOperationRefs()])
      .then(([ops, r]) => {
        setOperations(ops);
        setRefs(r);
        setCursor(thisMonth);
      })
      .catch(() => {
        setOperations([]);
        setRefs({ workers: new Map(), vehicles: new Map(), crops: new Map() });
        setCursor(thisMonth);
      });
  }, []);

  /** Operations grouped by their scheduled day, sorted by name within a day. */
  const byDay = useMemo(() => {
    const map = new Map<string, Operation[]>();
    for (const op of operations ?? []) {
      const list = map.get(op.scheduledFor);
      if (list) list.push(op);
      else map.set(op.scheduledFor, [op]);
    }
    for (const list of map.values()) list.sort((a, b) => a.name.localeCompare(b.name, "es"));
    return map;
  }, [operations]);

  const step = useCallback((delta: number) => {
    setCursor((c) => {
      if (!c) return c;
      const d = new Date(c.year, c.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }, []);

  const goToday = useCallback(() => {
    const now = new Date();
    setCursor({ year: now.getFullYear(), month: now.getMonth() });
  }, []);

  if (operations === null || refs === null || cursor === null) {
    return <p className="text-sm text-muted-foreground">Cargando calendario…</p>;
  }

  const cells = monthCells(cursor.year, cursor.month);
  const todayIso = isoDay(new Date());
  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
  const monthCount = cells.reduce(
    (sum, c) => sum + (c.inMonth ? byDay.get(isoDay(c.date))?.length ?? 0 : 0),
    0,
  );

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Mes anterior"
            className="grid size-8 place-items-center rounded-lg text-muted-foreground outline-none
                       transition-colors hover:bg-surface-2 hover:text-foreground
                       focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <h2 className="min-w-40 text-center text-sm font-semibold capitalize tracking-tight text-foreground md:text-base">
            {monthLabel}
          </h2>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Mes siguiente"
            className="grid size-8 place-items-center rounded-lg text-muted-foreground outline-none
                       transition-colors hover:bg-surface-2 hover:text-foreground
                       focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {monthCount} {monthCount === 1 ? "operación" : "operaciones"} este mes
          </p>
          <button
            type="button"
            onClick={goToday}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground outline-none
                       transition-colors hover:bg-surface-2 hover:text-foreground
                       focus-visible:ring-2 focus-visible:ring-ring"
          >
            Hoy
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-black/5 shadow-sm">
        <div className="grid grid-cols-7 border-b border-border">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="px-2 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map(({ date, inMonth }, i) => {
            const iso = isoDay(date);
            const dayOps = byDay.get(iso) ?? [];
            const isToday = iso === todayIso;
            return (
              <div
                key={iso}
                className={`min-h-24 border-b border-border/60 p-1.5 last:border-0
                            ${i % 7 !== 6 ? "border-r" : ""}
                            ${inMonth ? "" : "bg-surface-2/30"}`}
              >
                <div className="mb-1 flex justify-end">
                  <span
                    className={`grid size-6 place-items-center rounded-full text-[11px] tabular-nums
                                ${isToday ? "bg-brand-primary font-semibold text-white" : ""}
                                ${inMonth ? "text-foreground" : "text-muted-foreground/60"}`}
                  >
                    {date.getDate()}
                  </span>
                </div>
                <ul className="flex flex-col gap-1">
                  {dayOps.map((op) => (
                    <li key={op.id}>
                      <Link
                        href={`/operations/${op.id}`}
                        title={`${op.name} · ${OPERATION_STATUS[op.status].label}`}
                        className="flex items-center gap-1.5 rounded-md bg-surface-2/70 px-1.5 py-1 text-[11px] leading-tight
                                   text-foreground outline-none transition-colors hover:bg-surface-2
                                   focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span
                          className={`size-1.5 shrink-0 rounded-full ${
                            LEVEL_DOT[OPERATION_STATUS[op.status].level] ?? LEVEL_DOT.warning
                          }`}
                          aria-hidden="true"
                        />
                        <span className="truncate">{op.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        {Object.values(OPERATION_STATUS).map((status) => (
          <span key={status.label} className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <span
              className={`size-2 shrink-0 rounded-full ${LEVEL_DOT[status.level] ?? LEVEL_DOT.warning}`}
              aria-hidden="true"
            />
            {status.label}
          </span>
        ))}
      </div>
    </>
  );
}
