"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import type { StoredEntity } from "@/lib/storage/local-repository";

export interface Column<T> {
  header: string;
  /** Rendered cell. The first column is wrapped in the detail link. */
  cell: (row: T) => ReactNode;
  className?: string;
}

/**
 * Shared listing table for the dashboard resources. The first column becomes
 * the link to the detail page - deliberately a real anchor on the cell rather
 * than a full-row overlay, which would sit on top of the delete control and
 * swallow its clicks.
 */
export function ResourceTable<T extends StoredEntity>({
  rows,
  columns,
  hrefFor,
  onDelete,
  minWidth = 560,
}: {
  rows: T[];
  columns: Column<T>[];
  hrefFor: (row: T) => string;
  onDelete?: (row: T) => void;
  minWidth?: number;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-black/5 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm" style={{ minWidth }}>
          <thead>
            <tr className="border-b border-border text-left">
              {columns.map((c) => (
                <th
                  key={c.header}
                  scope="col"
                  className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                >
                  {c.header}
                </th>
              ))}
              {onDelete && <th scope="col" className="px-5 py-3" />}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface"
              >
                {columns.map((c, i) => (
                  <td key={c.header} className={`px-5 py-3 ${c.className ?? ""}`}>
                    {i === 0 ? (
                      <Link
                        href={hrefFor(row)}
                        className="rounded font-medium text-foreground underline-offset-4 outline-none
                                   hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {c.cell(row)}
                      </Link>
                    ) : (
                      c.cell(row)
                    )}
                  </td>
                ))}
                {onDelete && (
                  <td className="px-5 py-3 text-right">
                    {row.source === "user" && (
                      <button
                        type="button"
                        onClick={() => onDelete(row)}
                        className="rounded-md px-2 py-1 text-[12px] text-muted-foreground outline-none
                                   transition-colors hover:text-red-600 focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
