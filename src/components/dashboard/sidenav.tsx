"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  {
    href: "/dashboard",
    label: "Inicio",
    // Exact match: every dashboard route starts with /dashboard, so a prefix
    // test would keep "Inicio" lit on every child page.
    exact: true,
    icon: (
      <path d="M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5" />
    ),
  },
  {
    href: "/dashboard/fields",
    label: "Parcelas",
    exact: false,
    icon: <path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Zm0 5.5 9 4.5 9-4.5" />,
  },
  {
    href: "/dashboard/vehicles",
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
    href: "/dashboard/workers",
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
    href: "/dashboard/meteo",
    label: "Meteo",
    exact: false,
    icon: (
      <path d="M7 18h9.5a3.5 3.5 0 0 0 .3-6.99A5.5 5.5 0 0 0 6.6 9.2 3.9 3.9 0 0 0 7 18Z" />
    ),
  },
  {
    href: "/dashboard/agent",
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
];

export function Sidenav() {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label="Navegación del panel"
      className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible"
    >
      {ITEMS.map((item) => {
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors
                        outline-none focus-visible:ring-2 focus-visible:ring-ring
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
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
