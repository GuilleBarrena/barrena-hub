import type { Metadata } from "next";
import Image from "next/image";

import satelliteMap from "@/assets/satellite-map.jpg";
import featureTracking from "@/assets/feature-tracking.jpg";

import { Button } from "@/components/ui/button";
import { FeatureSection } from "@/components/feature-section";
import { WaitlistDialog } from "@/components/waitlist-dialog";
import { MobileMenu } from "@/components/mobile-menu";

const ROOT_SITE = "https://barrenarobotics.com";

export const metadata: Metadata = {
  // `absolute` opts out of the title template in the root layout.
  title: {
    absolute:
      "Hub · Barrena Robotics — La consola de la agricultura autónoma",
  },
  description:
    "Hub es el centro de operaciones de Barrena Robotics. Supervise sus máquinas autónomas, monitorice sus cultivos y coordine sus cuadrillas desde una única interfaz técnica. Gratis para toda explotación.",
  openGraph: {
    title: "Hub · Barrena Robotics — La consola de la agricultura autónoma",
    description:
      "El centro de operaciones para su flota autónoma: telemetría del kit de guiado, evolución satelital, meteo y cuadrillas en una sola pantalla.",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: satelliteMap.src,
        width: satelliteMap.width,
        height: satelliteMap.height,
        alt: "Vista satelital de parcelas agrícolas con trazas de guiado autónomo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [satelliteMap.src],
  },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-6">
          <div className="flex items-baseline gap-2">
            <div className="size-6 self-center bg-brand-primary rounded-[4px]" />
            <span className="text-sm font-semibold tracking-tight uppercase">
              Hub
            </span>
            <span className="text-[11px] text-muted-foreground">·</span>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Barrena Robotics
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Desktop: inline links. Wrapped in a plain div so `hidden`
                controls display without fighting the Button's base
                `inline-flex` utility. */}
            <div className="hidden items-center gap-3 sm:flex">
              <Button asChild variant="ghost" className="px-2">
                <a href={ROOT_SITE}>← barrenarobotics.com</a>
              </Button>
              <Button asChild variant="ghost">
                <a href="/dashboard">Acceder</a>
              </Button>
            </div>
            {/* Mobile: slide-in menu */}
            <MobileMenu rootSite={ROOT_SITE} />
          </div>
        </div>
        <div className="h-px w-full bg-foreground/5" />
      </nav>

      {/* Hero */}
      <section className="bg-background py-12">
        <div className="mx-auto max-w-screen-xl px-6">
          <span className="mb-4 inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-accent">
            <span className="size-1.5 rounded-full bg-brand-accent" />
            La consola de la agricultura autónoma
          </span>
          <h1 className="text-balance text-3xl md:text-5xl font-semibold leading-tight tracking-tight text-foreground max-w-3xl">
            Opere su explotación agrícola desde una sola pantalla
          </h1>
          <p className="mt-4 max-w-[52ch] text-pretty text-base md:text-lg text-muted-foreground">
            Hub es el centro de operaciones de Barrena Robotics. Sus tractores
            trabajan solos con el kit de guiado autónomo, la IA decide dónde
            actuar y usted lo supervisa todo —cultivos, meteo y cuadrillas— desde
            una única interfaz técnica. Gratis para toda explotación.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <WaitlistDialog>
              <Button>Solicitar acceso anticipado</Button>
            </WaitlistDialog>
            <Button asChild variant="secondary">
              <a href={ROOT_SITE}>Conocer el kit autónomo</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Product Visual */}
      <section className="bg-surface py-6">
        <div className="mx-auto max-w-screen-xl px-6">
          <div className="relative overflow-hidden rounded-2xl bg-card ring-1 ring-black/5">
            <div className="p-3">
              <div className="relative aspect-[3/4] md:aspect-[16/10] w-full overflow-hidden rounded-xl outline-1 -outline-offset-1 outline-black/5">
                <Image
                  src={satelliteMap}
                  alt="Vista satelital de parcelas agrícolas con trazas de guiado autónomo"
                  fill
                  // `preload` replaces the deprecated `priority` prop in Next.js 16.
                  preload
                  sizes="(min-width: 1280px) 1216px, 100vw"
                  placeholder="blur"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Overlay: vehicle status */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 backdrop-blur ring-1 ring-black/5">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                </span>
                <span className="text-[11px] font-medium text-foreground">
                  Tractor Barrena · Guiado autónomo en curso
                </span>
              </div>
              <div className="rounded-full bg-background/90 px-3 py-1.5 backdrop-blur ring-1 ring-black/5">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Finca La Esperanza · Parcela 04
                </span>
              </div>
              <div className="max-w-[15rem] rounded-lg bg-background/95 px-3 py-2 backdrop-blur ring-1 ring-black/5">
                <span className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-brand-primary">
                  <span className="size-1.5 rounded-full bg-brand-primary" />
                  Acción recomendada por IA
                </span>
                <span className="mt-1 block text-[11px] font-medium leading-snug text-foreground">
                  Riego antihelada esta madrugada · viñedo sensible
                </span>
              </div>
            </div>

            {/* Overlay: sensor readouts */}
            <div className="absolute bottom-8 right-6">
              <div className="rounded-lg bg-background/95 p-4 shadow-sm backdrop-blur ring-1 ring-black/5">
                <div className="flex flex-col gap-3 min-w-[140px]">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Humedad suelo
                    </span>
                    <span className="text-lg font-semibold text-foreground">
                      22.4%
                    </span>
                  </div>
                  <div className="h-px bg-foreground/5" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Viento
                    </span>
                    <span className="text-lg font-semibold text-foreground">
                      14 km/h NO
                    </span>
                  </div>
                  <div className="h-px bg-foreground/5" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Cobertura
                    </span>
                    <span className="text-lg font-semibold text-foreground">
                      68%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Módulo 01 — protagonista: el kit de guiado autónomo */}
      <FeatureSection
        id="kit"
        index="01"
        eyebrow="Kit de guiado autónomo"
        title="Su tractor de viña trabaja solo, sin GPS RTK"
        description="El kit de guiado por visión de Barrena convierte cualquier tractor de viña en una máquina autónoma: conduce, corrige la línea y cubre la parcela sola. El Hub es donde usted la ve trabajar en tiempo real — solo interviene cuando la máquina lo pide."
        bullets={[
          "Guiado autónomo por visión, sin depender de GPS RTK",
          "Telemetría en vivo y replay de cada sesión de guiado",
          "Avisos solo cuando la máquina necesita una mano",
        ]}
        image={featureTracking}
        imageAlt="Tractor de viña con kit de guiado autónomo trabajando sin conductor"
        tag="Requiere kit Barrena"
      />

      {/* Inteligencia operativa sobre los datos de la flota */}
      <section id="inteligencia" className="bg-surface py-16 md:py-24 scroll-mt-14">
        <div className="mx-auto max-w-screen-xl px-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[10px] font-mono font-semibold tracking-[0.2em] uppercase text-brand-accent">
              02
            </span>
            <span className="h-px w-8 bg-brand-accent/40" />
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              Inteligencia operativa
            </span>
          </div>

          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
            <div>
              <h3 className="text-balance text-2xl md:text-4xl font-semibold tracking-tight text-foreground">
                La IA decide dónde y cuándo actuar
              </h3>
              <p className="mt-4 max-w-[48ch] text-pretty text-sm md:text-base text-muted-foreground leading-relaxed">
                El Hub analiza sin descanso cada pasada de sus máquinas y adelanta
                el trabajo: le dice cuándo tratar, dónde intervenir y qué parcelas
                priorizar. La operación avanza sola; a usted le quedan solo las
                decisiones que importan.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild>
                  <a href="/dashboard">Ver acciones en el panel</a>
                </Button>
                <Button asChild variant="secondary">
                  <a href="/dashboard/agent">Hablar con el agente</a>
                </Button>
              </div>
            </div>

            {/* Vista previa de acciones, con el mismo lenguaje visual del panel */}
            <div className="rounded-2xl bg-card p-4 ring-1 ring-black/5 shadow-sm md:p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold tracking-tight text-foreground">
                  Acciones de hoy
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Datos de su flota
                </span>
              </div>
              <ul className="mt-3 flex flex-col gap-2.5">
                {[
                  {
                    dot: "bg-red-600",
                    label: "Crítica",
                    labelClass: "text-red-700",
                    title: "Proteger Parcela 04 ante la helada del sábado",
                    impact: "Evita daño en el viñedo",
                  },
                  {
                    dot: "bg-red-600",
                    label: "Crítica",
                    labelClass: "text-red-700",
                    title: "Revisar intervención pendiente del tractor Barrena",
                    impact: "Restablece el guiado autónomo",
                  },
                  {
                    dot: "bg-brand-accent",
                    label: "Alta",
                    labelClass: "text-brand-accent",
                    title: "Reprogramar la pulverización de Parcela 11",
                    impact: "Evita deriva por viento",
                  },
                ].map((a) => (
                  <li
                    key={a.title}
                    className="rounded-xl bg-surface-2/60 px-3 py-2.5 ring-1 ring-black/5"
                  >
                    <span className="flex items-center gap-2">
                      <span className={`size-2 shrink-0 rounded-full ${a.dot}`} />
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${a.labelClass}`}>
                        {a.label}
                      </span>
                    </span>
                    <span className="mt-1 block text-[13px] font-medium leading-snug text-foreground">
                      {a.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">
                      ◆ {a.impact}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* También incluido, gratis — módulos secundarios */}
      <section id="incluido" className="bg-background py-16 md:py-24 scroll-mt-14">
        <div className="mx-auto max-w-screen-xl px-6">
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-accent">
            También incluido, gratis
          </span>
          <h2 className="mt-3 text-balance text-2xl md:text-3xl font-semibold tracking-tight text-foreground max-w-2xl">
            Toda la explotación, tenga o no máquinas Barrena
          </h2>
          <p className="mt-4 max-w-[56ch] text-sm md:text-base text-muted-foreground">
            El Hub es gratuito para cualquier explotación. Estas capacidades
            funcionan sin hardware Barrena, desde el primer día.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                index: "03",
                eyebrow: "Salud del cultivo",
                title: "Evolución satelital de la finca",
                description:
                  "Índices de vegetación (NDVI) por parcela para detectar anomalías de vigor antes de que sean visibles.",
              },
              {
                index: "04",
                eyebrow: "Meteorología local",
                title: "Predicción del tiempo con alertas",
                description:
                  "Predicción ultra-local por finca con avisos de helada, viento y lluvia antes de programar tareas sensibles.",
              },
              {
                index: "05",
                eyebrow: "Cuadrillas y tareas",
                title: "Control de operarios y tareas",
                description:
                  "Asigne partes de trabajo, supervise el progreso de las cuadrillas y reciba confirmación desde el campo.",
              },
            ].map((card) => (
              <div
                key={card.index}
                className="flex flex-col rounded-2xl bg-card p-5 ring-1 ring-black/5 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-mono font-semibold tracking-[0.2em] uppercase text-brand-accent">
                    {card.index}
                  </span>
                  <span className="h-px w-6 bg-brand-accent/40" />
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                    {card.eyebrow}
                  </span>
                </div>
                <h3 className="text-balance text-base md:text-lg font-semibold tracking-tight text-foreground">
                  {card.title}
                </h3>
                <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-screen-xl px-6">
          <div className="rounded-2xl bg-brand-primary p-8 md:p-12 ring-1 ring-black/5">
            <h2 className="text-balance text-2xl md:text-3xl font-medium text-primary-foreground max-w-2xl">
              Prepárese para la explotación autónoma
            </h2>
            <p className="mt-4 text-pretty text-sm md:text-base text-primary-foreground/70 max-w-[56ch]">
              El Hub es gratuito. Regístrese en la lista de espera y sea de las
              primeras explotaciones en operar con máquinas Barrena cuando abramos
              el programa piloto.
            </p>
            <WaitlistDialog
              title="Unirme a la lista de espera"
              description="El Hub es gratuito. Capturamos su explotación para el programa piloto y le avisamos en cuanto abramos acceso."
            >
              <Button
                variant="inverted"
                className="mt-8 w-full md:w-auto px-6"
              >
                Unirme a la lista de espera
              </Button>
            </WaitlistDialog>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-10">
        <div className="mx-auto max-w-screen-xl px-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="size-5 bg-brand-primary/20 rounded-[4px]" />
              <span className="text-xs font-semibold tracking-tight text-muted-foreground">
                <span className="uppercase">Hub</span>{" "}
                <span className="font-normal">· Barrena Robotics</span>
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground">
              Un producto de{" "}
              <a
                href={ROOT_SITE}
                className="font-medium text-foreground underline underline-offset-2 hover:text-brand-primary"
              >
                Barrena Robotics
              </a>
              .
            </p>
            <p className="text-[12px] text-muted-foreground">
              Kit de guiado autónomo · IoT agrícola · Hub de operaciones
            </p>
            <p className="text-[12px] text-muted-foreground">
              © 2026 Barrena Robotics. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
