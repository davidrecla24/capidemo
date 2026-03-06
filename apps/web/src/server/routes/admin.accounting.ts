import { Hono } from 'hono';
import type { AppEnv } from '../env';

export const adminAccountingRoutes = new Hono<AppEnv>();

adminAccountingRoutes.get('/', async (c) => {
  // TODO: List accounting entries
  return c.json({ entries: [] });
});
