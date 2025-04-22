import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../app';

describe('Health Check Endpoint', () => {
  let app: Express;

  beforeAll(async () => {
    app = await createApp();
  });

  it('should return 200 OK with health status', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'ok',
      database: {
        status: 'connected',
      },
      environment: expect.any(String),
      memory: {
        usage: expect.any(Object),
      },
      timestamp: expect.any(String),
      uptime: expect.any(Number),
    });
  });
}); 