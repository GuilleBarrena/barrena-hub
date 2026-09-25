import { ServiceUnavailableException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  it('reports the database as up', async () => {
    const database = {
      connect: async () => ({ query: async () => [{ '?column?': 1 }] }),
    } as unknown as DatabaseService;

    await expect(new HealthController(database).check()).resolves.toEqual({
      status: 'ok',
      database: 'up',
    });
  });

  it('returns 503 with the connection error when the database is down', async () => {
    const error = Object.assign(new Error('connect ECONNREFUSED'), {
      code: 'ECONNREFUSED',
    });
    const database = {
      connect: async () => Promise.reject(error),
    } as unknown as DatabaseService;

    const result = new HealthController(database).check();
    await expect(result).rejects.toBeInstanceOf(ServiceUnavailableException);
    await expect(result).rejects.toMatchObject({
      response: {
        database: 'down',
        error: { code: 'ECONNREFUSED', message: 'connect ECONNREFUSED' },
      },
    });
  });
});
