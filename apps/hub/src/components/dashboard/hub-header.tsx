import { NotificationsMenu } from "./notifications-menu";

/**
 * Barra superior del panel. La navegación principal vive en la barra lateral,
 * así que el header es una franja fina que aloja las acciones de nivel de app
 * —hoy, las notificaciones que manda el Agente— alineadas a la derecha.
 *
 * Se fija arriba desde `md` (donde la lateral es una columna completa a la
 * izquierda); en móvil fluye bajo la franja lateral horizontal.
 */
export function HubHeader() {
  return (
    <header
      className="z-30 flex h-14 items-center justify-end gap-1
                 border-b border-border bg-background/80 px-5 backdrop-blur
                 md:sticky md:top-0 md:px-8"
    >
      <NotificationsMenu />
    </header>
  );
}
