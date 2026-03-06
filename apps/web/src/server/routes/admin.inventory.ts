import { Hono } from 'hono';
import type { AppEnv } from '../env';

export const adminInventoryRoutes = new Hono<AppEnv>();

adminInventoryRoutes.get('/', async (c) => {
  // TODO: List inventory
  return c.json({ inventory: [] });
});

adminInventoryRoutes.post('/adjust', async (c) => {
  // TODO: Adjust inventory
  return c.json({ message: 'Not implemented yet' }, 501);
});
