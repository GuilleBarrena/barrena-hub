import type { Metadata } from "next";

import { SettingsTabs } from "@/components/settings/settings-tabs";

export const metadata: Metadata = {
  title: "Ajustes",
  description: "Configura la API meteorológica, la organización y tu perfil.",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Ajustes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configuración del servicio de estaciones, la organización y tu cuenta.
        </p>
      </header>

      <SettingsTabs />
    </div>
  );
}
