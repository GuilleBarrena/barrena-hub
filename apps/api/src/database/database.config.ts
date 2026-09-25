import { join } from 'node:path';
import type { TlsOptions } from 'node:tls';
import pg from 'pg';
import type { DataSourceOptions } from 'typeorm';

/** Environment variables read by {@link buildDataSourceOptions}. */
export const DATABASE_ENV_KEYS = [
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_NAME',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_SSL',
  'DATABASE_CA_CERT',
  'DATABASE_LOGGING',
] as const;

type DatabaseEnv = Partial<
  Record<(typeof DATABASE_ENV_KEYS)[number], string | undefined>
>;

/**
 * Shared Postgres (Supabase) options, used both by the Nest app
 * (`TypeOrmModule.forRootAsync`) and by the TypeORM CLI (`data-source.ts`).
 *
 * Paths point at compiled `.js` files: the CLI runs against `dist/`.
 */
export function buildDataSourceOptions(
  env: DatabaseEnv = process.env,
): DataSourceOptions {
  const missing = (
    ['DATABASE_HOST', 'DATABASE_USER', 'DATABASE_PASSWORD'] as const
  ).filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing database env vars: ${missing.join(', ')} (see apps/api/.env.example)`,
    );
  }

  return {
    type: 'postgres',
    // Passed explicitly (instead of letting TypeORM require it at runtime) so
    // bundlers such as Vercel's file tracer include `pg` in the function.
    driver: pg,
    host: env.DATABASE_HOST,
    port: Number(env.DATABASE_PORT ?? 5432),
    database: env.DATABASE_NAME ?? 'postgres',
    username: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    ssl: buildSsl(env),
    entities: [join(import.meta.dirname, '..', '**', '*.entity.js')],
    migrations: [join(import.meta.dirname, 'migrations', '*.js')],
    // Schema changes go through migrations only — never auto-sync against Supabase.
    synchronize: false,
    logging: env.DATABASE_LOGGING === 'true',
  };
}

function buildSsl(env: DatabaseEnv): false | TlsOptions {
  if (env.DATABASE_SSL === 'false') return false;
  // Supabase's CA certificate (Project Settings → Database → SSL). When provided
  // the server certificate is fully verified; otherwise the connection is
  // still encrypted but the certificate chain is not checked.
  const ca = env.DATABASE_CA_CERT?.replace(/\\n/g, '\n');
  return ca ? { ca } : { rejectUnauthorized: false };
}
