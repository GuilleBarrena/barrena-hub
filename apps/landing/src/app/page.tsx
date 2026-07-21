import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import heroImage from "@/assets/vitis-hero.jpg";

import { Button } from "@barrena/ui/button";
import { SectionEyebrow } from "@barrena/ui/section-eyebrow";
import { Wordmark } from "@barrena/ui/wordmark";
import { FeatureSection } from "@barrena/ui/feature-section";
import { FeatureCard } from "@barrena/ui/feature-card";
import { CtaBand } from "@barrena/ui/cta-band";
import { SiteHeader } from "@barrena/ui/site-header";

// The Hub console lives in its own app. In production it sits on a subdomain;
// override with NEXT_PUBLIC_HUB_URL (e.g. http://localhost:3000 in dev).
const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL ?? "https://hub.barrenarobotics.com";

export const metadata: Metadata = {
  title: {
    absolute: "Barrena Robotics — Robótica agrícola autónoma para el viñedo",
  },
  description:
    "Automatizamos el viñedo de la cepa a la nube: el W-1, un kit que convierte su tractor en autónomo, y el Hub, la consola que supervisa toda la explotación.",
  openGraph: {
    title: "Barrena Robotics — Robótica agrícola autónoma para el viñedo",
    description:
      "El W-1 convierte su tractor de viña en una máquina autónoma; el Hub supervisa toda la explotación desde una sola pantalla.",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: heroImage.src,
        width: heroImage.width,
        height: heroImage.height,
        alt: "Tractor de viña autónomo escaneando las hileras del viñedo de noche",
      },
    ],
  },
};

const nav = [
  { href: "#que-hacemos", label: "Qué hacemos" },
  { href: "/w-1", label: "W-1" },
  { href: "/hub", label: "Hub" },
  { href: "#contacto", label: "Contacto" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      {/* Header */}
      <SiteHeader
        links={nav}
        actions={
          <>
            <Button asChild variant="ghost" className="px-2">
              <a href={HUB_URL}>Acceder al Hub</a>
            </Button>
            <Button asChild>
              <a href="#contacto">Solicitar demo</a>
            </Button>
          </>
        }
        menuPrimaryAction={{ href: "#contacto", label: "Solicitar demo" }}
      />

      {/* Hero */}
      <section id="top" className="bg-background pt-14 pb-6 md:pt-20">
        <div className="mx-auto grid max-w-screen-xl gap-10 px-6 md:grid-cols-2 md:items-center md:gap-16">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-accent">
              <span className="size-1.5 rounded-full bg-brand-accent" />
              Robótica agrícola autónoma
            </span>
            <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
              Automatizamos el viñedo, de la cepa a la nube
            </h1>
            <p className="mt-5 max-w-[52ch] text-pretty text-base text-muted-foreground md:text-lg">
              Barrena Robotics combina el <strong className="font-semibold text-foreground">W-1</strong>
              {" "}—un kit que convierte su tractor de viña en una máquina autónoma—
              con el <strong className="font-semibold text-foreground">Hub</strong>, la
              consola que supervisa toda la explotación desde una sola pantalla.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/w-1">Ver el W-1</Link>
              </Button>
              <Button asChild variant="secondary">
                <a href={HUB_URL}>Acceder al Hub</a>
              </Button>
            </div>
            <p className="mt-6 text-[13px] text-muted-foreground">
              Guiado por visión · Sin infraestructura RTK · Instalable en su
              tractor actual
            </p>
          </div>

          {/* Always-dark hero frame: the night lidar shot reads the same in
              light and dark themes, blended into a black panel. */}
          <div className="relative overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
            <Image
              src={heroImage}
              alt="Tractor de viña con el kit W-1 escaneando las hileras del viñedo de noche"
              sizes="(min-width: 1280px) 608px, 100vw"
              placeholder="blur"
              preload
              className="w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black" />
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15 backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-green-400" />
              </span>
              <span className="text-[11px] font-medium text-white">
                W-1 · Guiado autónomo en curso
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / metrics strip */}
      <section className="bg-surface py-8">
        <div className="mx-auto grid max-w-screen-xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
          {[
            { value: "2,5 cm", label: "Precisión de guiado" },
            { value: "0", label: "Antenas RTK necesarias" },
            { value: "1 día", label: "Instalación en su tractor" },
            { value: "24/7", label: "Supervisión desde el Hub" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {stat.value}
              </span>
              <span className="mt-1 text-[13px] text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Qué hacemos — overview intro */}
      <section id="que-hacemos" className="scroll-mt-14 bg-background pt-16 md:pt-24">
        <div className="mx-auto max-w-screen-xl px-6">
          <SectionEyebrow>Qué hacemos</SectionEyebrow>
          <h2 className="mt-3 max-w-2xl text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Dos piezas, una explotación autónoma
          </h2>
          <p className="mt-4 max-w-[56ch] text-sm text-muted-foreground md:text-base">
            El W-1 pone la autonomía en el campo; el Hub la convierte en
            decisiones. Juntos, su viñedo se trabaja y se supervisa solo.
          </p>
        </div>
      </section>

      {/* Producto 01 — W-1 */}
      <FeatureSection
        index="01"
        eyebrow="El kit · W-1"
        title="El W-1: su tractor de viña, autónomo"
        description="El W-1 es un kit de retrofit que convierte cualquier tractor de viña convencional en una máquina autónoma. Guiado por visión con 2,5 cm de precisión, montado en un día, sin desplegar antenas ni sustituir su flota."
        bullets={[
          "Guiado por visión, sin depender de GPS RTK ni corrección diferencial",
          "Planifica y cubre la parcela entera: giros de cabecera automáticos",
          "Parada segura ante obstáculos, personas o fin de parcela",
        ]}
        actions={
          <>
            <Button asChild>
              <Link href="/w-1">Ver el W-1</Link>
            </Button>
            <Button asChild variant="secondary">
              <a href="#contacto">Solicitar demo</a>
            </Button>
          </>
        }
        media={
          <div className="relative overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
            <Image
              src={heroImage}
              alt="Kit W-1 montado en un tractor de viña, guiando entre las hileras"
              sizes="(min-width: 768px) 50vw, 100vw"
              placeholder="blur"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-black" />
          </div>
        }
      />

      {/* Producto 02 — Hub */}
      <FeatureSection
        index="02"
        eyebrow="La consola · Hub"
        title="El Hub: toda la explotación en una pantalla"
        description="El Hub es el centro de operaciones: telemetría del W-1, evolución satelital del cultivo, meteo local y cuadrillas en una sola pantalla. Gratuito para toda explotación, tenga o no máquinas Barrena."
        reverse
        tinted
        actions={
          <>
            <Button asChild>
              <a href={HUB_URL}>Acceder al Hub</a>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/hub">Ver el Hub</Link>
            </Button>
          </>
        }
        media={
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
                  dot: "bg-brand-accent",
                  label: "Alta",
                  labelClass: "text-brand-accent",
                  title: "Reprogramar la pulverización de Parcela 11",
                  impact: "Evita deriva por viento",
                },
                {
                  dot: "bg-brand-primary",
                  label: "Media",
                  labelClass: "text-brand-primary",
                  title: "Completar el guiado de la Parcela 07",
                  impact: "Cierra la pasada pendiente",
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

      {/* Por qué Barrena */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-screen-xl px-6">
          <SectionEyebrow>Por qué Barrena</SectionEyebrow>
          <h2 className="mt-3 max-w-2xl text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Autonomía pensada para el viñedo real
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Sin infraestructura RTK",
                description:
                  "Nada de bases, antenas ni suscripciones de corrección. La máquina se guía por lo que ve, así que empieza a trabajar el primer día.",
              },
              {
                title: "Sobre su flota actual",
                description:
                  "El W-1 se monta en tractores de viña convencionales. No sustituye su inversión: la potencia.",
              },
              {
                title: "Menos manos, más cobertura",
                description:
                  "La máquina cubre la calle sola y le libera cuadrilla para las tareas que de verdad requieren criterio.",
              },
            ].map((card) => (
              <FeatureCard
                key={card.title}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA / contacto */}
      <section id="contacto" className="scroll-mt-14 bg-surface py-16">
        <div className="mx-auto max-w-screen-xl px-6">
          <CtaBand
            title="Prepárese para la explotación autónoma"
            description="Cuéntenos sobre su viñedo y organizamos una demo del W-1. Sea de las primeras explotaciones en operar con máquinas Barrena."
          >
            <Button asChild variant="inverted" className="w-full px-6 md:w-auto">
              <a href="mailto:hola@barrenarobotics.com?subject=Quiero%20una%20demo%20del%20W-1">
                Solicitar una demo
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="px-2 text-primary-foreground/80 hover:text-primary-foreground"
            >
              <a href={HUB_URL}>o acceder al Hub →</a>
            </Button>
          </CtaBand>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-10">
        <div className="mx-auto max-w-screen-xl px-6">
          <div className="flex flex-col gap-4">
            <Wordmark variant="footer" />
            <p className="max-w-[60ch] text-[12px] text-muted-foreground">
              Robótica agrícola autónoma: el W-1, kit de guiado por visión para
              tractores de viña, y el Hub, la consola de operaciones.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12px]">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <p className="text-[12px] text-muted-foreground">
              © 2026 Barrena Robotics. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
