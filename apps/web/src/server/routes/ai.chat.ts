import { Hono } from 'hono';
import type { AppEnv } from '../env';

export const aiChatRoutes = new Hono<AppEnv>();

aiChatRoutes.post('/customer-chat', async (c) => {
  // TODO: Customer AI assistant
  return c.json({ message: 'Not implemented yet' }, 501);
});

aiChatRoutes.post('/admin-chat', async (c) => {
  // TODO: Admin AI copilot
  return c.json({ message: 'Not implemented yet' }, 501);
});
