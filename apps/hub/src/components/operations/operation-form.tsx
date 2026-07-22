"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@barrena/ui/button";
import { SelectField, TextField } from "@/components/ui/form";
import { getOperationRepository } from "@/lib/operations/repository";
import { loadOperationRefs } from "@/lib/operations/references";
import {
  OPERATION_STATUS,
  OPERATION_TYPES,
  type OperationStatus,
} from "@/lib/operations/types";

const STATUS_OPTIONS = (Object.keys(OPERATION_STATUS) as OperationStatus[]).map(
  (key) => [key, OPERATION_STATUS[key].label] as [string, string],
);

/** Today as an ISO date (YYYY-MM-DD) for the date input's default. */
function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

interface Choice {
  id: string;
  label: string;
}

export function OperationForm() {
  const router = useRouter();

  const [workers, setWorkers] = useState<Choice[] | null>(null);
  const [crops, setCrops] = useState<Choice[] | null>(null);
  const [vehicles, setVehicles] = useState<Choice[] | null>(null);

  const [name, setName] = useState("");
  const [operationType, setOperationType] = useState(OPERATION_TYPES[0]);
  const [operatorId, setOperatorId] = useState("");
  const [cropId, setCropId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [status, setStatus] = useState<OperationStatus>("planned");
  const [scheduledFor, setScheduledFor] = useState(todayISO());
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    loadOperationRefs()
      .then((refs) => {
        if (!active) return;
        const w = [...refs.workers.values()].map((x) => ({ id: x.id, label: x.name }));
        const f = [...refs.crops.values()].map((x) => ({ id: x.id, label: x.name }));
        const v = [...refs.vehicles.values()].map((x) => ({
          id: x.id,
          label: `${x.name} · ${x.plate}`,
        }));
        setWorkers(w);
        setCrops(f);
        setVehicles(v);
        setOperatorId((prev) => prev || w[0]?.id || "");
        setCropId((prev) => prev || f[0]?.id || "");
      })
      .catch(() => {
        if (!active) return;
        setWorkers([]);
        setCrops([]);
        setVehicles([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const loaded = workers !== null && crops !== null && vehicles !== null;
  const canSave =
    loaded &&
    name.trim().length > 0 &&
    operatorId.length > 0 &&
    cropId.length > 0 &&
    scheduledFor.length > 0;

  async function save() {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      await getOperationRepository().create({
        name: name.trim(),
        operationType,
        operatorId,
        cropId,
        // Empty means the work needs no machine.
        vehicleId: vehicleId || null,
        status,
        scheduledFor,
        notes: notes.trim() ? notes.trim() : undefined,
      });
      router.push("/operations");
      router.refresh();
    } catch {
      setError("No se pudo guardar la operación en este navegador.");
      setSaving(false);
    }
  }

  if (!loaded) {
    return <p className="text-sm text-muted-foreground">Cargando datos…</p>;
  }

  if (workers.length === 0 || crops.length === 0) {
    return (
      <div className="max-w-xl rounded-2xl bg-card p-5 ring-1 ring-black/5 shadow-sm">
        <p className="text-sm text-foreground">
          Para crear una operación necesita al menos un operario y una parcela.
        </p>
        <p className="mt-2 text-[12px] text-muted-foreground">
          Añada operarios en «Operarios» y parcelas en «Parcelas» y vuelva aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl rounded-2xl bg-card p-5 ring-1 ring-black/5 shadow-sm">
      <div className="flex flex-col gap-4">
        <TextField
          id="operation-name"
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Siembra Parcela 02"
        />

        <SelectField
          id="operation-type"
          label="Tipo"
          value={operationType}
          onChange={(e) => setOperationType(e.target.value)}
          options={OPERATION_TYPES}
        />

        <SelectField
          id="operation-operator"
          label="Operario"
          value={operatorId}
          onChange={(e) => setOperatorId(e.target.value)}
          options={workers.map((w) => [w.id, w.label] as [string, string])}
        />

        <SelectField
          id="operation-crop"
          label="Parcela"
          value={cropId}
          onChange={(e) => setCropId(e.target.value)}
          options={crops.map((f) => [f.id, f.label] as [string, string])}
        />

        <SelectField
          id="operation-vehicle"
          label="Vehículo (opcional)"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          options={[
            ["", "Sin vehículo"],
            ...vehicles.map((v) => [v.id, v.label] as [string, string]),
          ]}
        />

        <SelectField
          id="operation-status"
          label="Estado"
          value={status}
          onChange={(e) => setStatus(e.target.value as OperationStatus)}
          options={STATUS_OPTIONS}
        />

        <TextField
          id="operation-date"
          label="Fecha"
          type="date"
          value={scheduledFor}
          onChange={(e) => setScheduledFor(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="operation-notes"
            className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
          >
            Notas (opcional)
          </label>
          <textarea
            id="operation-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Detalles de la operación…"
            className="rounded-lg bg-surface px-3 py-2 text-sm text-foreground outline-none ring-1 ring-input focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {error && (
          <p role="alert" className="text-[12px] text-red-600">
            {error}
          </p>
        )}

        <Button type="button" onClick={save} disabled={!canSave || saving}>
          {saving ? "Guardando…" : "Guardar operación"}
        </Button>

        <p className="text-[11px] text-muted-foreground">
          Se guarda en este navegador (localStorage), no en un servidor. El seguimiento
          por GPS solo está disponible en las operaciones de muestra con telemetría.
        </p>
      </div>
    </div>
  );
}
