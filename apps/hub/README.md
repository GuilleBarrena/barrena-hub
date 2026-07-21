This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Capa de IA — acciones recomendadas

Hub incluye una capa de IA que lee **todos los datos de la explotación**
(meteo, parcelas, flota y cuadrillas) y los convierte en una lista corta de
**acciones priorizadas**, con impacto, esfuerzo, confianza y pasos concretos.
También hay un **agente** con el que conversar sobre cada acción.

Dónde vive:

- `src/lib/actionables/engine.ts` — el núcleo: `generarAccionables()` y
  `chatConAgente()`.
- `src/lib/actionables/context.ts` — reúne todas las fuentes de entrada en un
  único contexto que razona el modelo.
- `src/lib/actionables/mock.ts` — motor local determinista de reserva.
- API: `POST /api/actionables` y `POST /api/agent`.
- UI: el panel de acciones en `/dashboard` (Inicio) y el chat en
  `/dashboard/agent`.

### Con o sin clave de API

Si está definida `ANTHROPIC_API_KEY`, la capa usa **Claude** para razonar sobre
los datos. Si no, un **motor local determinista** produce acciones sensatas y
respuestas de chat fundamentadas, de modo que todo el producto funciona de
extremo a extremo sin conexión. La interfaz muestra una insignia **IA en vivo**
o **Motor local** para dejar claro qué ruta se ejecutó.

```bash
# .env.local (opcional, para IA en vivo)
ANTHROPIC_API_KEY=sk-ant-...
# HUB_AI_MODEL=claude-sonnet-5   # opcional, para cambiar de modelo
```

Las fuentes de datos son de muestra (`src/lib/sample-data.ts` y los `seed.ts`
de cada dominio). Sustitúyalas por integraciones reales y la capa de IA, el
panel y el agente funcionan sin cambios.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
