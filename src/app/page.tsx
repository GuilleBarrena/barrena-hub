import type { Metadata } from "next";
import Image from "next/image";

import satelliteMap from "@/assets/satellite-map.jpg";
import featureTracking from "@/assets/feature-tracking.jpg";
import featureSatellite from "@/assets/feature-satellite.jpg";
import featureWeather from "@/assets/feature-weather.jpg";
import featureWorkers from "@/assets/feature-workers.jpg";

import { Button } from "@/components/ui/button";
import { FeatureSection } from "@/components/feature-section";
import { RequestDemoDialog } from "@/components/request-demo-dialog";

export const metadata: Metadata = {
  // `absolute` opts out of the title template in the root layout.
  title: {
    absolute:
      "Hub by barrenarobotics — Control operativo total para su explotación agrícola",
  },
  description:
    "Plataforma agro para trazabilidad de vehículos por finca, evolución satelital, alertas meteorológicas y gestión de operarios.",
  openGraph: {
    title: "Hub by barrenarobotics — Control operativo agrícola",
    description:
      "Trazabilidad de flota, evolución satelital, alertas meteorológicas y gestión de cuadrillas en una única interfaz técnica.",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: satelliteMap.src,
        width: satelliteMap.width,
        height: satelliteMap.height,
        alt: "Vista satelital de parcelas agrícolas con trazas GPS",
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
            {/* Company name is lowercase by design - do not apply `uppercase`. */}
            <span className="hidden sm:inline text-[11px] lowercase text-muted-foreground">
              by barrenarobotics
            </span>
          </div>
          <Button variant="ghost">Acceder</Button>
        </div>
        <div className="h-px w-full bg-foreground/5" />
      </nav>

      {/* Hero */}
      <section className="bg-background py-12">
        <div className="mx-auto max-w-screen-xl px-6">
          <span className="mb-4 inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-accent">
            <span className="size-1.5 rounded-full bg-brand-accent" />
            Tecnología de precisión · IA
          </span>
          <h1 className="text-balance text-3xl md:text-5xl font-semibold leading-tight tracking-tight text-foreground max-w-3xl">
            Sus datos del campo, convertidos en decisiones
          </h1>
          <p className="mt-4 max-w-[52ch] text-pretty text-base md:text-lg text-muted-foreground">
            Hub vigila vehículos, cultivos, meteo y cuadrillas en una única
            interfaz técnica — y una capa de IA lo cruza todo para decirle qué
            hacer primero. Deje de mirar paneles: conozca la siguiente acción.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <RequestDemoDialog>
              <Button>Solicitar Demo</Button>
            </RequestDemoDialog>
            <Button asChild variant="secondary">
              <a href="/dashboard">Ver el panel</a>
            </Button>
            <Button asChild variant="ghost" className="px-2">
              <a href="#inteligencia">Saber más</a>
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
                  alt="Vista satelital de parcelas agrícolas con trazas GPS"
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
                  Tractor John Deere 6R · En curso
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

      {/* Section intro */}
      <section id="capacidades" className="bg-background pt-16 md:pt-24 pb-4 scroll-mt-14">
        <div className="mx-auto max-w-screen-xl px-6">
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-accent">
            Capacidades técnicas
          </span>
          <h2 className="mt-3 text-balance text-3xl md:text-4xl font-semibold tracking-tight text-foreground max-w-2xl">
            Cuatro módulos, una sola operación
          </h2>
          <p className="mt-4 max-w-[56ch] text-sm md:text-base text-muted-foreground">
            Visibilidad total sobre cada hectárea, cada máquina y cada cuadrilla.
          </p>
        </div>
      </section>

      <FeatureSection
        index="01"
        eyebrow="Trazabilidad de flota"
        title="Rastreo de vehículos por finca"
        description="Visualice en tiempo real la trayectoria y las pasadas de cada vehículo por parcela para asegurar la cobertura total del terreno y evitar solapamientos costosos."
        bullets={[
          "Histórico de pasadas por parcela y por vehículo",
          "Detección automática de zonas no tratadas",
          "Registro de horas de trabajo y consumo",
        ]}
        image={featureTracking}
        imageAlt="Vista aérea de tractor con trazas GPS sobre parcelas"
      />

      <FeatureSection
        index="02"
        eyebrow="Salud del cultivo"
        title="Evolución satelital de la finca"
        description="Monitorización histórica de índices de vegetación (NDVI) para detectar anomalías hídricas o de vigor antes de que sean visibles al ojo humano."
        bullets={[
          "Mapas NDVI actualizados por revisita satelital",
          "Comparativa entre campañas y parcelas",
          "Alertas de zonas con caída de vigor",
        ]}
        image={featureSatellite}
        imageAlt="Mapa NDVI satelital con índices de vegetación"
        reverse
        tinted
      />

      <FeatureSection
        index="03"
        eyebrow="Meteorología local"
        title="Predicción del tiempo con alertas"
        description="Predicción ultra-local por finca con avisos críticos de helada, viento, lluvia o estrés hídrico. Reciba notificaciones antes de programar tareas sensibles."
        bullets={[
          "Alertas push de helada, granizo y viento",
          "Ventanas óptimas para pulverización y siembra",
          "Estaciones propias integradas",
        ]}
        image={featureWeather}
        imageAlt="Cielo tormentoso sobre finca con estación meteorológica"
      />

      <FeatureSection
        index="04"
        eyebrow="Cuadrillas y tareas"
        title="Control de operarios y gestión de tareas"
        description="Asigne partes de trabajo diarios, supervise el progreso de las cuadrillas y reciba confirmación desde el campo con foto y coordenadas."
        bullets={[
          "Órdenes de trabajo digitales con checklist",
          "Fichaje y ubicación en tiempo real",
          "Partes cerrados con evidencia fotográfica",
        ]}
        image={featureWorkers}
        imageAlt="Operarios agrícolas revisando tareas en tablet"
        reverse
        tinted
      />

      {/* Capa de inteligencia (IA) */}
      <section id="inteligencia" className="bg-background py-16 md:py-24 scroll-mt-14">
        <div className="mx-auto max-w-screen-xl px-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[10px] font-mono font-semibold tracking-[0.2em] uppercase text-brand-accent">
              05
            </span>
            <span className="h-px w-8 bg-brand-accent/40" />
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              Capa de inteligencia
            </span>
          </div>

          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
            <div>
              <h3 className="text-balance text-2xl md:text-4xl font-semibold tracking-tight text-foreground">
                Una IA que convierte los datos en acciones
              </h3>
              <p className="mt-4 max-w-[48ch] text-pretty text-sm md:text-base text-muted-foreground leading-relaxed">
                La capa de IA lee toda la operación a la vez —meteo, parcelas,
                flota y cuadrillas— y devuelve una lista corta de acciones
                priorizadas, con impacto, esfuerzo y los pasos concretos para
                empezar hoy. Y un agente con el que puede conversar sobre cada una.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {[
                  "Razonamiento cruzado entre todas las fuentes de datos",
                  "Priorizadas por impacto, esfuerzo y confianza",
                  "Un agente que responde con el contexto de su finca",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
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
                  6 · 4 módulos
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
                    title: "Resolver la Claas Lexion fuera de servicio",
                    impact: "Restablece la cosecha",
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

      {/* CTA */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-screen-xl px-6">
          <div className="rounded-2xl bg-brand-primary p-8 md:p-12 ring-1 ring-black/5">
            <h2 className="text-balance text-2xl md:text-3xl font-medium text-primary-foreground max-w-2xl">
              Empiece a digitalizar su finca hoy mismo
            </h2>
            <p className="mt-4 text-pretty text-sm md:text-base text-primary-foreground/70 max-w-[56ch]">
              Únase a los gestores agrícolas que ya optimizan sus márgenes operativos
              con datos reales del campo.
            </p>
            <RequestDemoDialog
              title="Agendar consultoría técnica"
              description="Revisamos su operación actual y le mostramos cómo encaja Hub."
            >
              <Button
                variant="inverted"
                className="mt-8 w-full md:w-auto px-6"
              >
                Agendar consultoría técnica
              </Button>
            </RequestDemoDialog>
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
                <span className="font-normal lowercase">by barrenarobotics</span>
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground">
              © 2026 barrenarobotics. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
