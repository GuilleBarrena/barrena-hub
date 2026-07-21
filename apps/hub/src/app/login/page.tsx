"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@barrena/ui/button";
import { Wordmark } from "@barrena/ui/wordmark";
import { DEMO_CREDENTIALS, login } from "@/lib/auth/session";

/**
 * Split-screen login. From `lg` up, a branded visual fills the left half and
 * the form the right; below that the visual is hidden and only the form shows.
 *
 * The form is pre-filled with the demo credentials, so a single click signs in.
 * Auth is client-side (localStorage) — see `@/lib/auth/session`.
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState<string>(DEMO_CREDENTIALS.password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    // A short pause so the pending state reads as a real sign-in, not a flash.
    await new Promise((resolve) => setTimeout(resolve, 450));

    const result = login(email, password);
    if (result.ok) {
      router.replace("/");
      return;
    }
    setError(result.error ?? "No se pudo iniciar sesión.");
    setPending(false);
  }

  return (
    <div className="flex min-h-screen bg-background">
      <LoginVisual />

      {/* Form half — full width on mobile, right half from lg up. */}
      <div className="flex w-full flex-col px-6 py-8 sm:px-10 lg:w-1/2">
        <div className="lg:hidden">
          <Wordmark product="Hub" />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm py-10">
            <header className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Inicia sesión
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Accede al panel de tu explotación agrícola.
              </p>
            </header>

            <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
              <Field
                id="email"
                label="Correo electrónico"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                icon={
                  <path d="M4 6h16v12H4z M4 7l8 6 8-6" />
                }
              />

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className={LABEL}>
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-[11px] font-medium text-brand-primary outline-none hover:underline focus-visible:underline"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                <div className="relative">
                  <FieldIcon>
                    <path d="M6 10V8a6 6 0 0 1 12 0v2 M5 10h14v10H5z" />
                  </FieldIcon>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={CONTROL}
                  />
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-brand-accent/10 px-3 py-2 text-sm text-brand-accent"
                >
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="size-4 rounded border-input accent-brand-primary"
                  />
                  Recordarme
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-brand-primary hover:underline"
                  onClick={(event) => event.preventDefault()}
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <Button
                type="submit"
                disabled={pending}
                className="mt-2 w-full"
              >
                {pending ? "Entrando…" : "Iniciar sesión"}
              </Button>
            </form>

            <p className="mt-6 rounded-lg bg-surface-2 px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
              Demo · usa{" "}
              <span className="font-medium text-foreground">
                {DEMO_CREDENTIALS.email}
              </span>{" "}
              y la contraseña{" "}
              <span className="font-medium text-foreground">
                {DEMO_CREDENTIALS.password}
              </span>{" "}
              (ya rellenadas).
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground lg:text-left">
          © {new Date().getFullYear()} Barrena Robotics. Todos los datos son de
          muestra.
        </p>
      </div>
    </div>
  );
}

const LABEL =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground";

const CONTROL =
  "h-11 w-full rounded-lg bg-surface pl-10 pr-3 text-sm text-foreground outline-none " +
  "ring-1 ring-input focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground/60";

/** The leading glyph shared by the fields, positioned inside the control. */
function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function Field({
  id,
  label,
  icon,
  ...props
}: React.ComponentProps<"input"> & {
  id: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <div className="relative">
        <FieldIcon>{icon}</FieldIcon>
        <input id={id} className={CONTROL} {...props} />
      </div>
    </div>
  );
}

/**
 * The branded left half: a deep-green field evoking crop rows, with the brand
 * lockup and a headline. Purely decorative, so it's hidden below `lg` where the
 * form takes the whole screen.
 */
function LoginVisual() {
  return (
    <div className="relative hidden w-1/2 overflow-hidden bg-brand-primary lg:block">
      {/* Depth: a darker base with a warm accent glow bleeding in. */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-primary to-[oklch(0.28_0.04_150)]" />
      <div className="absolute -right-24 -top-24 size-96 rounded-full bg-brand-accent/25 blur-3xl" />
      <div className="absolute -bottom-32 -left-16 size-96 rounded-full bg-[oklch(0.5_0.08_150)]/40 blur-3xl" />

      {/* Abstract contour rows — the fields, drawn as gentle lines. */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full text-white/10"
        preserveAspectRatio="none"
        viewBox="0 0 400 600"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <path
            key={i}
            d={`M-20 ${90 + i * 60} C 120 ${40 + i * 60}, 280 ${140 + i * 60}, 420 ${70 + i * 60}`}
          />
        ))}
      </svg>

      {/* Content: brand lockup up top, headline anchored to the bottom. */}
      <div className="relative flex h-full flex-col justify-between p-12 text-white">
        <span className="inline-flex items-center gap-2.5">
          <span aria-hidden className="size-7 rounded-md bg-white" />
          <span className="text-sm font-semibold uppercase tracking-tight">
            Hub
          </span>
          <span className="text-white/50">·</span>
          <span className="text-sm font-semibold tracking-tight">
            Barrena Robotics
          </span>
        </span>

        <div className="max-w-md">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">
            Toda tu explotación, en un solo panel.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Parcelas, flota, meteorología y tareas con la capa de inteligencia
            de Barrena Robotics convirtiendo tus datos en acciones.
          </p>
        </div>
      </div>
    </div>
  );
}
