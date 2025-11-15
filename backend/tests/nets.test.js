import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/user.model.js';
import jwt from 'jsonwebtoken';

function createAdminToken() {
  return jwt.sign(
    { id: 'admin123', role: 'admin', email: 'admin@test.com' },
    process.env.JWT_SECRET || 'secret'
  );
}

describe('Nets Controller', () => {
  test('List nets', async () => {
    const res = await request(app).get('/api/nets');
    expect(res.statusCode).toBe(200);
  });

  test('Create net (admin only)', async () => {
    const token = createAdminToken();

    const res = await request(app)
      .post('/api/nets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Net A', capacity: 3 });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Net A');
  });
});
