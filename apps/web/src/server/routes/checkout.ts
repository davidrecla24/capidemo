import { Hono } from 'hono';
import type { AppEnv } from '../env';

export const checkoutRoutes = new Hono<AppEnv>();

checkoutRoutes.post('/simulate-payment', async (c) => {
  // TODO: Implement simulated payment
  return c.json({ message: 'Not implemented yet' }, 501);
});
