import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';

const adminToken = jwt.sign(
  { id: 'admin123', role: 'admin' },
  process.env.JWT_SECRET || 'secret'
);

describe('Admin Routes', () => {
  test('GET /api/admin/users (admin only)', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
