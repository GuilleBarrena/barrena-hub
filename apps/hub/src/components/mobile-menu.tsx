"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@barrena/ui/button";

// In-page navigation. Anchors match the `id`s set on the landing sections.
const NAV_LINKS: { href: string; label: string }[] = [
  { href: "#kit", label: "Kit de guiado autónomo" },
  { href: "#inteligencia", label: "Inteligencia operativa" },
  { href: "#incluido", label: "También incluido, gratis" },
];

export function MobileMenu({ rootSite }: { rootSite: string }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Abrir menú"
          className="inline-flex size-9 items-center justify-center rounded-lg text-foreground
                     ring-1 ring-foreground/10 transition-colors hover:bg-surface-2
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                     sm:hidden"
        >
          <MenuIcon />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          data-slot="menu-overlay"
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm sm:hidden"
        />
        <Dialog.Content
          data-slot="menu-panel"
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-50 flex w-[min(20rem,85vw)] flex-col
                     bg-card shadow-xl ring-1 ring-black/5 sm:hidden"
        >
          <div className="flex h-14 items-center justify-between px-5">
            <Dialog.Title className="flex items-baseline gap-2">
              <span className="size-5 self-center rounded-[4px] bg-brand-primary" />
              <span className="text-sm font-semibold uppercase tracking-tight">
                Hub
              </span>
              <span className="text-[11px] text-muted-foreground">·</span>
              <span className="text-sm font-semibold tracking-tight text-foreground">
                Barrena Robotics
              </span>
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Cerrar menú"
                className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground
                           transition-colors hover:bg-surface-2 hover:text-foreground
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <CloseIcon />
              </button>
            </Dialog.Close>
          </div>

          <div className="h-px w-full bg-foreground/5" />

          <nav className="flex flex-col gap-1 px-3 py-4">
            {NAV_LINKS.map((link) => (
              <Dialog.Close asChild key={link.href}>
                <a
                  href={link.href}
                  className="rounded-lg px-2 py-3 text-[15px] font-medium text-foreground
                             transition-colors hover:bg-surface-2"
                >
                  {link.label}
                </a>
              </Dialog.Close>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-3 border-t border-foreground/5 p-5">
            <Dialog.Close asChild>
              <Button asChild className="w-full">
                <a href="/dashboard">Acceder al Hub</a>
              </Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <a
                href={rootSite}
                className="inline-flex items-center gap-1 text-[13px] text-muted-foreground
                           transition-colors hover:text-foreground"
              >
                ← barrenarobotics.com
              </a>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function MenuIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
