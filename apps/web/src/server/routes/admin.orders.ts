import { Hono } from 'hono';
import type { AppEnv } from '../env';

export const adminOrderRoutes = new Hono<AppEnv>();

adminOrderRoutes.get('/', async (c) => {
  // TODO: List all orders for admin
  return c.json({ orders: [] });
});

adminOrderRoutes.patch('/:id', async (c) => {
  // TODO: Update order status
  const id = c.req.param('id');
  return c.json({ message: 'Not implemented yet', id }, 501);
});
