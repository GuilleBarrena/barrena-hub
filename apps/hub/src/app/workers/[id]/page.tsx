import type { Metadata } from "next";
import Link from "next/link";
import { WorkerDetail } from "@/components/workers/worker-detail";

/**
 * The worker name lives in browser storage, so the server cannot know it at
 * render time - hence a generic title rather than generateMetadata.
 */
export const metadata: Metadata = {
  title: "Operario",
  description: "Ficha del operario.",
};

export default function WorkerDetailPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <Link
          href="/workers"
          className="text-[12px] text-muted-foreground underline-offset-4 hover:underline"
        >
          ← Operarios
        </Link>
      </header>

      <WorkerDetail />
    </div>
  );
}
