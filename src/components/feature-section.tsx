import Image, { type StaticImageData } from "next/image";

export function FeatureSection({
  id,
  index,
  eyebrow,
  title,
  description,
  bullets,
  image,
  imageAlt,
  reverse,
  tinted,
  tag,
}: {
  id?: string;
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  image: StaticImageData;
  imageAlt: string;
  reverse?: boolean;
  tinted?: boolean;
  tag?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-14 ${tinted ? "bg-surface py-16 md:py-24" : "bg-background py-16 md:py-24"}`}
    >
      <div className="mx-auto max-w-screen-xl px-6">
        <div
          className={`grid gap-10 md:gap-16 md:grid-cols-2 md:items-center ${
            reverse ? "md:[&>div:first-child]:order-2" : ""
          }`}
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[10px] font-mono font-semibold tracking-[0.2em] uppercase text-brand-accent">
                {index}
              </span>
              <span className="h-px w-8 bg-brand-accent/40" />
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                {eyebrow}
              </span>
            </div>
            <h3 className="text-balance text-2xl md:text-4xl font-semibold tracking-tight text-foreground">
              {title}
            </h3>
            {tag && (
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-primary ring-1 ring-brand-primary/20">
                <span className="size-1.5 rounded-full bg-brand-primary" />
                {tag}
              </span>
            )}
            <p className="mt-4 text-pretty text-sm md:text-base text-muted-foreground leading-relaxed max-w-[48ch]">
              {description}
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-black/5 shadow-sm">
              <Image
                src={image}
                alt={imageAlt}
                sizes="(min-width: 768px) 50vw, 100vw"
                placeholder="blur"
                className="h-full w-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
