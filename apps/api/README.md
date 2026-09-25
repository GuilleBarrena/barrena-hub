# @barrena/api

Backend NestJS del monorepo.

```bash
# desde la raíz
npm run dev -- --filter=@barrena/api   # http://localhost:3002

# desde apps/api
npm run dev          # watch mode
npm run build        # compila a dist/
npm run start:prod   # node dist/main
npm test             # unit tests (vitest)
npm run test:e2e     # e2e tests
npm run lint         # oxlint
```

El puerto se configura con `PORT` (por defecto `3002`; `hub` usa 3000 y `landing` 3001).
