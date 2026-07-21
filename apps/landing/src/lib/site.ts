// The Hub console lives in its own app. In production it sits on a subdomain;
// override with NEXT_PUBLIC_HUB_URL (e.g. http://localhost:3000 in dev).
export const HUB_URL =
  process.env.NEXT_PUBLIC_HUB_URL ?? "https://hub.barrenarobotics.com";

// Global site navigation — the same on every marketing page so the header is
// consistent as you move between them. Anchors (#contacto) exist on all pages.
export const SITE_NAV = [
  { href: "/w-1", label: "W-1" },
  { href: "/hub", label: "Hub" },
  { href: "#contacto", label: "Contacto" },
];
