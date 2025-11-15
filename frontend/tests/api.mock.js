import { setupServer } from 'msw/node';
import { rest } from 'msw';

const API = 'http://localhost:8080/api';

export const handlers = [
  // Mock login
  rest.post(`${API}/auth/login`, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'mock.token.value',
        user: { id: '123', role: 'user', email: 'test@example.com' },
      })
    );
  }),

  // Mock nets API
  rest.get(`${API}/nets`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: '1', name: 'Net A', capacity: 2 },
        { id: '2', name: 'Net B', capacity: 3 },
      ])
    );
  }),

  // Mock availability if needed later
  rest.get(`${API}/availability`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),
];

export const server = setupServer(...handlers);
