import { Button } from "@barrena/ui/button";
import { SiteHeader } from "@barrena/ui/site-header";
import { HUB_URL, SITE_NAV } from "@/lib/site";

/**
 * The marketing site header. One instance, used identically on every landing
 * page (home, /w-1, /hub) so the brand lockup, nav and actions stay consistent
 * as you navigate. The logo links home; product identity lives in each page's
 * hero, not in the nav.
 */
export function LandingHeader() {
  return (
    <SiteHeader
      links={SITE_NAV}
      actions={
        <>
          <Button asChild variant="ghost" className="px-2">
            <a href={HUB_URL}>Acceder al Hub</a>
          </Button>
          <Button asChild>
            <a href="#contacto">Solicitar demo</a>
          </Button>
        </>
      }
      menuPrimaryAction={{ href: "#contacto", label: "Solicitar demo" }}
    />
  );
}
