<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Monorepo — this is a Turborepo

This repo (`barrena-webclients`) is an npm-workspaces + Turborepo monorepo:

- `apps/*` — deployable Next.js apps (`hub`, `landing`). App-only code lives here.
- `packages/*` — shared libraries. `@barrena/ui` holds the design system.

## Shared-UI rule

**Any design token, style, or UI component used by — or reasonably reusable across — more than one app MUST live in `@barrena/ui`, never be copy-pasted between apps.**

- Design tokens, the Tailwind `@theme` map, the dark variant, and the base layer live in `@barrena/ui/theme.css`. Each app's `globals.css` imports it (`@import "@barrena/ui/theme.css";`) and adds only app-specific CSS.
- Shared components are individual files exported from `packages/ui` (e.g. `@barrena/ui/button`, `@barrena/ui/section-eyebrow`, `@barrena/ui/wordmark`). Add a matching entry to the `exports` map in `packages/ui/package.json`.
- Before hand-rolling a nav/footer, brand lockup, section label, button, or similar primitive, check `packages/ui/src` first and reuse what's there.
- When you notice the same markup pattern in two apps, extract it to `@barrena/ui` rather than duplicating.
- `@barrena/ui` ships raw `.tsx`; consuming apps already list it in `transpilePackages`. Tailwind scans the package via the `@source "."` in `theme.css`, so its utility classes compile with no extra config.
- Keep app-specific, non-reusable UI inside the app (e.g. `landing`'s `vineyard-visual`, `hub`'s dashboard/product surface). Don't push those into the shared lib.
