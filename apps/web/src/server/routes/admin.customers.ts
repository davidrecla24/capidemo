import { Hono } from 'hono';
import type { AppEnv } from '../env';

export const adminCustomerRoutes = new Hono<AppEnv>();

adminCustomerRoutes.get('/', async (c) => {
  // TODO: List customers
  return c.json({ customers: [] });
});
