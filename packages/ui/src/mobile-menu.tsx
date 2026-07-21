"use client";

import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "./button";
import { Wordmark } from "./wordmark";

export type NavLink = { href: string; label: string };

/**
 * Slide-in navigation panel for small screens. Shown below `md`; from `md` up
 * the host header shows its inline nav instead. Everything is parameterised so
 * both the marketing home and the Hub product page share one implementation.
 *
 *   <MobileMenu
 *     links={[{ href: "#kit", label: "El kit" }, …]}
 *     product="Hub"
 *     primaryAction={{ href: hubUrl, label: "Acceder al Hub" }}
 *     backLink={{ href: "/", label: "← Barrena Robotics" }}
 *   />
 */
export function MobileMenu({
  links,
  product,
  primaryAction,
  backLink,
}: {
  links: NavLink[];
  product?: string;
  primaryAction?: NavLink;
  backLink?: NavLink;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Abrir menú"
          className="inline-flex size-9 items-center justify-center rounded-lg text-foreground
                     ring-1 ring-foreground/10 transition-colors hover:bg-surface-2
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                     md:hidden"
        >
          <MenuIcon />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          data-slot="menu-overlay"
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm md:hidden"
        />
        <Dialog.Content
          data-slot="menu-panel"
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-50 flex w-[min(20rem,85vw)] flex-col
                     bg-card shadow-xl ring-1 ring-black/5 md:hidden"
        >
          <div className="flex h-14 items-center justify-between px-5">
            <Dialog.Title className="flex items-center">
              <Wordmark product={product} />
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
            {links.map((link) => (
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

          {(primaryAction || backLink) && (
            <div className="mt-auto flex flex-col gap-3 border-t border-foreground/5 p-5">
              {primaryAction && (
                <Dialog.Close asChild>
                  <Button asChild className="w-full">
                    <a href={primaryAction.href}>{primaryAction.label}</a>
                  </Button>
                </Dialog.Close>
              )}
              {backLink && (
                <Dialog.Close asChild>
                  <a
                    href={backLink.href}
                    className="inline-flex items-center gap-1 text-[13px] text-muted-foreground
                               transition-colors hover:text-foreground"
                  >
                    {backLink.label}
                  </a>
                </Dialog.Close>
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function MenuIcon(): ReactNode {
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

function CloseIcon(): ReactNode {
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
