import type { ReactNode } from "react";

/**
 * A card tile in the Barrena marketing grids: an optional `badge` slot (a
 * numbered <SectionEyebrow>, a letter chip, an icon…), then a title and a
 * description. The badge carries its own bottom margin so callers control the
 * gap; a card with no badge sits flush.
 *
 *   <FeatureCard
 *     badge={<SectionEyebrow index="03" className="mb-4">Salud del cultivo</SectionEyebrow>}
 *     title="Evolución satelital"
 *     description="…"
 *   />
 */
export function FeatureCard({
  badge,
  title,
  description,
  className = "",
}: {
  badge?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl bg-card p-5 shadow-sm ring-1 ring-black/5 ${className}`}
    >
      {badge}
      <h3 className="text-balance text-base font-semibold tracking-tight text-foreground md:text-lg">
        {title}
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
