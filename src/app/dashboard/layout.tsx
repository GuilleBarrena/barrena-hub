import type { Metadata } from "next";
import Link from "next/link";
import { Sidenav } from "@/components/dashboard/sidenav";

export const metadata: Metadata = {
  // A bare string here would not carry a template down to nested segments,
  // so /dashboard/meteo would render as just "Meteo". Redeclaring the
  // template keeps the suffix on every dashboard page.
  title: {
    default: "Panel — Hub by barrenarobotics",
    template: "%s — Hub by barrenarobotics",
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-surface font-sans text-foreground antialiased md:flex">
      {/* Sidebar: a real column from md up, a horizontal strip below it. */}
      <aside
        className="sticky top-0 z-40 shrink-0 border-b border-border bg-background
                   px-4 py-3 md:h-screen md:w-60 md:border-b-0 md:border-r md:px-4 md:py-5"
      >
        <Link
          href="/"
          className="mb-0 flex items-baseline gap-2 rounded-lg px-1 outline-none
                     focus-visible:ring-2 focus-visible:ring-ring md:mb-6"
        >
          <span className="size-5 self-center rounded-[4px] bg-brand-primary" />
          <span className="text-sm font-semibold uppercase tracking-tight">Hub</span>
          <span className="hidden text-[11px] lowercase text-muted-foreground lg:inline">
            by barrenarobotics
          </span>
        </Link>

        <div className="mt-3 md:mt-0">
          <Sidenav />
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
