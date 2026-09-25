import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  buildDataSourceOptions,
  DATABASE_ENV_KEYS,
} from './database.config.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...buildDataSourceOptions(
          Object.fromEntries(
            DATABASE_ENV_KEYS.map((key) => [key, config.get<string>(key)]),
          ),
        ),
        // Entities registered via TypeOrmModule.forFeature() are picked up
        // automatically, so the glob above is only needed by the CLI.
        entities: [],
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
