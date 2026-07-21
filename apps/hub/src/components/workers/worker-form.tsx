"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@barrena/ui/button";
import { SelectField, TextField } from "@/components/ui/form";
import { getWorkerRepository } from "@/lib/workers/repository";
import {
  WORKER_CREWS,
  WORKER_ROLES,
  WORKER_STATUS,
  type WorkerStatus,
} from "@/lib/workers/types";

const STATUS_OPTIONS = (Object.keys(WORKER_STATUS) as WorkerStatus[]).map(
  (key) => [key, WORKER_STATUS[key].label] as [string, string],
);

export function WorkerForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [role, setRole] = useState(WORKER_ROLES[0]);
  const [crew, setCrew] = useState(WORKER_CREWS[0]);
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<WorkerStatus>("active");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave = name.trim().length > 0;

  async function save() {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      await getWorkerRepository().create({
        name: name.trim(),
        role,
        crew,
        phone: phone.trim(),
        status,
      });
      router.push("/workers");
      router.refresh();
    } catch {
      setError("No se pudo guardar el operario en este navegador.");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl rounded-2xl bg-card p-5 ring-1 ring-black/5 shadow-sm">
      <div className="flex flex-col gap-4">
        <TextField
          id="worker-name"
          label="Nombre y apellidos"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ana Beltrán"
          autoComplete="off"
        />

        <SelectField
          id="worker-role"
          label="Puesto"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={WORKER_ROLES}
        />

        <SelectField
          id="worker-crew"
          label="Cuadrilla"
          value={crew}
          onChange={(e) => setCrew(e.target.value)}
          options={WORKER_CREWS}
        />

        <TextField
          id="worker-phone"
          label="Teléfono"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+34 600 000 000"
          autoComplete="off"
        />

        <SelectField
          id="worker-status"
          label="Estado"
          value={status}
          onChange={(e) => setStatus(e.target.value as WorkerStatus)}
          options={STATUS_OPTIONS}
        />

        {error && (
          <p role="alert" className="text-[12px] text-red-600">
            {error}
          </p>
        )}

        <Button type="button" onClick={save} disabled={!canSave || saving}>
          {saving ? "Guardando…" : "Guardar operario"}
        </Button>

        <p className="text-[11px] text-muted-foreground">
          Se guarda en este navegador (localStorage), no en un servidor. No introduzca
          datos personales reales.
        </p>
      </div>
    </div>
  );
}
