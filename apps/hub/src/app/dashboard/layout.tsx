import type { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/sidebar";

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
      {/* Sidebar: a real, collapsible column from md up; a horizontal strip below it. */}
      <Sidebar />

      <main className="min-w-0 flex-1 px-5 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
