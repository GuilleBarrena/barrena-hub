"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { SelectField, TextField } from "@/components/ui/form";
import { Button } from "@barrena/ui/button";
import { logout } from "@/lib/auth/session";
import { saveUserProfile, useUserProfile, type UserProfile } from "@/lib/users/data";

const LANGUAGES: [string, string][] = [
  ["es-ES", "Español"],
  ["en-GB", "English"],
  ["eu-ES", "Euskara"],
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** The signed-in user's own profile card + editable fields. */
export function UserView() {
  const stored = useUserProfile();
  const router = useRouter();
  const [form, setForm] = useState<UserProfile>(stored);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    saveUserProfile(form);
    setSaved(true);
  }

  function closeSession() {
    logout();
    router.replace("/login");
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-accent text-sm font-semibold text-primary-foreground"
        >
          {initials(form.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{form.name}</p>
          <p className="truncate text-[12px] text-muted-foreground">{form.role}</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="user-name"
          label="Nombre"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <TextField
          id="user-role"
          label="Cargo"
          value={form.role}
          onChange={(e) => set("role", e.target.value)}
        />
        <TextField
          id="user-email"
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />
        <TextField
          id="user-phone"
          label="Teléfono"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
        />
        <SelectField
          id="user-language"
          label="Idioma"
          value={form.language}
          onChange={(e) => set("language", e.target.value)}
          options={LANGUAGES}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit">Guardar cambios</Button>
        {saved && (
          <span className="text-[12px] font-medium text-brand-primary">Guardado ✓</span>
        )}
      </div>
    </form>

    <div className="border-t border-border pt-5 mt-5">
      <Button variant="destructive" onClick={closeSession}>
        Cerrar sesión
      </Button>
    </div>
  );
}
