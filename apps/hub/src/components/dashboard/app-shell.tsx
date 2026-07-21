import { Sidebar } from "@/components/dashboard/sidebar";
import { HubHeader } from "@/components/dashboard/hub-header";

/**
 * The signed-in app shell: the sidebar is a real column from `md` up and a
 * horizontal strip below it, over a fixed header and the scrolling page.
 *
 * This used to live directly in the root layout. It now sits behind the auth
 * guard (`AppFrame`), which only mounts it once a session is known — the login
 * screen renders without any of this chrome.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface font-sans text-foreground antialiased md:flex">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HubHeader />
        <main className="min-w-0 flex-1 px-5 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
