"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/session";
import { AppShell } from "@/components/dashboard/app-shell";

const LOGIN_PATH = "/login";

const noopSubscribe = () => () => {};

/**
 * True only after client hydration. `useSyncExternalStore` returns the server
 * snapshot (`false`) on the server render and first client paint, then the
 * client snapshot (`true`) once mounted — exactly the point at which the
 * localStorage-backed session has been read.
 */
function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * Client-side auth gate for the whole app.
 *
 * Everything except `/login` is private. Because the session lives in
 * localStorage (see `@/lib/auth/session`), the check has to run on the client:
 * the server render — and the first client paint — treat nobody as signed in
 * (`getServerSnapshot` returns null), and the real session only arrives after
 * mount, once localStorage is read.
 *
 * That transient null is the catch: a not-yet-read session and a signed-out
 * visitor both look like `null`, so the guard must NOT act until it knows which
 * one it's looking at. `hydrated` tracks exactly that — it flips true only after
 * the client has mounted, by which point the session store has delivered the
 * localStorage value. Redirecting before then would bounce a signed-in visitor
 * to `/login` on every hard refresh (and from there home).
 *
 * - Before hydration: render nothing and redirect nobody.
 * - `/login` renders bare, with no dashboard chrome.
 * - Any other route renders inside `AppShell` only once a session exists;
 *   otherwise the visitor is bounced to `/login`.
 * - A visitor who is already signed in and lands on `/login` is sent home.
 */
export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const hydrated = useHydrated();

  const onLogin = pathname === LOGIN_PATH;
  const authed = session !== null;

  useEffect(() => {
    if (!hydrated) return;
    if (!authed && !onLogin) {
      router.replace(LOGIN_PATH);
    } else if (authed && onLogin) {
      router.replace("/");
    }
  }, [hydrated, authed, onLogin, router]);

  // Hold until the session is actually known. On the server and the first
  // client paint `hydrated` is false, so nothing renders and no redirect fires
  // — this is what keeps a refresh from bouncing a signed-in visitor to
  // `/login`.
  if (!hydrated) return null;

  // Login route: render the bare page. While an already-signed-in visitor is
  // being bounced home, render nothing so the form never flashes.
  if (onLogin) {
    return authed ? null : <>{children}</>;
  }

  // Protected routes: a signed-in visitor gets the shell; a guest is redirected
  // by the effect above and renders nothing meanwhile.
  if (!authed) return null;

  return <AppShell>{children}</AppShell>;
}
