import { existsSync } from 'node:fs';
import { DataSource } from 'typeorm';
import { buildDataSourceOptions } from './database.config.js';

// Entry point for the TypeORM CLI (`npm run typeorm -- ...`), which runs outside
// Nest and therefore outside ConfigModule.
if (existsSync('.env')) process.loadEnvFile('.env');

export default new DataSource(buildDataSourceOptions());
