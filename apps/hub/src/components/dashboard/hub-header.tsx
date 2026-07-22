import { NotificationsMenu } from "./notifications-menu";
import { LogoutButton } from "./logout-button";

/**
 * Barra superior del panel. La navegación principal vive en la barra lateral,
 * así que el header es una franja fina que aloja las acciones de nivel de app
 * —hoy, las notificaciones que manda el Agente— alineadas a la derecha.
 *
 * Solo se muestra desde `md` (donde la lateral es una columna completa a la
 * izquierda) y se fija arriba. En móvil no hay barra superior: estas acciones
 * se fusionan en la franja lateral horizontal (ver `Sidebar`).
 */
export function HubHeader() {
  return (
    <header
      className="z-30 hidden h-14 items-center justify-end gap-1
                 border-b border-border bg-background/80 backdrop-blur
                 md:sticky md:top-0 md:flex md:px-8"
    >
      <NotificationsMenu />
      <LogoutButton />
    </header>
  );
}
