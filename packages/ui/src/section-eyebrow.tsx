import type { ReactNode } from "react";

/**
 * The Barrena section label. Two shapes:
 *
 *   <SectionEyebrow index="01">Kit de guiado</SectionEyebrow>
 *     → 01 ── KIT DE GUIADO   (numbered, with the accent rule)
 *
 *   <SectionEyebrow>También incluido</SectionEyebrow>
 *     → TAMBIÉN INCLUIDO      (bare accent label, no number/rule)
 *
 * Pass margin utilities via `className` (e.g. "mb-5", "mt-3").
 */
export function SectionEyebrow({
  index,
  children,
  className = "",
}: {
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  if (!index) {
    return (
      <span
        className={`text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-accent ${className}`}
      >
        {children}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-accent">
        {index}
      </span>
      <span className="h-px w-8 bg-brand-accent/40" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {children}
      </span>
    </div>
  );
}
