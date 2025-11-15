import request from 'supertest';
import app from '../src/app.js';

describe('Health Check', () => {
  test('GET /healthz', async () => {
    const res = await request(app).get('/healthz');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
