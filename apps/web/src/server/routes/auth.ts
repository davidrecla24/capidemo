import { Hono } from 'hono';
import type { AppEnv } from '../env';

export const authRoutes = new Hono<AppEnv>();

authRoutes.post('/request-code', async (c) => {
  // TODO: Implement magic code request
  return c.json({ message: 'Not implemented yet' }, 501);
});

authRoutes.post('/verify-code', async (c) => {
  // TODO: Implement magic code verification
  return c.json({ message: 'Not implemented yet' }, 501);
});
