import type { Metadata } from "next";

import { Button } from "@barrena/ui/button";
import { SectionEyebrow } from "@barrena/ui/section-eyebrow";
import { Wordmark } from "@barrena/ui/wordmark";
import { FeatureSection } from "@barrena/ui/feature-section";
import { FeatureCard } from "@barrena/ui/feature-card";
import { CtaBand } from "@barrena/ui/cta-band";
import { VineyardVisual } from "@/components/vineyard-visual";

// The Hub console lives in its own app. In production it sits on a subdomain;
// override with NEXT_PUBLIC_HUB_URL (e.g. http://localhost:3000 in dev).
const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL ?? "https://hub.barrenarobotics.com";

export const metadata: Metadata = {
  title: {
    absolute: "Barrena Robotics — Robótica agrícola autónoma para el viñedo",
  },
  description:
    "Convertimos cualquier tractor de viña en una máquina autónoma con guiado por visión, sin GPS RTK. Kit de guiado, sensórica agrícola y el Hub de operaciones.",
  openGraph: {
    title: "Barrena Robotics — Robótica agrícola autónoma para el viñedo",
    description:
      "Guiado autónomo por visión para tractores de viña, sensórica en campo e inteligencia operativa en una sola plataforma.",
    type: "website",
    locale: "es_ES",
  },
};

const nav = [
  { href: "#kit", label: "El kit" },
  { href: "#tecnologia", label: "Tecnología" },
  { href: "#hub", label: "El Hub" },
  { href: "#contacto", label: "Contacto" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-6">
          <a href="#top">
            <Wordmark />
          </a>
          <div className="hidden items-center gap-6 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="hidden px-2 sm:inline-flex">
              <a href={HUB_URL}>Acceder al Hub</a>
            </Button>
            <Button asChild>
              <a href="#contacto">Solicitar demo</a>
            </Button>
          </div>
        </div>
        <div className="h-px w-full bg-foreground/5" />
      </nav>

      {/* Hero */}
      <section id="top" className="bg-background pt-14 pb-6 md:pt-20">
        <div className="mx-auto grid max-w-screen-xl gap-10 px-6 md:grid-cols-2 md:items-center md:gap-16">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-accent">
              <span className="size-1.5 rounded-full bg-brand-accent" />
              Robótica agrícola autónoma
            </span>
            <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
              Su tractor de viña trabaja solo, sin GPS RTK
            </h1>
            <p className="mt-5 max-w-[52ch] text-pretty text-base text-muted-foreground md:text-lg">
              Barrena Robotics convierte cualquier tractor de viña en una máquina
              autónoma. El kit de guiado por visión conduce, corrige la línea y
              cubre la parcela sola —y todo lo supervisa desde el Hub, nuestra
              consola de operaciones.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild>
                <a href="#contacto">Solicitar una demo</a>
              </Button>
              <Button asChild variant="secondary">
                <a href="#tecnologia">Ver cómo funciona</a>
              </Button>
            </div>
            <p className="mt-6 text-[13px] text-muted-foreground">
              Guiado por visión · Sin infraestructura RTK · Instalable en su
              tractor actual
            </p>
          </div>

          {/* Vineyard visual with live-status overlay chips */}
          <div className="relative overflow-hidden rounded-2xl bg-card p-3 shadow-sm ring-1 ring-black/5">
            <div className="relative overflow-hidden rounded-xl outline-1 -outline-offset-1 outline-black/5">
              <VineyardVisual />
            </div>
            <div className="absolute left-6 top-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 ring-1 ring-black/5 backdrop-blur">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                </span>
                <span className="text-[11px] font-medium text-foreground">
                  Guiado autónomo en curso
                </span>
              </div>
              <div className="rounded-full bg-background/90 px-3 py-1.5 ring-1 ring-black/5 backdrop-blur">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Finca La Esperanza · Parcela 04
                </span>
              </div>
            </div>
            <div className="absolute bottom-6 right-6 rounded-lg bg-background/95 p-3 shadow-sm ring-1 ring-black/5 backdrop-blur">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Desviación de línea
              </span>
              <span className="block text-lg font-semibold text-foreground">
                ± 2.1 cm
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / metrics strip */}
      <section className="bg-surface py-8">
        <div className="mx-auto grid max-w-screen-xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
          {[
            { value: "± 2 cm", label: "Precisión de guiado" },
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

      {/* 01 — El kit de guiado autónomo */}
      <FeatureSection
        id="kit"
        index="01"
        eyebrow="Kit de guiado autónomo"
        title="Autonomía real para el viñedo, sobre su tractor actual"
        description="El kit de Barrena se instala en tractores de viña convencionales y los convierte en máquinas autónomas. Nada de reemplazar su flota ni de desplegar antenas: guiado por visión, montado en un día, listo para trabajar la calle."
        bullets={[
          "Guiado por visión, sin depender de GPS RTK ni corrección diferencial",
          "Sigue la línea de la calle y corrige la trayectoria en tiempo real",
          "Parada segura ante obstáculos, personas o fin de parcela",
          "Compatible con tractores de viña estrechos ya en uso",
        ]}
        media={
          <div className="rounded-2xl bg-card p-3 shadow-sm ring-1 ring-black/5">
            <div className="overflow-hidden rounded-xl outline-1 -outline-offset-1 outline-black/5">
              <VineyardVisual />
            </div>
          </div>
        }
      />

      {/* 02 — Tecnología / cómo funciona */}
      <section id="tecnologia" className="scroll-mt-14 bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-screen-xl px-6">
          <SectionEyebrow index="02" className="mb-5">
            Cómo funciona
          </SectionEyebrow>
          <h2 className="max-w-2xl text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Visión artificial en el campo, inteligencia en el Hub
          </h2>
          <p className="mt-4 max-w-[56ch] text-sm text-muted-foreground md:text-base">
            Tres capas trabajando juntas: la máquina ve y conduce, la nube
            razona sobre lo que ocurre y usted decide desde una sola pantalla.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                index: "A",
                title: "Percepción a bordo",
                description:
                  "Cámaras y cómputo en el tractor detectan la línea de la calle, obstáculos y el fin de parcela, y gobiernan la dirección varias veces por segundo.",
              },
              {
                index: "B",
                title: "Inteligencia en la nube",
                description:
                  "Cada pasada se sincroniza con el Hub, que cruza telemetría, sensórica y meteo para anticipar dónde y cuándo conviene actuar.",
              },
              {
                index: "C",
                title: "Supervisión y control",
                description:
                  "Usted ve la flota trabajar en vivo, recibe avisos solo cuando la máquina necesita una mano y aprueba las acciones que importan.",
              },
            ].map((step) => (
              <FeatureCard
                key={step.index}
                badge={
                  <span className="mb-4 flex size-8 items-center justify-center rounded-lg bg-brand-primary/10 font-mono text-sm font-semibold text-brand-primary ring-1 ring-brand-primary/20">
                    {step.index}
                  </span>
                }
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 03 — El Hub */}
      <FeatureSection
        id="hub"
        index="03"
        eyebrow="El Hub"
        title="Toda la explotación desde una sola consola"
        description="El Hub es el centro de operaciones de Barrena Robotics: telemetría de la flota, evolución satelital del cultivo, meteo local y cuadrillas en una sola pantalla. Gratuito para toda explotación, tenga o no máquinas Barrena."
        reverse
        actions={
          <>
            <Button asChild>
              <a href={HUB_URL}>Acceder al Hub</a>
            </Button>
            <Button asChild variant="secondary">
              <a href="#contacto">Solicitar acceso</a>
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
      <section className="bg-surface py-16 md:py-24">
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
                  "El kit se monta en tractores de viña convencionales. No sustituye su inversión: la potencia.",
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
      <section id="contacto" className="scroll-mt-14 bg-background py-16">
        <div className="mx-auto max-w-screen-xl px-6">
          <CtaBand
            title="Prepárese para la explotación autónoma"
            description="Cuéntenos sobre su viñedo y organizamos una demo del kit de guiado autónomo. Sea de las primeras explotaciones en operar con máquinas Barrena."
          >
            <Button asChild variant="inverted" className="w-full px-6 md:w-auto">
              <a href="mailto:hola@barrenarobotics.com?subject=Quiero%20una%20demo%20del%20kit%20autónomo">
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
              Robótica agrícola autónoma: kit de guiado por visión para tractores
              de viña, sensórica IoT en campo y el Hub de operaciones.
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
              <a
                href={HUB_URL}
                className="font-medium text-foreground underline underline-offset-2 hover:text-brand-primary"
              >
                Hub
              </a>
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
