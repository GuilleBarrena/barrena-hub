"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@barrena/ui/button";
import { SelectField, TextField } from "@/components/ui/form";
import { getMaintenanceRepository } from "@/lib/vehicles/maintenance/repository";
import {
  MAINTENANCE_TYPES,
  type MaintenanceRecord,
} from "@/lib/vehicles/maintenance/types";

const eur = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function formatDate(iso: string): string {
  // Parse as a plain calendar date to avoid a timezone shifting the day.
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const today = () => new Date().toISOString().slice(0, 10);

export function MaintenanceTracker({ vehicleId }: { vehicleId: string }) {
  const [records, setRecords] = useState<MaintenanceRecord[] | null>(null);
  const [adding, setAdding] = useState(false);

  const load = useCallback(() => {
    getMaintenanceRepository()
      .listForVehicle(vehicleId)
      .then(setRecords)
      .catch(() => setRecords([]));
  }, [vehicleId]);

  useEffect(load, [load]);

  async function remove(id: string) {
    await getMaintenanceRepository().remove(id);
    load();
  }

  return (
    <section className="mt-4 rounded-2xl bg-card p-5 ring-1 ring-black/5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Mantenimiento
          </h2>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Historial de intervenciones de este vehículo.
          </p>
        </div>
        {!adding && (
          <Button
            type="button"
            variant="secondary"
            className="h-9 px-4"
            onClick={() => setAdding(true)}
          >
            Añadir intervención
          </Button>
        )}
      </div>

      {records && records.length > 0 && <Summary records={records} />}

      {adding && (
        <MaintenanceForm
          vehicleId={vehicleId}
          onCancel={() => setAdding(false)}
          onSaved={() => {
            setAdding(false);
            load();
          }}
        />
      )}

      <div className="mt-4">
        {records === null ? (
          <p className="text-sm text-muted-foreground">Cargando historial…</p>
        ) : records.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Sin intervenciones registradas. Añada la primera para empezar el
            historial.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border/60">
            {records.map((record) => (
              <RecordRow key={record.id} record={record} onDelete={remove} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function Summary({ records }: { records: MaintenanceRecord[] }) {
  const totalCost = records.reduce((sum, r) => sum + r.cost, 0);
  // records arrive sorted most-recent first.
  const last = records[0];

  const stats: [string, string][] = [
    ["Intervenciones", String(records.length)],
    ["Última", formatDate(last.date)],
    ["Gasto total", eur.format(totalCost)],
  ];

  return (
    <dl className="mt-4 grid grid-cols-3 gap-3">
      {stats.map(([label, value]) => (
        <div
          key={label}
          className="rounded-xl bg-surface p-3 ring-1 ring-black/5"
        >
          <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {label}
          </dt>
          <dd className="mt-1 text-sm font-semibold tabular-nums text-foreground">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function RecordRow({
  record,
  onDelete,
}: {
  record: MaintenanceRecord;
  onDelete: (id: string) => void;
}) {
  return (
    <li className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-medium text-foreground">
            {record.type}
          </span>
          <span className="text-[12px] text-muted-foreground">
            {formatDate(record.date)}
          </span>
        </div>
        <p className="mt-0.5 text-[12px] text-muted-foreground">
          {record.engineHours.toLocaleString("es-ES")} h
          {record.notes ? ` · ${record.notes}` : ""}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-sm tabular-nums text-foreground">
          {record.cost > 0 ? eur.format(record.cost) : "—"}
        </span>
        {record.source === "user" && (
          <button
            type="button"
            onClick={() => onDelete(record.id)}
            className="rounded-md text-[12px] text-muted-foreground outline-none transition-colors
                       hover:text-red-600 focus-visible:ring-2 focus-visible:ring-ring"
          >
            Eliminar
          </button>
        )}
      </div>
    </li>
  );
}

function MaintenanceForm({
  vehicleId,
  onCancel,
  onSaved,
}: {
  vehicleId: string;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [date, setDate] = useState(today());
  const [type, setType] = useState(MAINTENANCE_TYPES[0]);
  const [engineHours, setEngineHours] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hours = Number(engineHours);
  const hoursValid = engineHours === "" || (Number.isFinite(hours) && hours >= 0);
  const costValue = Number(cost);
  const costValid = cost === "" || (Number.isFinite(costValue) && costValue >= 0);
  const canSave = date !== "" && hoursValid && costValid;

  async function save() {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      await getMaintenanceRepository().create({
        vehicleId,
        date,
        type,
        engineHours: engineHours === "" ? 0 : hours,
        cost: cost === "" ? 0 : costValue,
        notes: notes.trim(),
      });
      onSaved();
    } catch {
      setError("No se pudo guardar la intervención en este navegador.");
      setSaving(false);
    }
  }

  return (
    <div className="mt-4 rounded-xl bg-surface p-4 ring-1 ring-black/5">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="maintenance-date"
          label="Fecha"
          type="date"
          max={today()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <SelectField
          id="maintenance-type"
          label="Tipo"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={MAINTENANCE_TYPES}
        />
        <TextField
          id="maintenance-hours"
          label="Horas motor"
          type="number"
          min={0}
          inputMode="numeric"
          value={engineHours}
          onChange={(e) => setEngineHours(e.target.value)}
          placeholder="0"
          hint={hoursValid ? undefined : "Introduzca un número igual o mayor que cero."}
        />
        <TextField
          id="maintenance-cost"
          label="Coste (€)"
          type="number"
          min={0}
          inputMode="numeric"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="0"
          hint={costValid ? undefined : "Introduzca un número igual o mayor que cero."}
        />
      </div>

      <div className="mt-4">
        <TextField
          id="maintenance-notes"
          label="Notas"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Detalle de la intervención"
        />
      </div>

      {error && (
        <p role="alert" className="mt-3 text-[12px] text-red-600">
          {error}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Button
          type="button"
          className="h-9 px-4"
          onClick={save}
          disabled={!canSave || saving}
        >
          {saving ? "Guardando…" : "Guardar"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="px-2"
          onClick={onCancel}
          disabled={saving}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
