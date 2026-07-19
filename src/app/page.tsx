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
          <span className="mb-4 inline-block text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-accent">
            Tecnología de precisión
          </span>
          <h1 className="text-balance text-3xl md:text-5xl font-semibold leading-tight tracking-tight text-foreground max-w-3xl">
            Control operativo total para su explotación agrícola
          </h1>
          <p className="mt-4 max-w-[46ch] text-pretty text-base md:text-lg text-muted-foreground">
            Gestione trazabilidad de vehículos, evolución de cultivos y cuadrillas desde
            una única interfaz técnica diseñada para el campo.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <RequestDemoDialog>
              <Button>Solicitar Demo</Button>
            </RequestDemoDialog>
            <Button asChild variant="secondary">
              <a href="#capacidades">Saber más</a>
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
