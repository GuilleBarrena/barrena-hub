"use client";

import { useState } from "react";

import { Panel } from "@/components/dashboard/primitives";
import { ApiSettingsForm } from "./api-settings-form";
import { OrganizationView } from "./organization-view";
import { UserView } from "./user-view";

type TabId = "api" | "organization" | "user";

const TABS: { id: TabId; label: string; title: string; subtitle: string }[] = [
  {
    id: "api",
    label: "API pública",
    title: "API meteorológica",
    subtitle: "El proveedor y la credencial con los que el servicio lee las estaciones.",
  },
  {
    id: "organization",
    label: "Organización",
    title: "Organización",
    subtitle: "Identidad de la explotación y valores por defecto operativos.",
  },
  {
    id: "user",
    label: "Usuario",
    title: "Tu perfil",
    subtitle: "Datos de la cuenta con la que has iniciado sesión.",
  },
];

export function SettingsTabs() {
  const [active, setActive] = useState<TabId>("api");
  const current = TABS.find((t) => t.id === active) ?? TABS[0];

  return (
    <div className="max-w-3xl">
      <div
        role="tablist"
        aria-label="Secciones de ajustes"
        className="mb-5 flex gap-1 overflow-x-auto rounded-xl bg-surface-2/60 p-1"
      >
        {TABS.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => setActive(tab.id)}
              className={`shrink-0 rounded-lg px-3.5 py-1.5 text-sm font-medium outline-none transition-colors
                          focus-visible:ring-2 focus-visible:ring-ring
                          ${
                            selected
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <Panel title={current.title} subtitle={current.subtitle}>
        {active === "api" && <ApiSettingsForm />}
        {active === "organization" && <OrganizationView />}
        {active === "user" && <UserView />}
      </Panel>
    </div>
  );
}
