import type { Metadata } from "next";
import { Suspense } from "react";
import { AgentChat } from "@/components/dashboard/agent-chat";

export const metadata: Metadata = {
  title: "Agente",
  description: "Conversa con la IA sobre los datos y las acciones de la finca.",
};

export default function AgentPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <AgentChat />
    </Suspense>
  );
}

function Fallback() {
  return (
    <div className="flex h-[60vh] items-center justify-center text-sm text-muted-foreground">
      Cargando el agente…
    </div>
  );
}
