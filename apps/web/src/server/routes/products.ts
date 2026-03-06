import { Hono } from 'hono';
import type { AppEnv } from '../env';

export const productRoutes = new Hono<AppEnv>();

productRoutes.get('/', async (c) => {
  // TODO: Fetch products from D1 via Drizzle
  return c.json({ products: [] });
});
