import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly database: DatabaseService) {}

  @Get()
  async check() {
    try {
      const dataSource = await this.database.connect();
      await dataSource.query('SELECT 1');
      return { status: 'ok', database: 'up' };
    } catch (error) {
      const { code, message } = error as { code?: string; message?: string };
      throw new ServiceUnavailableException({
        status: 'error',
        database: 'down',
        error: { code, message },
      });
    }
  }
}
