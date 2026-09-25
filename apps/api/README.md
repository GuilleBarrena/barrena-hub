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

## Base de datos (Supabase + TypeORM)

Copia `.env.example` a `.env` y rellena las variables `DATABASE_*` con los datos del session pooler de Supabase (puerto 5432). `DATABASE_PASSWORD` es la única sensible: guárdala como secret; el resto pueden ser variables normales. `GET /health` comprueba la conexión.

- Configuración compartida: `src/database/database.config.ts` (la usan la app y el CLI).
- `synchronize` está desactivado: el esquema solo cambia con migraciones en `src/database/migrations`.
- Registra las entidades en su módulo con `TypeOrmModule.forFeature([...])` (`autoLoadEntities` está activo). Nombra los ficheros `*.entity.ts` para que el CLI las encuentre.

```bash
npm run migration:generate -- src/database/migrations/NombreCambio  # a partir de las entidades
npm run migration:create -- src/database/migrations/NombreCambio    # vacía
npm run migration:run
npm run migration:revert
npm run migration:show
```

Los tests e2e necesitan una base de datos accesible con esas variables.
