import { join } from 'node:path';
import type { TlsOptions } from 'node:tls';
import type { DataSourceOptions } from 'typeorm';

/**
 * Shared Postgres (Supabase) options, used both by the Nest app
 * (`TypeOrmModule.forRootAsync`) and by the TypeORM CLI (`data-source.ts`).
 *
 * Paths point at compiled `.js` files: the CLI runs against `dist/`.
 */
export function buildDataSourceOptions(
  env: NodeJS.ProcessEnv = process.env,
): DataSourceOptions {
  const url = env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set (see apps/api/.env.example)');
  }

  return {
    type: 'postgres',
    url,
    ssl: buildSsl(env),
    entities: [join(import.meta.dirname, '..', '**', '*.entity.js')],
    migrations: [join(import.meta.dirname, 'migrations', '*.js')],
    // Schema changes go through migrations only — never auto-sync against Supabase.
    synchronize: false,
    logging: env.DATABASE_LOGGING === 'true',
  };
}

function buildSsl(env: NodeJS.ProcessEnv): false | TlsOptions {
  if (env.DATABASE_SSL === 'false') return false;
  // Supabase's CA certificate (Project Settings → Database → SSL). When provided
  // the server certificate is fully verified; otherwise the connection is
  // still encrypted but the certificate chain is not checked.
  const ca = env.DATABASE_CA_CERT?.replace(/\\n/g, '\n');
  return ca ? { ca } : { rejectUnauthorized: false };
}
