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
    href: "/dashboard/meteo",
    label: "Meteo",
    exact: false,
    icon: (
      <path d="M7 18h9.5a3.5 3.5 0 0 0 .3-6.99A5.5 5.5 0 0 0 6.6 9.2 3.9 3.9 0 0 0 7 18Z" />
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
