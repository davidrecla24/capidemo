import { Hono } from 'hono';
import type { AppEnv } from '../env';

export const trackingRoutes = new Hono<AppEnv>();

trackingRoutes.get('/:trackingCode', async (c) => {
  // TODO: Fetch tracking info
  const trackingCode = c.req.param('trackingCode');
  return c.json({ message: 'Not implemented yet', trackingCode }, 501);
});
