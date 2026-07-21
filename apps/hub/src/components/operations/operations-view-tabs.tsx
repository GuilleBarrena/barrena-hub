"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Switches between the two ways of looking at the same operations: the table
 * (`/operations`) and the month calendar (`/operations/calendar`). Rendered at
 * the top of both pages so the pair reads as one section with two views, the
 * way the settings tabs do. Real links rather than local state so each view
 * keeps its own URL and the browser back button behaves.
 */
const VIEWS: { href: string; label: string }[] = [
  { href: "/operations", label: "Lista" },
  { href: "/operations/calendar", label: "Calendario" },
];

export function OperationsViewTabs() {
  const pathname = usePathname();

  return (
    <div
      role="tablist"
      aria-label="Vistas de operaciones"
      className="mb-5 inline-flex gap-1 rounded-xl bg-surface-2/60 p-1"
    >
      {VIEWS.map((view) => {
        const selected = pathname === view.href;
        return (
          <Link
            key={view.href}
            href={view.href}
            role="tab"
            aria-selected={selected}
            className={`shrink-0 rounded-lg px-3.5 py-1.5 text-sm font-medium outline-none transition-colors
                        focus-visible:ring-2 focus-visible:ring-ring
                        ${
                          selected
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
          >
            {view.label}
          </Link>
        );
      })}
    </div>
  );
}
