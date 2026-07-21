"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/session";
import { AppShell } from "@/components/dashboard/app-shell";

const LOGIN_PATH = "/login";

/**
 * Client-side auth gate for the whole app.
 *
 * Everything except `/login` is private. Because the session lives in
 * localStorage (see `@/lib/auth/session`), the check has to run on the client:
 * the server render — and the first client paint — treat nobody as signed in,
 * so this renders nothing for a protected route until localStorage is read.
 * That keeps SSR and hydration in agreement and makes a full page reload
 * re-run the same guard, redirecting a signed-out visitor every time.
 *
 * - `/login` renders bare, with no dashboard chrome.
 * - Any other route renders inside `AppShell` only once a session exists;
 *   otherwise the visitor is bounced to `/login`.
 * - A visitor who is already signed in and lands on `/login` is sent home.
 */
export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();

  const onLogin = pathname === LOGIN_PATH;
  const authed = session !== null;

  useEffect(() => {
    if (!authed && !onLogin) {
      router.replace(LOGIN_PATH);
    } else if (authed && onLogin) {
      router.replace("/");
    }
  }, [authed, onLogin, router]);

  // Login route: render the bare page. While an already-signed-in visitor is
  // being bounced home, render nothing so the form never flashes.
  if (onLogin) {
    return authed ? null : <>{children}</>;
  }

  // Protected routes hold until a session is known. On the server and the first
  // client paint `session` is null, so this returns null; once localStorage is
  // read, a signed-in visitor gets the shell and a guest is redirected above.
  if (!authed) return null;

  return <AppShell>{children}</AppShell>;
}
