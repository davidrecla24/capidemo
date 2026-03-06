import * as jose from 'jose';

export interface SessionPayload {
  sub: string;
  email: string;
  role: 'customer' | 'admin';
}

export async function createSessionToken(
  payload: SessionPayload,
  secret: string,
): Promise<string> {
  const key = new TextEncoder().encode(secret);
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function verifySessionToken(
  token: string,
  secret: string,
): Promise<SessionPayload> {
  const key = new TextEncoder().encode(secret);
  const { payload } = await jose.jwtVerify(token, key);
  return payload as unknown as SessionPayload;
}

export function setSessionCookie(token: string): string {
  return `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`;
}

export function clearSessionCookie(): string {
  return 'session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';
}
