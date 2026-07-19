"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

// Data keys are English; labels stay Spanish, matching the UI.
const FORM_FIELDS = [
  { name: "fullName", label: "Nombre y apellidos", type: "text", autoComplete: "name" },
  { name: "farm", label: "Explotación", type: "text", autoComplete: "organization" },
  { name: "email", label: "Correo electrónico", type: "email", autoComplete: "email" },
  { name: "phone", label: "Teléfono", type: "tel", autoComplete: "tel" },
] as const;

export function RequestDemoDialog({
  children,
  title = "Solicitar demo",
  description = "Cuéntenos sobre su explotación y le contactamos para una demostración técnica.",
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
    console.warn("[RequestDemoDialog] form not connected to a backend:", data);
    setSubmitted(true);
  }

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
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  required
                  className="h-10 rounded-lg bg-surface px-3 text-sm text-foreground outline-none
                             ring-1 ring-input focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            ))}

            {submitted && (
              <p
                role="status"
                className="rounded-lg bg-surface-2 px-3 py-2 text-[13px] text-muted-foreground"
              >
                Este formulario aún no está conectado a ningún servidor. Configure
                el envío en <code className="font-mono">request-demo-dialog.tsx</code>.
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
