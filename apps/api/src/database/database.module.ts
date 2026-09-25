import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildDataSourceOptions } from './database.config.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...buildDataSourceOptions({
          DATABASE_URL: config.get('DATABASE_URL'),
          DATABASE_SSL: config.get('DATABASE_SSL'),
          DATABASE_CA_CERT: config.get('DATABASE_CA_CERT'),
          DATABASE_LOGGING: config.get('DATABASE_LOGGING'),
        }),
        // Entities registered via TypeOrmModule.forFeature() are picked up
        // automatically, so the glob above is only needed by the CLI.
        entities: [],
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
