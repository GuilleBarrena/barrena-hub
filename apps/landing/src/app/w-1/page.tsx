import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import heroImage from "@/assets/vitis-hero.jpg";

import { Button } from "@barrena/ui/button";
import { SectionEyebrow } from "@barrena/ui/section-eyebrow";
import { Wordmark } from "@barrena/ui/wordmark";
import { FeatureCard } from "@barrena/ui/feature-card";
import { CtaBand } from "@barrena/ui/cta-band";
import { LandingHeader } from "@/components/landing-header";

export const metadata: Metadata = {
  title: {
    absolute: "W-1 — El kit de guiado autónomo para el viñedo · Barrena Robotics",
  },
  description:
    "El W-1 es el kit de retrofit de Barrena Robotics: convierte cualquier tractor de viña en una máquina autónoma con guiado por visión, con 2,5 cm de precisión y sin depender de GPS RTK.",
  openGraph: {
    title: "W-1 — El kit de guiado autónomo para el viñedo",
    description:
      "Un kit que convierte el tractor que ya tienes en una máquina autónoma de viñedo: percepción, conducción autónoma y conectividad, de fábrica.",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: heroImage.src,
        width: heroImage.width,
        height: heroImage.height,
        alt: "Tractor de viña con el kit W-1 escaneando las hileras del viñedo de noche",
      },
    ],
  },
};

const STATS = [
  { value: "2,5 cm", label: "Precisión hilera a hilera" },
  { value: "4 h", label: "Instalación en su tractor" },
  { value: '10"', label: "Pantalla táctil en cabina" },
  { value: "24 meses", label: "Garantía de hardware" },
];

const CAPABILITIES = [
  {
    index: "01",
    title: "Percepción",
    lead: "Ve el viñedo, no solo el cielo.",
    bullets: [
      "Guiado por visión que sigue la hilera que realmente ve —seto, postes y alambres— donde el GPS deriva bajo la vegetación.",
      "Detección de obstáculos con parada segura ante personas, animales o cajones.",
      "Compensación de pendiente por IMU en cuestas de hasta el 30 %.",
      "Geo-cerca por parcela: la máquina nunca sale del viñedo.",
    ],
  },
  {
    index: "02",
    title: "Conducción autónoma",
    lead: "Planifica la parcela entera, no solo la siguiente calle.",
    bullets: [
      "Cobertura completa: todas las calles, sin franjas sin cubrir ni pasadas dobles.",
      "Giros de cabecera automáticos al final de la parcela.",
      "Optimización de la dirección y el orden de las pasadas para minimizar giros y tiempo.",
      "Parcelas irregulares y zonas de exclusión: se descompone en sub-parcelas sola.",
    ],
  },
  {
    index: "03",
    title: "Conectividad",
    lead: "Se lleva bien con sus aperos y herramientas.",
    bullets: [
      "ISOBUS: controle pulverizadores, desbrozadoras y abonadoras desde la cabina (VT + TC).",
      "RTK 2,5 cm con réplica local o NTRIP; modo decimétrico de reserva si cae la red.",
      "FMS y GIS: sincronice parcelas y tareas; importe/exporte Shapefile y GeoJSON.",
      "Todo se refleja en el Hub, la consola web de toda la explotación.",
    ],
  },
];

const KIT = [
  {
    tag: "Base",
    title: "Domo de percepción por visión",
    description:
      "Sensórica de estado sólido afinada para la geometría del viñedo: lee seto, postes y alambres con polvo, poca luz o lluvia. Es lo que permite al W-1 seguir la hilera, no una línea GPS pregrabada.",
  },
  {
    tag: "Base",
    title: "Antena RTK-GNSS",
    description:
      "Receptor multiconstelación de doble banda. 2,5 cm de precisión hilera a hilera con RTK; reserva decimétrica PPP/SBAS cuando cae la red.",
  },
  {
    tag: "Base",
    title: "Volante eléctrico",
    description:
      "Actuador de dirección atornillable. Se monta sobre la columna original sin tocar el circuito hidráulico; una tarde de instalación, totalmente reversible.",
  },
  {
    tag: "Base",
    title: 'Terminal de cabina 10"',
    description:
      "Pantalla táctil legible al sol. Planifique la parcela, active el guiado, vigile obstáculos y vea la percepción en vivo desde la cabina.",
  },
  {
    tag: "Accesorio",
    title: "Pedal Easy Switch",
    description:
      "Alterne entre manual y guiado autónomo con una pulsación. El operario siempre en el bucle.",
  },
  {
    tag: "Accesorio",
    title: "Cámara Wi-Fi de hilera",
    description:
      "Vídeo 1080p en vivo al terminal con visión nocturna infrarroja. Vea detrás del apero sin girarse.",
  },
  {
    tag: "Accesorio",
    title: "Módulo ISOBUS",
    description:
      "Opcional. Controle pulverizadores, desbrozadoras y abonadoras compatibles con ISOBUS desde el mismo terminal (VT + TC).",
  },
  {
    tag: "Accesorio",
    title: "Base RTK o NTRIP",
    description:
      "Base RTK de Barrena para la explotación, o conexión a su suscripción NTRIP existente. En cualquier caso, las correcciones están resueltas.",
  },
  {
    tag: "Software",
    title: "Hub de operaciones",
    description:
      "Consola web para toda la explotación: cada pasada, cada parcela, cada aviso. Exporta a su FMS vía GIS / Shapefile.",
  },
];

export default function W1() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <LandingHeader />

      {/* Hero */}
      <section id="producto" className="bg-background pt-14 pb-6 md:pt-20">
        <div className="mx-auto max-w-screen-xl px-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-5xl font-semibold tracking-tight text-foreground md:text-7xl">
              W-1
            </h1>
            <span className="inline-flex items-center rounded-md bg-brand-accent px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-foreground">
              Retrofit de viñedo
            </span>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Un kit de guiado que convierte el tractor que ya tiene en una máquina
            autónoma de viñedo. Se atornilla sobre su tractor y guía con 2,5 cm de
            precisión entre las cepas —donde los sistemas solo-GPS derivan y
            pierden la calle.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <a href="#contacto">Solicitar una demo</a>
            </Button>
            <Button asChild variant="secondary">
              <a href="#specs">Ver especificaciones</a>
            </Button>
          </div>
        </div>

        {/* Always-dark hero frame: the night lidar shot reads the same in light
            and dark themes, blended into a black panel that fades at the edges. */}
        <div className="mx-auto mt-10 max-w-6xl px-6">
          <div className="relative overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
            <Image
              src={heroImage}
              alt="Tractor de viña con el kit W-1 escaneando las hileras del viñedo de noche"
              sizes="(min-width: 1152px) 1104px, 100vw"
              placeholder="blur"
              preload
              className="w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-black" />
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />
          </div>
        </div>
      </section>

      {/* Spec strip */}
      <section id="specs" className="scroll-mt-14 bg-surface py-10">
        <div className="mx-auto grid max-w-screen-xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {stat.value}
              </span>
              <span className="mt-2 text-[13px] text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Product description */}
      <section className="bg-background py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <SectionEyebrow>El kit completo</SectionEyebrow>
          <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Retrofit, no reemplazo
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            El W-1 es un kit de retrofit completo —domo de percepción, antena
            RTK-GNSS, actuador de dirección, terminal de cabina y cableado—
            diseñado para tractores de viña de calle estrecha. Se monta sobre el
            tractor que ya tiene y entrega guiado autónomo con 2,5 cm de precisión
            entre las cepas.
          </p>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capacidades" className="scroll-mt-14 bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-screen-xl px-6">
          <SectionEyebrow index="01" className="mb-5">
            Capacidades
          </SectionEyebrow>
          <h2 className="max-w-2xl text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Todo lo que hace el W-1, de fábrica
          </h2>
          <p className="mt-4 max-w-[56ch] text-sm text-muted-foreground md:text-base">
            Tres capas trabajando juntas: cómo ve el tractor, cómo conduce y cómo
            habla con el resto de su flota.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {CAPABILITIES.map((cap) => (
              <FeatureCard
                key={cap.index}
                badge={
                  <SectionEyebrow index={cap.index} className="mb-4">
                    {cap.title}
                  </SectionEyebrow>
                }
                title={cap.lead}
                description={
                  <ul className="mt-1 flex flex-col gap-2.5">
                    {cap.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-primary" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* What's in the box */}
      <section id="kit" className="scroll-mt-14 bg-background py-16 md:py-24">
        <div className="mx-auto max-w-screen-xl px-6">
          <SectionEyebrow index="02" className="mb-5">
            El kit
          </SectionEyebrow>
          <h2 className="max-w-2xl text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Qué incluye la caja
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {KIT.map((item) => (
              <FeatureCard
                key={item.title}
                badge={
                  <span className="mb-3 inline-flex w-fit items-center rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground ring-1 ring-black/5">
                    {item.tag}
                  </span>
                }
                title={item.title}
                description={item.description}
              />
            ))}
          </div>

          {/* Indicative price */}
          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-center md:p-8">
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-accent">
                Precio indicativo
              </span>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                desde 7.900 €
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Kit completo · instalación incluida · 24 meses de garantía
              </div>
            </div>
            <Button asChild className="w-full md:w-auto">
              <a href="#contacto">Solicitar presupuesto</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Two audiences */}
      <section className="bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-screen-xl px-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col rounded-2xl bg-card p-6 shadow-sm ring-1 ring-black/5 md:p-8">
              <SectionEyebrow>Para viñedos</SectionEyebrow>
              <h3 className="mt-3 text-balance text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                Retrofit sobre el tractor que ya tiene
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Convierta su pulverizador o tractor interfilar en una máquina de
                guiado autónomo. Menos fatiga del operario, pasadas más rectas y
                registro de cada parcela.
              </p>
              <ul className="mt-5 flex flex-col gap-2 text-sm text-foreground">
                {[
                  "Instalación en un día por técnico certificado",
                  "Compatible con tractores estrechos de 30 a 100 CV",
                  "Precio cerrado por unidad, sin cuota por hectárea",
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2.5">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-primary" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button asChild>
                  <a href="#contacto">Solicitar presupuesto</a>
                </Button>
              </div>
            </div>

            <div id="oem" className="flex flex-col rounded-2xl bg-card p-6 shadow-sm ring-1 ring-black/5 md:p-8">
              <SectionEyebrow>Para fabricantes de tractores</SectionEyebrow>
              <h3 className="mt-3 text-balance text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                Autonomía de viñedo de fábrica, co-marca
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Trabajamos con fabricantes de tractores especiales para integrar el
                W-1 en línea como opción de fábrica. Su máquina, su garantía,
                nuestra autonomía —validada en parcelas reales.
              </p>
              <ul className="mt-5 flex flex-col gap-2 text-sm text-foreground">
                {[
                  "Integraciones de referencia para las principales plataformas estrechas",
                  "Instalación co-marca y formación de la red de concesionarios",
                  "Registros de validación en más de 40 parcelas de viñedo",
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2.5">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-primary" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button asChild variant="secondary">
                  <a href="#contacto">Hablar con alianzas</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contacto" className="scroll-mt-14 bg-background py-16">
        <div className="mx-auto max-w-screen-xl px-6">
          <CtaBand
            title="¿List@ para automatizar su viñedo?"
            description="Estamos incorporando un grupo reducido de viñedos y fabricantes de tractores especiales para la campaña 2027. Cuéntenos sobre su explotación y organizamos una demo del W-1."
          >
            <Button asChild variant="inverted" className="w-full px-6 md:w-auto">
              <a href="mailto:hola@barrenarobotics.com?subject=Quiero%20una%20demo%20del%20W-1">
                Solicitar una demo
              </a>
            </Button>
          </CtaBand>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-10">
        <div className="mx-auto max-w-screen-xl px-6">
          <div className="flex flex-col gap-4">
            <Wordmark product="W-1" variant="footer" />
            <p className="max-w-[60ch] text-[12px] text-muted-foreground">
              El W-1 es el kit de guiado autónomo de{" "}
              <Link
                href="/"
                className="font-medium text-foreground underline underline-offset-2 hover:text-brand-primary"
              >
                Barrena Robotics
              </Link>
              , la plataforma de robótica agrícola para el viñedo.
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
