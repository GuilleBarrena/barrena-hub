import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppFrame } from "@/components/auth/app-frame";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Absolute URLs for og/twitter tags. Set NEXT_PUBLIC_SITE_URL in production.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Panel — Hub · Barrena Robotics",
    template: "%s — Hub · Barrena Robotics",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="min-h-full">
        {/* Auth gate: `/login` renders bare, every other route renders inside
            the dashboard shell once a localStorage session is present. */}
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
