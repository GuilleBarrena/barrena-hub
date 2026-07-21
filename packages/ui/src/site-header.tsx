import type { ReactNode } from "react";
import { Wordmark } from "./wordmark";
import { MobileMenu, type NavLink } from "./mobile-menu";

/**
 * The sticky marketing header: brand lockup, inline nav (from `md` up),
 * desktop actions, and a slide-in menu below `md`. The desktop `actions` and
 * the mobile menu describe the same calls-to-action for the two layouts.
 *
 *   <SiteHeader
 *     links={nav}
 *     actions={<Button …>Solicitar demo</Button>}
 *     menuPrimaryAction={{ href: hubUrl, label: "Acceder al Hub" }}
 *   />
 */
export function SiteHeader({
  links,
  actions,
  product,
  logoHref = "/",
  menuPrimaryAction,
  menuBackLink,
}: {
  links: NavLink[];
  actions?: ReactNode;
  product?: string;
  logoHref?: string;
  menuPrimaryAction?: NavLink;
  menuBackLink?: NavLink;
}) {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-6">
        <a href={logoHref}>
          <Wordmark product={product} />
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop actions. Wrapped so `hidden` controls display without
              fighting the Button's base `inline-flex`. */}
          {actions && (
            <div className="hidden items-center gap-3 md:flex">{actions}</div>
          )}
          <MobileMenu
            links={links}
            product={product}
            primaryAction={menuPrimaryAction}
            backLink={menuBackLink}
          />
        </div>
      </div>
      <div className="h-px w-full bg-foreground/5" />
    </nav>
  );
}
