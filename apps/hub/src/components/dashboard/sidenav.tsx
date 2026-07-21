"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  /** Light only on an exact path match, rather than any prefix. */
  exact: boolean;
  icon: ReactNode;
}

const ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Inicio",
    // Exact match: every dashboard route starts with /, so a prefix
    // test would keep "Inicio" lit on every child page.
    exact: true,
    icon: (
      <path d="M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5" />
    ),
  },
  {
    href: "/agent",
    label: "Agente",
    exact: false,
    icon: (
      <>
        <rect x="4" y="8" width="16" height="11" rx="3" />
        <path d="M12 8V4M9 4h6" />
        <path d="M9.5 13.5h.01M14.5 13.5h.01" />
      </>
    ),
  },
  {
    href: "/operations",
    label: "Operaciones",
    exact: false,
    icon: (
      <>
        <path d="M4 7h10M4 12h16M4 17h7" />
        <circle cx="18" cy="7" r="1.6" />
        <circle cx="15" cy="17" r="1.6" />
      </>
    ),
  },
  {
    href: "/vehicles",
    label: "Vehículos",
    exact: false,
    icon: (
      <>
        <path d="M3 16.5V12l2-4.5h9l3 4.5h4v4.5" />
        <circle cx="7.5" cy="17" r="1.8" />
        <circle cx="17" cy="17" r="1.8" />
      </>
    ),
  },
  {
    href: "/workers",
    label: "Operarios",
    exact: false,
    icon: (
      <>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
      </>
    ),
  },
  {
    href: "/fields",
    label: "Parcelas",
    exact: false,
    icon: <path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Zm0 5.5 9 4.5 9-4.5" />,
  },
  {
    href: "/meteo",
    label: "Meteo",
    exact: false,
    icon: (
      <path d="M7 18h9.5a3.5 3.5 0 0 0 .3-6.99A5.5 5.5 0 0 0 6.6 9.2 3.9 3.9 0 0 0 7 18Z" />
    ),
  },
];

/** Utility items that belong at the foot of the rail, away from the primary
 *  navigation. Settings is the classic example. */
const BOTTOM_ITEMS: NavItem[] = [
  {
    href: "/settings",
    label: "Ajustes",
    exact: false,
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18" />
      </>
    ),
  },
];

export function Sidenav({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const renderItem = (item: NavItem) => {
    const active = isActive(item.href, item.exact);
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        aria-label={item.label}
        title={collapsed ? item.label : undefined}
        className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors
                    outline-none focus-visible:ring-2 focus-visible:ring-ring
                    ${collapsed ? "md:justify-center md:gap-0 md:px-0" : ""}
                    ${
                      active
                        ? "bg-surface-2 font-medium text-foreground"
                        : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground"
                    }`}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`size-4 shrink-0 ${active ? "text-brand-primary" : "text-muted-foreground"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {item.icon}
        </svg>
        <span className={collapsed ? "md:hidden" : undefined}>{item.label}</span>
      </Link>
    );
  };

  return (
    // Full-height column on desktop so the bottom group can be pushed to the
    // foot with `mt-auto`; a plain horizontal strip below md, where the two
    // groups simply sit end to end.
    <nav
      aria-label="Navegación del panel"
      className="flex gap-1 overflow-x-auto md:h-full md:flex-col md:overflow-visible"
    >
      <div className="flex gap-1 md:flex-col">{ITEMS.map(renderItem)}</div>
      <div className="flex gap-1 md:mt-auto md:flex-col md:border-t md:border-border md:pt-2">
        {BOTTOM_ITEMS.map(renderItem)}
      </div>
    </nav>
  );
}
