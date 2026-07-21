"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@barrena/ui/button";

// Data keys are English; labels stay Spanish, matching the UI.
type TextField = {
  kind: "text";
  name: string;
  label: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
};
type SelectField = {
  kind: "select";
  name: string;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
};
type TextareaField = {
  kind: "textarea";
  name: string;
  label: string;
  required?: boolean;
};

type Field = TextField | SelectField | TextareaField;

const FORM_FIELDS: Field[] = [
  { kind: "text", name: "fullName", label: "Nombre y apellidos", type: "text", autoComplete: "name", required: true },
  { kind: "text", name: "email", label: "Correo electrónico", type: "email", autoComplete: "email", required: true },
  { kind: "text", name: "phone", label: "Teléfono", type: "tel", autoComplete: "tel", required: true },
  {
    kind: "select",
    name: "crop",
    label: "Cultivo",
    required: true,
    options: [
      { value: "vina", label: "Viña" },
      { value: "olivar", label: "Olivar" },
      { value: "frutal", label: "Frutal" },
      { value: "otro", label: "Otro" },
    ],
  },
  { kind: "text", name: "hectares", label: "Hectáreas", type: "number", required: true },
  { kind: "text", name: "province", label: "Provincia", type: "text", autoComplete: "address-level1", required: true },
  { kind: "text", name: "tractor", label: "Marca y modelo de tractor principal", type: "text", required: true },
  { kind: "textarea", name: "painPoint", label: "¿Qué operación de campo le da más dolor de cabeza hoy?" },
];

export function WaitlistDialog({
  children,
  title = "Unirse a la lista de espera",
  description = "Capturamos su explotación para el programa piloto. El Hub es gratuito; le avisamos en cuanto abramos acceso.",
}: {
  children: ReactNode;
  title?: string;
  description?: string;
}) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: no backend is wired up yet. POST this to your CRM / form endpoint
    // and replace the notice rendered below with a real confirmation.
    const data = Object.fromEntries(new FormData(event.currentTarget));
    console.warn("[WaitlistDialog] form not connected to a backend:", data);
    setSubmitted(true);
  }

  const inputClass =
    "h-10 rounded-lg bg-surface px-3 text-sm text-foreground outline-none " +
    "ring-1 ring-input focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <Dialog.Root onOpenChange={(open) => !open && setSubmitted(false)}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          data-slot="dialog-overlay"
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
        />
        <Dialog.Content
          data-slot="dialog-content"
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2
                     rounded-2xl bg-card p-6 shadow-lg ring-1 ring-black/5
                     max-h-[calc(100dvh-2rem)] overflow-y-auto"
        >
          <Dialog.Title className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-muted-foreground">
            {description}
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {FORM_FIELDS.map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <label
                  htmlFor={field.name}
                  className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                >
                  {field.label}
                </label>

                {field.kind === "text" && (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    required={field.required}
                    className={inputClass}
                  />
                )}

                {field.kind === "select" && (
                  <select
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Seleccione…
                    </option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {field.kind === "textarea" && (
                  <textarea
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    rows={3}
                    className="rounded-lg bg-surface px-3 py-2 text-sm text-foreground outline-none
                               ring-1 ring-input focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                )}
              </div>
            ))}

            {submitted && (
              <p
                role="status"
                className="rounded-lg bg-surface-2 px-3 py-2 text-[13px] text-muted-foreground"
              >
                Este formulario aún no está conectado a ningún servidor. Configure
                el envío en <code className="font-mono">waitlist-dialog.tsx</code>.
              </p>
            )}

            <div className="mt-2 flex items-center justify-end gap-3">
              <Dialog.Close asChild>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </Dialog.Close>
              <Button type="submit">Enviar solicitud</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
