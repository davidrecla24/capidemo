import { Hono } from 'hono';
import type { AppEnv } from '../env';

export const orderRoutes = new Hono<AppEnv>();

orderRoutes.get('/:orderNumber', async (c) => {
  // TODO: Fetch order by order number
  const orderNumber = c.req.param('orderNumber');
  return c.json({ message: 'Not implemented yet', orderNumber }, 501);
});

orderRoutes.post('/', async (c) => {
  // TODO: Create new order
  return c.json({ message: 'Not implemented yet' }, 501);
});
