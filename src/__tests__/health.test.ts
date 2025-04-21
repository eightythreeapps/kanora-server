import request from 'supertest';
import express from 'express';
import { setupRoutes } from '../routes';

describe('Health Check Endpoint', () => {
  const app = express();
  app.use('/api/v1', setupRoutes());

  it('should return 200 OK with status message', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
}); 