"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth/session";

/**
 * Signs out and returns to the login screen. Clearing the session also flips
 * the auth guard (`AppFrame`), so the redirect is belt-and-braces.
 */
export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        logout();
        router.replace("/login");
      }}
      aria-label="Cerrar sesión"
      title="Cerrar sesión"
      className="flex size-9 items-center justify-center rounded-lg text-muted-foreground
                 outline-none transition-colors hover:bg-surface-2/60 hover:text-foreground
                 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 17l5-5-5-5 M20 12H9 M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
      </svg>
    </button>
  );
}
