import type { ReactNode } from "react";
import { SectionEyebrow } from "./section-eyebrow";

/**
 * Two-column marketing feature block: a text column (numbered eyebrow, title,
 * optional tag, description, optional bullet list, optional actions) beside a
 * `media` slot. The media is a free-form node — an <Image>, an SVG visual, a
 * preview panel — so each app frames its own visual.
 *
 * `reverse` puts the media on the left (desktop); `tinted` uses the surface
 * background instead of the page background.
 */
export function FeatureSection({
  id,
  index,
  eyebrow,
  title,
  description,
  media,
  bullets,
  actions,
  tag,
  reverse = false,
  tinted = false,
}: {
  id?: string;
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  media: ReactNode;
  bullets?: string[];
  actions?: ReactNode;
  tag?: string;
  reverse?: boolean;
  tinted?: boolean;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-14 py-16 md:py-24 ${tinted ? "bg-surface" : "bg-background"}`}
    >
      <div className="mx-auto max-w-screen-xl px-6">
        <div
          className={`grid gap-10 md:grid-cols-2 md:items-center md:gap-16 ${
            reverse ? "md:[&>div:first-child]:order-2" : ""
          }`}
        >
          <div>
            <SectionEyebrow index={index} className="mb-5">
              {eyebrow}
            </SectionEyebrow>
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground md:text-4xl">
              {title}
            </h2>
            {tag && (
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-primary ring-1 ring-brand-primary/20">
                <span className="size-1.5 rounded-full bg-brand-primary" />
                {tag}
              </span>
            )}
            <p className="mt-4 max-w-[48ch] text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              {description}
            </p>
            {bullets && bullets.length > 0 && (
              <ul className="mt-6 flex flex-col gap-3">
                {bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-sm text-foreground"
                  >
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {actions && (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {actions}
              </div>
            )}
          </div>
          <div>{media}</div>
        </div>
      </div>
    </section>
  );
}
