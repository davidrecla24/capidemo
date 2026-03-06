import { createMiddleware } from 'hono/factory';
import * as jose from 'jose';
import type { AppEnv } from '../env';

export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const cookie = c.req.header('cookie');
  const token = extractSessionToken(cookie);

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const secret = new TextEncoder().encode(c.env.SESSION_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    c.set('userId', payload.sub as string);
    c.set('userRole', payload.role as 'customer' | 'admin');
    await next();
  } catch {
    return c.json({ error: 'Invalid session' }, 401);
  }
});

export const adminMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  if (c.get('userRole') !== 'admin') {
    return c.json({ error: 'Forbidden' }, 403);
  }
  await next();
});

function extractSessionToken(cookie?: string): string | null {
  if (!cookie) return null;
  const match = cookie.match(/session=([^;]+)/);
  return match ? match[1] : null;
}
