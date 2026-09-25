import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * Connects the DataSource lazily instead of at module init, so a database
 * outage doesn't crash the whole app (on Vercel that surfaces as an opaque
 * 500 on every route). Callers that need the database await `connect()`.
 */
@Injectable()
export class DatabaseService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseService.name);
  private connecting?: Promise<DataSource>;

  constructor(private readonly dataSource: DataSource) {}

  onApplicationBootstrap() {
    // Warm up the connection without blocking startup.
    this.connect().catch(() => undefined);
  }

  connect(): Promise<DataSource> {
    if (this.dataSource.isInitialized) {
      return Promise.resolve(this.dataSource);
    }
    this.connecting ??= this.dataSource.initialize().catch((error: unknown) => {
      this.connecting = undefined;
      this.logger.error('Unable to connect to the database', error);
      throw error;
    });
    return this.connecting;
  }
}
