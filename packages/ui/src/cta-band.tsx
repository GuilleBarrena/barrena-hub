import type { ReactNode } from "react";

/**
 * The Barrena call-to-action band: a brand-primary panel with a heading, a
 * lead paragraph, and a row of actions. The actions differ per app (a waitlist
 * dialog, a mailto, a link to the Hub…), so they come in as `children`.
 *
 *   <CtaBand title="…" description="…">
 *     <Button variant="inverted">…</Button>
 *   </CtaBand>
 */
export function CtaBand({
  title,
  description,
  children,
  className = "",
}: {
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-brand-primary p-8 ring-1 ring-black/5 md:p-12 ${className}`}
    >
      <h2 className="max-w-2xl text-balance text-2xl font-medium text-primary-foreground md:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-[56ch] text-pretty text-sm text-primary-foreground/70 md:text-base">
        {description}
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
