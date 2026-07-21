import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LandingHeader } from "@/components/landing-header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Absolute URLs for og/twitter tags. Set NEXT_PUBLIC_SITE_URL in production.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001",
  ),
  title: {
    default: "Barrena Robotics — Robótica agrícola autónoma para el viñedo",
    template: "%s — Barrena Robotics",
  },
  description:
    "Barrena Robotics convierte cualquier tractor de viña en una máquina autónoma con guiado por visión, sin GPS RTK. Kit de guiado, sensórica agrícola y el Hub de operaciones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="min-h-full">
        {/* The marketing header lives in the layout, so it renders once on
            every route — no per-page duplication. */}
        <LandingHeader />
        {children}
      </body>
    </html>
  );
}
