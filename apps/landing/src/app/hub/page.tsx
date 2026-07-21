import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import satelliteMap from "@/assets/satellite-map.jpg";
import featureTracking from "@/assets/feature-tracking.jpg";

import { Button } from "@barrena/ui/button";
import { SectionEyebrow } from "@barrena/ui/section-eyebrow";
import { Wordmark } from "@barrena/ui/wordmark";
import { FeatureSection } from "@barrena/ui/feature-section";
import { FeatureCard } from "@barrena/ui/feature-card";
import { CtaBand } from "@barrena/ui/cta-band";
import { LandingHeader } from "@/components/landing-header";
import { HUB_URL } from "@/lib/site";
import { WaitlistDialog } from "@/components/waitlist-dialog";

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
      <LandingHeader />

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
            trabajan solos con el W-1, la IA decide dónde actuar y usted lo
            supervisa todo —cultivos, meteo y cuadrillas— desde una única
            interfaz técnica. Gratis para toda explotación.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <WaitlistDialog>
              <Button>Solicitar acceso anticipado</Button>
            </WaitlistDialog>
            <Button asChild variant="secondary">
              <Link href="/w-1">Conocer el W-1</Link>
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

      {/* Módulo 01 — protagonista: el W-1 */}
      <FeatureSection
        id="kit"
        index="01"
        eyebrow="El kit · W-1"
        title="Su tractor de viña trabaja solo con el W-1"
        description="El W-1, el kit de guiado por visión de Barrena, convierte cualquier tractor de viña en una máquina autónoma: conduce, corrige la línea y cubre la parcela sola. El Hub es donde usted la ve trabajar en tiempo real — solo interviene cuando la máquina lo pide."
        bullets={[
          "Guiado autónomo por visión, sin depender de GPS RTK",
          "Telemetría en vivo y replay de cada sesión de guiado",
          "Avisos solo cuando la máquina necesita una mano",
        ]}
        tag="Requiere el W-1"
        actions={
          <Button asChild variant="secondary">
            <Link href="/w-1">Ver el W-1</Link>
          </Button>
        }
        media={
          <div className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-black/5">
            <Image
              src={featureTracking}
              alt="Tractor de viña con kit de guiado autónomo trabajando sin conductor"
              sizes="(min-width: 768px) 50vw, 100vw"
              placeholder="blur"
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </div>
        }
      />

      {/* Inteligencia operativa sobre los datos de la flota */}
      <FeatureSection
        id="inteligencia"
        index="02"
        eyebrow="Inteligencia operativa"
        title="La IA decide dónde y cuándo actuar"
        description="El Hub analiza sin descanso cada pasada de sus máquinas y adelanta el trabajo: le dice cuándo tratar, dónde intervenir y qué parcelas priorizar. La operación avanza sola; a usted le quedan solo las decisiones que importan."
        tinted
        actions={
          <>
            <Button asChild>
              <a href={HUB_URL}>Ver acciones en el panel</a>
            </Button>
            <Button asChild variant="secondary">
              <a href={`${HUB_URL}/agent`}>Hablar con el agente</a>
            </Button>
          </>
        }
        media={
          // Vista previa de acciones, con el mismo lenguaje visual del panel
          <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-black/5 md:p-5">
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
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider ${a.labelClass}`}
                    >
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
        }
      />

      {/* También incluido, gratis — módulos secundarios */}
      <section id="incluido" className="bg-background py-16 md:py-24 scroll-mt-14">
        <div className="mx-auto max-w-screen-xl px-6">
          <SectionEyebrow>También incluido, gratis</SectionEyebrow>
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
              <FeatureCard
                key={card.index}
                badge={
                  <SectionEyebrow index={card.index} className="mb-4">
                    {card.eyebrow}
                  </SectionEyebrow>
                }
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contacto" className="scroll-mt-14 bg-surface py-16">
        <div className="mx-auto max-w-screen-xl px-6">
          <CtaBand
            title="Prepárese para la explotación autónoma"
            description="El Hub es gratuito. Regístrese en la lista de espera y sea de las primeras explotaciones en operar con máquinas Barrena cuando abramos el programa piloto."
          >
            <WaitlistDialog
              title="Unirme a la lista de espera"
              description="El Hub es gratuito. Capturamos su explotación para el programa piloto y le avisamos en cuanto abramos acceso."
            >
              <Button variant="inverted" className="w-full px-6 md:w-auto">
                Unirme a la lista de espera
              </Button>
            </WaitlistDialog>
          </CtaBand>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-10">
        <div className="mx-auto max-w-screen-xl px-6">
          <div className="flex flex-col gap-4">
            <Wordmark product="Hub" variant="footer" />
            <p className="text-[12px] text-muted-foreground">
              Un producto de{" "}
              <Link
                href="/"
                className="font-medium text-foreground underline underline-offset-2 hover:text-brand-primary"
              >
                Barrena Robotics
              </Link>
              .
            </p>
            <p className="text-[12px] text-muted-foreground">
              W-1 · IoT agrícola · Hub de operaciones
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
