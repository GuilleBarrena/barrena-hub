"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Sidenav } from "./sidenav";
import { OrganizationSwitcher } from "./organization-switcher";
import { ACTIVE_ORGANIZATION } from "@/lib/organizations/data";

const STORAGE_KEY = "hub:sidebar-collapsed";

/**
 * The collapsed preference is external state (localStorage), so it's read
 * through `useSyncExternalStore`. That keeps the server render and the first
 * client render in sync (both start expanded via the server snapshot, so
 * there's no hydration mismatch) and re-renders on change — here and in other
 * tabs — without the set-state-in-effect pattern.
 */
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  window.addEventListener("storage", notify);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", notify);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    // Private mode / disabled storage: treat as expanded.
    return false;
  }
}

/** Server (and first client) render: always expanded. */
function getServerSnapshot() {
  return false;
}

function setCollapsed(next: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {
    // Non-fatal: fall through and still notify for this session.
  }
  emit();
}

/**
 * Dashboard sidebar: Hub mark, the active organization, the nav, and a
 * collapse control. Collapsing only applies from `md` up, where the sidebar
 * is a real column — below that it stays a horizontal strip and the toggle is
 * hidden.
 */
export function Sidebar() {
  const collapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <aside
      data-collapsed={collapsed}
      className={`sticky top-0 z-40 shrink-0 border-b border-border bg-background
                  px-4 py-3 transition-[width] duration-200
                  md:h-screen md:flex md:flex-col md:border-b-0 md:border-r md:px-3 md:py-5
                  ${collapsed ? "md:w-[4.75rem]" : "md:w-60"}`}
    >
      <Link
        href="/"
        aria-label="Hub by barrenarobotics"
        className={`flex items-baseline gap-2 rounded-lg px-1 outline-none
                    focus-visible:ring-2 focus-visible:ring-ring
                    ${collapsed ? "md:justify-center" : ""}`}
      >
        <span className="size-5 self-center rounded-[4px] bg-brand-primary" />
        <span className={`text-sm font-semibold uppercase tracking-tight ${collapsed ? "md:hidden" : ""}`}>
          Hub
        </span>
        <span
          className={`text-[11px] lowercase text-muted-foreground ${collapsed ? "hidden" : "hidden lg:inline"}`}
        >
          by barrenarobotics
        </span>
      </Link>

      {/* Organization sits directly under the Hub mark, Stripe-style. */}
      <div className="mt-3 md:mt-4">
        <OrganizationSwitcher organization={ACTIVE_ORGANIZATION} collapsed={collapsed} />
      </div>

      <div className="mt-3 md:mt-5 md:min-h-0 md:flex-1 md:overflow-y-auto">
        <Sidenav collapsed={collapsed} />
      </div>

      {/* Collapse control — a real column only exists from md up. */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        aria-pressed={collapsed}
        aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
        title={collapsed ? "Expandir menú" : "Contraer menú"}
        className={`mt-4 hidden items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground
                    outline-none transition-colors hover:bg-surface-2/60 hover:text-foreground
                    focus-visible:ring-2 focus-visible:ring-ring
                    md:flex ${collapsed ? "md:justify-center md:gap-0 md:px-0" : ""}`}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`size-4 shrink-0 transition-transform ${collapsed ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 6l-6 6 6 6" />
        </svg>
        <span className={collapsed ? "md:hidden" : undefined}>Contraer</span>
      </button>
    </aside>
  );
}
