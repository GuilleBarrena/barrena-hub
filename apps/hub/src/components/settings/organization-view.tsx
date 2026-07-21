"use client";

import { useState } from "react";

import { SelectField, TextField } from "@/components/ui/form";
import { Button } from "@barrena/ui/button";
import {
  saveOrganizationProfile,
  useOrganizationProfile,
  type OrganizationProfile,
} from "@/lib/organizations/profile";

const TIMEZONES = ["Europe/Madrid", "Europe/Lisbon", "Atlantic/Canary", "UTC"];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** The organization profile shown under Settings — company identity and the
 *  operational defaults (location, timezone) the rest of the hub would read. */
export function OrganizationView() {
  const stored = useOrganizationProfile();
  const [form, setForm] = useState<OrganizationProfile>(stored);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof OrganizationProfile>(key: K, value: OrganizationProfile[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    saveOrganizationProfile(form);
    setSaved(true);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-primary text-sm font-semibold text-primary-foreground"
        >
          {initials(form.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{form.name}</p>
          <p className="truncate text-[12px] text-muted-foreground">{form.descriptor}</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="org-name"
          label="Nombre"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <TextField
          id="org-descriptor"
          label="Sector"
          value={form.descriptor}
          onChange={(e) => set("descriptor", e.target.value)}
        />
        <TextField
          id="org-location"
          label="Ubicación"
          value={form.location}
          onChange={(e) => set("location", e.target.value)}
        />
        <SelectField
          id="org-timezone"
          label="Zona horaria"
          value={form.timezone}
          onChange={(e) => set("timezone", e.target.value)}
          options={TIMEZONES}
        />
        <TextField
          id="org-contact"
          label="Email de contacto"
          type="email"
          value={form.contactEmail}
          onChange={(e) => set("contactEmail", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit">Guardar cambios</Button>
        {saved && (
          <span className="text-[12px] font-medium text-brand-primary">Guardado ✓</span>
        )}
      </div>
    </form>
  );
}
