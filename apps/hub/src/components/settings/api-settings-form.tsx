"use client";

import { useState } from "react";

import { SelectField, TextField } from "@/components/ui/form";
import { Button } from "@barrena/ui/button";
import {
  DEFAULT_SETTINGS,
  savePwsSettings,
  usePwsSettings,
  type PwsSettings,
} from "@/lib/pws/settings";

const POLL_OPTIONS: [string, string][] = [
  ["0", "Bajo demanda"],
  ["5", "Cada 5 minutos"],
  ["10", "Cada 10 minutos"],
  ["15", "Cada 15 minutos"],
  ["60", "Cada hora"],
];

/**
 * Configures the public weather API the service reads from: provider,
 * credential, units and poll cadence. It is the only PWS config there is — it
 * never lists stations, since those come from each field's position.
 */
export function ApiSettingsForm() {
  const stored = usePwsSettings();
  const [form, setForm] = useState<PwsSettings>(stored);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof PwsSettings>(key: K, value: PwsSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    savePwsSettings(form);
    setSaved(true);
  }

  const isEcowitt = form.provider === "ecowitt";

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="rounded-xl bg-surface-2/70 p-3 text-[12px] text-muted-foreground ring-1 ring-black/5">
        Demo · las credenciales se guardan solo en este navegador y no se envían a
        ningún servicio. Aquí es donde conectarías la API real del proveedor.
      </div>

      <SelectField
        id="provider"
        label="Proveedor"
        hint="De dónde lee el servicio las observaciones."
        value={form.provider}
        onChange={(e) => set("provider", e.target.value as PwsSettings["provider"])}
        options={[
          ["weather_underground", "Weather Underground (IBM)"],
          ["ecowitt", "Ecowitt"],
        ]}
      />

      <TextField
        id="apiKey"
        label={isEcowitt ? "Application key" : "API key"}
        hint={
          isEcowitt
            ? "application_key generada en tu cuenta de Ecowitt."
            : "Clave de 32 caracteres de la PWS Contributor API."
        }
        value={form.apiKey}
        onChange={(e) => set("apiKey", e.target.value)}
        placeholder={isEcowitt ? "application_key" : "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}
        autoComplete="off"
        spellCheck={false}
      />

      {isEcowitt && (
        <TextField
          id="apiSecret"
          label="API key (secret)"
          hint="La api_key de Ecowitt que acompaña a la application_key."
          value={form.apiSecret}
          onChange={(e) => set("apiSecret", e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          id="units"
          label="Unidades"
          value={form.units}
          onChange={(e) => set("units", e.target.value as PwsSettings["units"])}
          options={[
            ["metric", "Métrico · °C, km/h, mm"],
            ["imperial", "Imperial · °F, mph, in"],
          ]}
        />

        <SelectField
          id="pollMinutes"
          label="Frecuencia de sondeo"
          value={String(form.pollMinutes)}
          onChange={(e) => set("pollMinutes", Number(e.target.value))}
          options={POLL_OPTIONS}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit">Guardar configuración</Button>
        <button
          type="button"
          onClick={() => {
            setForm(DEFAULT_SETTINGS);
            setSaved(false);
          }}
          className="text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          Restablecer
        </button>
        {saved && (
          <span className="text-[12px] font-medium text-brand-primary">Guardado ✓</span>
        )}
      </div>
    </form>
  );
}
