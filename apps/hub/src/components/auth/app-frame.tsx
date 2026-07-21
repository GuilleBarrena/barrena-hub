"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/session";
import { AppShell } from "@/components/dashboard/app-shell";

const LOGIN_PATH = "/login";

/**
 * False on the server and during hydration, true once mounted on the client.
 * Implemented with `useSyncExternalStore` (server snapshot `false`, client
 * snapshot `true`) so it never sets state from an effect — by the time it reads
 * `true`, `useSession` has already synced with localStorage.
 */
function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * Client-side auth gate for the whole app.
 *
 * Everything except `/login` is private. The session lives in localStorage
 * (see `@/lib/auth/session`), so the check runs on the client: the server
 * render — and the first client paint — can't know who's signed in.
 *
 * The subtlety is that `useSession` returns null during server render and
 * hydration, then flips to the real value once localStorage is read. Acting on
 * that first null would bounce a signed-in visitor to `/login` on every reload,
 * so we hold every decision behind `ready`, which only turns true after the
 * component has mounted on the client and the real session is known. Until
 * then a protected route shows a neutral splash — so a page reload lands right
 * back where it was instead of flashing the login screen or jumping home.
 *
 * - `/login` renders bare, with no dashboard chrome.
 * - Any other route renders inside `AppShell` once a session is confirmed;
 *   otherwise the visitor is redirected to `/login`.
 * - A visitor who is already signed in and lands on `/login` is sent home.
 */
export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const ready = useHydrated();

  const onLogin = pathname === LOGIN_PATH;
  const authed = session !== null;

  useEffect(() => {
    if (!ready) return;
    if (!authed && !onLogin) {
      router.replace(LOGIN_PATH);
    } else if (authed && onLogin) {
      router.replace("/");
    }
  }, [ready, authed, onLogin, router]);

  // Login route is public: render it as soon as we know the visitor isn't
  // signed in, and bounce a signed-in visitor home.
  if (onLogin) {
    return authed ? null : <>{children}</>;
  }

  // Protected routes hold until the client has confirmed a session. A guest is
  // redirected by the effect above; until then, and while that redirect
  // settles, show the splash rather than a blank frame or the page itself.
  if (!ready || !authed) return <AuthSplash />;

  return <AppShell>{children}</AppShell>;
}

/** Neutral full-screen holding state while the session is being resolved. */
function AuthSplash() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <span
        aria-hidden
        className="size-8 animate-pulse rounded-lg bg-brand-primary/30"
      />
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
