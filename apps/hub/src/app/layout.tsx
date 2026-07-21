import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/dashboard/sidebar";

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
        {/* App shell: the sidebar is a real column from md up, a horizontal
            strip below it. Every page now lives at the root, so the shell
            lives in the root layout. */}
        <div className="min-h-screen bg-surface font-sans text-foreground antialiased md:flex">
          <Sidebar />
          <main className="min-w-0 flex-1 px-5 py-6 md:px-8 md:py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
