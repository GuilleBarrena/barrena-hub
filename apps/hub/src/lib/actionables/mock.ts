import type { Accionable, MensajeChat } from "./types";
import type { InstantaneaFinca } from "./context";

// ---------------------------------------------------------------------------
// Motor local determinista.
//
// No es aleatorio: deriva un conjunto de acciones sensato a partir de las
// mismas señales que leería un modelo real, de modo que el producto es
// totalmente utilizable y demostrable sin conexión. Cuando hay ANTHROPIC_API_KEY
// definida, el modelo real toma el relevo.
// ---------------------------------------------------------------------------

export function accionablesLocales(d: InstantaneaFinca): {
  titular: string;
  accionables: Accionable[];
} {
  const accionables: Accionable[] = [];

  // 1) Riesgo de helada cruzado con cultivo y previsión.
  const helada = d.alertas.find((a) => /helada/i.test(a.titulo));
  const noche = d.prevision.reduce(
    (min, p) => (p.tempMin < min.tempMin ? p : min),
    d.prevision[0],
  );
  if (helada) {
    accionables.push({
      id: "acc-helada",
      titulo: "Proteger Cultivo 04 ante la helada del sábado",
      resumen: `Aviso crítico de helada en ${helada.detalle}. La previsión marca mínimas de ${noche.tempMin} °C (${noche.dia}); el viñedo en brotación es especialmente sensible.`,
      prioridad: "critica",
      ambito: "Meteo",
      impacto: "Evita daño por helada en el viñedo de Cultivo 04",
      esfuerzo: "moderado",
      confianza: 90,
      fuentes: ["Meteo", "Cultivos"],
      pasos: [
        "Preparar riego antihelada o quemadores para la madrugada del sábado.",
        "Avisar a la Cuadrilla A para turno de vigilancia nocturna.",
        "Confirmar la previsión el viernes por la tarde antes de activar.",
      ],
    });
  }

  // 2) Pulverización desaconsejada por viento, cruzada con el pulverizador.
  const viento = d.alertas.find((a) => /viento/i.test(a.titulo));
  if (viento) {
    accionables.push({
      id: "acc-viento",
      titulo: "Reprogramar la pulverización de Cultivo 11",
      resumen: `Viento sostenido en ${viento.detalle}. Pulverizar ahora provoca deriva y desperdicia producto; hay ventana con viento flojo a media semana.`,
      prioridad: "alta",
      ambito: "Meteo",
      impacto: "Evita deriva y pérdida de fitosanitario",
      esfuerzo: "rapido",
      confianza: 82,
      fuentes: ["Meteo", "Flota"],
      pasos: [
        "Posponer la pasada del Hardi Commander hasta la ventana de viento flojo.",
        "Reasignar la cuadrilla a una tarea de interior mientras tanto.",
        "Reactivar cuando el viento baje de 12 km/h.",
      ],
    });
  }

  // 3) Vehículos fuera de servicio / en mantenimiento.
  const fueraServicio = d.vehiculos.find((v) => /fuera de servicio/i.test(v.estado));
  const mantenimiento = d.vehiculos.find((v) => /mantenimiento/i.test(v.estado));
  if (fueraServicio) {
    accionables.push({
      id: "acc-cosechadora",
      titulo: `Resolver la ${fueraServicio.nombre} fuera de servicio`,
      resumen: `La ${fueraServicio.nombre} (${fueraServicio.tipo}, ${fueraServicio.horas} h motor) está fuera de servicio. Es la única cosechadora de la flota: un fallo aquí bloquea la campaña de recolección.`,
      prioridad: "critica",
      ambito: "Flota",
      impacto: "Restablece capacidad de cosecha antes de la ventana de recolección",
      esfuerzo: "alto",
      confianza: 84,
      fuentes: ["Flota"],
      pasos: [
        "Diagnosticar la avería y pedir presupuesto de reparación urgente.",
        "Valorar alquiler de cosechadora de respaldo si la reparación supera 48 h.",
        "Revisar el plan de recolección por si hay que reordenar cultivos.",
      ],
    });
  }
  if (mantenimiento) {
    accionables.push({
      id: "acc-mantenimiento",
      titulo: `Cerrar el mantenimiento del ${mantenimiento.nombre}`,
      resumen: `El ${mantenimiento.nombre} lleva ${mantenimiento.horas} h motor y está en mantenimiento. Devolverlo a operativo alivia la carga sobre los tractores activos.`,
      prioridad: "media",
      ambito: "Flota",
      impacto: "Recupera un tractor para la campaña en curso",
      esfuerzo: "moderado",
      confianza: 74,
      fuentes: ["Flota"],
      pasos: [
        "Confirmar repuestos y fecha de finalización con el taller.",
        "Planificar su reincorporación a las tareas de Cultivo 02.",
      ],
    });
  }

  // 4) Cobertura de cuadrillas: bajas y sin asignar.
  const baja = d.operarios.find((w) => /baja/i.test(w.estado));
  const sinAsignar = d.operarios.find((w) => /sin asignar/i.test(w.cuadrilla));
  if (baja || sinAsignar) {
    const detalle = [
      baja ? `${baja.nombre} está de baja en ${baja.cuadrilla}` : null,
      sinAsignar ? `${sinAsignar.nombre} sigue sin cuadrilla` : null,
    ]
      .filter(Boolean)
      .join(" y ");
    accionables.push({
      id: "acc-cuadrillas",
      titulo: "Reequilibrar cuadrillas para la semana",
      resumen: `${detalle}. Con la helada y la pulverización en juego, conviene cubrir los huecos antes del pico de trabajo.`,
      prioridad: "alta",
      ambito: "Cuadrillas",
      impacto: "Asegura mano de obra para las tareas críticas de la semana",
      esfuerzo: "rapido",
      confianza: 78,
      fuentes: ["Operarios"],
      pasos: [
        sinAsignar
          ? `Asignar a ${sinAsignar.nombre} a la cuadrilla con más carga.`
          : "Reasignar personal a la cuadrilla con más carga.",
        baja
          ? `Cubrir la baja de ${baja.nombre} con apoyo de otra cuadrilla.`
          : "Prever refuerzo para el turno de vigilancia nocturna.",
        "Publicar el parte de trabajo del día con la nueva distribución.",
      ],
    });
  }

  // 5) Ventana de siembra favorable.
  const siembra = d.alertas.find((a) => /siembra/i.test(a.titulo));
  if (siembra) {
    accionables.push({
      id: "acc-siembra",
      titulo: "Aprovechar la ventana de siembra de martes a jueves",
      resumen: `Ventana favorable en ${siembra.detalle}. Suelo en tempero y sin lluvia relevante hasta el viernes: es el mejor momento para sembrar sin compactar.`,
      prioridad: "media",
      ambito: "Operación",
      impacto: "Siembra en condiciones óptimas de suelo",
      esfuerzo: "moderado",
      confianza: 71,
      fuentes: ["Meteo", "Cultivos"],
      pasos: [
        "Programar la sembradora en Cultivos 01-03 de martes a jueves.",
        "Coordinar con el tractorista disponible de la Cuadrilla A.",
        "Cerrar la tarea antes de la lluvia prevista del viernes.",
      ],
    });
  }

  const criticas = accionables.filter((a) => a.prioridad === "critica").length;
  const titular =
    criticas > 0
      ? `${criticas} asunto${criticas > 1 ? "s" : ""} crítico${
          criticas > 1 ? "s" : ""
        } hoy: la helada del sábado y la cosechadora fuera de servicio encabezan la lista, con ${accionables.length} acciones en total.`
      : "La explotación está estable; estas son las acciones de mayor impacto para la semana.";

  return { titular, accionables: accionables.slice(0, 6) };
}

// ---------------------------------------------------------------------------
// Chat local del agente: relaciona la pregunta con el contexto y devuelve una
// respuesta útil y fundamentada. Suficiente para demostrar la experiencia sin
// conexión.
// ---------------------------------------------------------------------------

export function respuestaLocal(
  mensajes: MensajeChat[],
  accionables: Accionable[],
): string {
  const ultimo = [...mensajes].reverse().find((m) => m.role === "user");
  const q = (ultimo?.content ?? "").toLowerCase();
  const top = accionables[0];
  const incluye = (kw: string[]) => kw.some((k) => q.includes(k));

  if (incluye(["priori", "primero", "empez", "foco", "hoy", "importante"])) {
    const criticas = accionables.filter((a) => a.prioridad === "critica");
    const lista = (criticas.length ? criticas : accionables.slice(0, 2))
      .map((a, i) => `${i + 1}. **${a.titulo}** — ${a.impacto}.`)
      .join("\n");
    return `Empezaría por aquí:\n\n${lista}\n\nSon las de mayor impacto y no admiten espera por la meteo. ¿Quiero que prepare el parte de trabajo o asigne responsables?`;
  }

  if (incluye(["helada", "frío", "frio", "meteo", "tiempo", "lluvia", "viento"])) {
    return `El frente que viene marca la semana. El aviso crítico es la **helada de la madrugada del sábado en Cultivo 04** (viñedo en brotación), con mínimas de 10 °C el domingo. Además hay **viento sostenido en Cultivo 11** que desaconseja pulverizar.\n\nPlan: preparar riego antihelada y vigilancia nocturna para el sábado, y reprogramar la pasada del pulverizador a la ventana de viento flojo de mitad de semana.`;
  }

  if (incluye(["vehícul", "vehicul", "flota", "tractor", "cosechad", "máquina", "maquina", "mantenim"])) {
    return `Dos frentes en la flota:\n\n1. **Claas Lexion fuera de servicio** — es la única cosechadora; conviene diagnosticar y valorar un alquiler de respaldo si la reparación se alarga.\n2. **Kubota M7 en mantenimiento** (4.015 h) — cerrar el mantenimiento libera un tractor para Cultivo 02.\n\nEl resto de tractores está operativo, así que la prioridad clara es la cosechadora.`;
  }

  if (incluye(["operar", "cuadrill", "personal", "gente", "baja", "peón", "peon"])) {
    return `La cobertura de personal está justa esta semana: **Diego Salas está de baja** (Cuadrilla B) y **Julián Cid sigue sin asignar**. Con la helada y la pulverización en juego, cubriría los huecos ya: asignar a Julián a la cuadrilla con más carga y reforzar el turno de vigilancia nocturna del sábado.`;
  }

  if (incluye(["plan", "cómo", "como", "pasos", "prepara"]) && top) {
    return `Plan concreto para **${top.titulo}**:\n\n${top.pasos
      .map((s, i) => `${i + 1}. ${s}`)
      .join("\n")}\n\nImpacto esperado: ${top.impacto}. ¿Le asigno responsables o fecho la tarea?`;
  }

  if (incluye(["hola", "buenas", "qué puedes", "que puedes", "ayuda"])) {
    return `Hola, soy el agente de Hub. Veo todos los datos de la finca y las ${accionables.length} acciones que ha propuesto la IA. Pregúntame cosas como «¿por dónde empiezo?», «explícame el riesgo de helada» o «prepara un plan para la cosechadora».`;
  }

  return `Mirando toda la operación, el titular es: un frente frío trae **helada el sábado en Cultivo 04** mientras la **cosechadora Claas está fuera de servicio** justo antes de recolección.\n\nSi solo hicieras una cosa hoy: **${
    top?.titulo ?? "atender la acción prioritaria"
  }** — ${top?.impacto ?? "el mayor impacto disponible"}. Puedo priorizar, preparar un plan o entrar en cualquier módulo (meteo, flota, cuadrillas, cultivos).`;
}
