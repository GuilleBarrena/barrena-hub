"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@barrena/ui/button";
import { SelectField, TextField } from "@/components/ui/form";
import { getVehicleRepository } from "@/lib/vehicles/repository";
import {
  VEHICLE_STATUS,
  VEHICLE_TYPES,
  type VehicleStatus,
} from "@/lib/vehicles/types";

const STATUS_OPTIONS = (Object.keys(VEHICLE_STATUS) as VehicleStatus[]).map(
  (key) => [key, VEHICLE_STATUS[key].label] as [string, string],
);

export function VehicleForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [vehicleType, setVehicleType] = useState(VEHICLE_TYPES[0]);
  const [plate, setPlate] = useState("");
  const [status, setStatus] = useState<VehicleStatus>("operational");
  const [engineHours, setEngineHours] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hours = Number(engineHours);
  const hoursValid = engineHours === "" || (Number.isFinite(hours) && hours >= 0);
  const canSave = name.trim().length > 0 && plate.trim().length > 0 && hoursValid;

  async function save() {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      await getVehicleRepository().create({
        name: name.trim(),
        vehicleType,
        plate: plate.trim().toUpperCase(),
        status,
        engineHours: engineHours === "" ? 0 : hours,
      });
      router.push("/dashboard/vehicles");
      router.refresh();
    } catch {
      setError("No se pudo guardar el vehículo en este navegador.");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl rounded-2xl bg-card p-5 ring-1 ring-black/5 shadow-sm">
      <div className="flex flex-col gap-4">
        <TextField
          id="vehicle-name"
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Deere 6R"
        />

        <SelectField
          id="vehicle-type"
          label="Tipo"
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          options={VEHICLE_TYPES}
        />

        <TextField
          id="vehicle-plate"
          label="Matrícula"
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          placeholder="E-4821-BCD"
        />

        <SelectField
          id="vehicle-status"
          label="Estado"
          value={status}
          onChange={(e) => setStatus(e.target.value as VehicleStatus)}
          options={STATUS_OPTIONS}
        />

        <TextField
          id="vehicle-hours"
          label="Horas motor"
          type="number"
          min={0}
          inputMode="numeric"
          value={engineHours}
          onChange={(e) => setEngineHours(e.target.value)}
          placeholder="0"
          hint={hoursValid ? undefined : "Introduzca un número igual o mayor que cero."}
        />

        {error && (
          <p role="alert" className="text-[12px] text-red-600">
            {error}
          </p>
        )}

        <Button type="button" onClick={save} disabled={!canSave || saving}>
          {saving ? "Guardando…" : "Guardar vehículo"}
        </Button>

        <p className="text-[11px] text-muted-foreground">
          Se guarda en este navegador (localStorage), no en un servidor.
        </p>
      </div>
    </div>
  );
}
