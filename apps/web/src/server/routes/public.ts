import { Hono } from 'hono';
import type { AppEnv } from '../env';

export const publicRoutes = new Hono<AppEnv>();

publicRoutes.get('/health', (c) => {
  return c.json({ status: 'ok' });
});
