"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Accionable, MensajeChat } from "@/lib/actionables/types";

const SUGERENCIAS = [
  "¿Por dónde empiezo hoy?",
  "Explícame el riesgo de helada.",
  "Prepara un plan para la cosechadora.",
  "¿Cómo reequilibro las cuadrillas?",
];

export function AgentChat() {
  const searchParams = useSearchParams();
  const [mensajes, setMensajes] = useState<MensajeChat[]>([]);
  const [entrada, setEntrada] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [motor, setMotor] = useState<"claude" | "local" | null>(null);
  const accionablesRef = useRef<Accionable[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const iniciado = useRef(false);

  // Cargamos las acciones que propuso el panel para fundamentar al agente.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("hub:accionables");
      if (raw) accionablesRef.current = JSON.parse(raw);
    } catch {
      /* no crítico */
    }
  }, []);

  // Enlace directo: /agent?accion=... precarga una pregunta.
  useEffect(() => {
    if (iniciado.current) return;
    iniciado.current = true;
    const foco = searchParams.get("accion");
    if (foco) {
      void enviar(`Ayúdame con esta acción: «${foco}». ¿Cuál es el plan?`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [mensajes, enviando]);

  async function enviar(texto: string) {
    const content = texto.trim();
    if (!content || enviando) return;
    setEntrada("");

    const siguiente: MensajeChat[] = [...mensajes, { role: "user", content }];
    setMensajes(siguiente);
    setEnviando(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensajes: siguiente,
          accionables: accionablesRef.current,
        }),
      });
      if (!res.ok) throw new Error(`Error de la petición (${res.status})`);
      const json = (await res.json()) as {
        respuesta: string;
        motor: "claude" | "local";
      };
      setMotor(json.motor);
      setMensajes((m) => [...m, { role: "assistant", content: json.respuesta }]);
    } catch {
      setMensajes((m) => [
        ...m,
        {
          role: "assistant",
          content: "Lo siento, no he podido contactar con el agente. Inténtelo de nuevo.",
        },
      ]);
    } finally {
      setEnviando(false);
    }
  }

  const vacio = mensajes.length === 0;

  return (
    <div className="mx-auto flex h-[calc(100vh-8.5rem)] max-w-3xl flex-col md:h-[calc(100vh-6rem)]">
      {/* Cabecera */}
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            Agente
            {motor && <MotorBadge motor={motor} />}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Conversa con la IA sobre tus datos y acciones.
          </p>
        </div>
      </header>

      {/* Conversación */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-2xl bg-card p-4 shadow-sm ring-1 ring-black/5 md:p-5"
      >
        {vacio ? (
          <EmptyState onPick={enviar} />
        ) : (
          <div className="flex flex-col gap-4">
            {mensajes.map((m, i) => (
              <MessageBubble key={i} mensaje={m} />
            ))}
            {enviando && <TypingBubble />}
          </div>
        )}
      </div>

      {/* Redactor */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void enviar(entrada);
        }}
        className="mt-3 flex items-end gap-2"
      >
        <textarea
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void enviar(entrada);
            }
          }}
          rows={1}
          placeholder="Pregunta sobre tus datos, prioridades o un plan…"
          className="max-h-40 flex-1 resize-none rounded-xl bg-card px-4 py-3 text-sm text-foreground shadow-sm outline-none ring-1 ring-black/5 placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          disabled={enviando || !entrada.trim()}
          className="inline-flex size-[46px] shrink-0 items-center justify-center rounded-xl bg-brand-primary text-lg text-primary-foreground ring-1 ring-brand-primary outline-none transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          aria-label="Enviar"
        >
          ↑
        </button>
      </form>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        El agente ve tus datos en vivo y las acciones propuestas. Enter para
        enviar · Mayús+Enter para salto de línea.
      </p>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (t: string) => void }) {
  return (
    <div className="mx-auto max-w-xl py-6 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
        <BotIcon />
      </div>
      <h2 className="text-lg font-semibold text-foreground">
        ¿Sobre qué quieres actuar?
      </h2>
      <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
        He leído todos tus datos y las acciones que ha propuesto Hub. Pídeme
        priorizar, planificar o profundizar en cualquier módulo.
      </p>
      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {SUGERENCIAS.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="rounded-xl bg-surface-2 px-4 py-3 text-left text-sm text-foreground outline-none ring-1 ring-foreground/5 transition-transform hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-ring"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ mensaje }: { mensaje: MensajeChat }) {
  const esUsuario = mensaje.role === "user";
  return (
    <div className={`flex gap-3 ${esUsuario ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
          esUsuario
            ? "bg-surface-2 text-muted-foreground"
            : "bg-brand-primary/10 text-brand-primary"
        }`}
        aria-hidden="true"
      >
        {esUsuario ? "Tú" : <BotIcon className="size-4" />}
      </div>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          esUsuario
            ? "bg-brand-primary text-primary-foreground"
            : "bg-surface-2 text-foreground"
        }`}
      >
        <FormattedText text={mensaje.content} />
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary" aria-hidden="true">
        <BotIcon className="size-4" />
      </div>
      <div className="rounded-2xl bg-surface-2 px-4 py-3.5">
        <div className="flex gap-1">
          <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
        </div>
      </div>
    </div>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
      style={{ animationDelay: delay }}
    />
  );
}

/** Renderizado ligero: **negrita** y saltos de línea. Sin HTML crudo. */
function FormattedText({ text }: { text: string }) {
  const lineas = text.split("\n");
  return (
    <div className="flex flex-col gap-1.5">
      {lineas.map((linea, i) =>
        linea.trim() === "" ? (
          <span key={i} className="block h-1" />
        ) : (
          <p key={i}>{renderInline(linea)}</p>
        ),
      )}
    </div>
  );
}

function renderInline(linea: string): React.ReactNode[] {
  const partes = linea.split(/(\*\*[^*]+\*\*)/g);
  return partes.map((parte, i) => {
    const m = parte.match(/^\*\*([^*]+)\*\*$/);
    if (m) {
      return (
        <strong key={i} className="font-semibold">
          {m[1]}
        </strong>
      );
    }
    return <span key={i}>{parte}</span>;
  });
}

function MotorBadge({ motor }: { motor: "claude" | "local" }) {
  const live = motor === "claude";
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
        live
          ? "bg-brand-primary/10 text-brand-primary"
          : "bg-surface-2 text-muted-foreground"
      }`}
    >
      {live ? "IA en vivo" : "Motor local"}
    </span>
  );
}

function BotIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="8" width="16" height="11" rx="3" />
      <path d="M12 8V4M9 4h6" />
      <circle cx="9" cy="13.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
