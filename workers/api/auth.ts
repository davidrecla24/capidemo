import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { SignJWT, jwtVerify } from "jose";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { registerSchema, loginSchema } from "../../shared/schemas";
import type { Env } from "../../env.d.ts";

const auth = new Hono<{ Bindings: Env }>();

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function createJwt(userId: string, role: string, secret: string): Promise<string> {
  const key = new TextEncoder().encode(secret);
  return new SignJWT({ sub: userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyJwt(token: string, secret: string) {
  const key = new TextEncoder().encode(secret);
  const { payload } = await jwtVerify(token, key);
  return payload as { sub: string; role: string };
}

// POST /api/auth/register
auth.post("/register", zValidator("json", registerSchema), async (c) => {
  const { email, password } = c.req.valid("json");
  const database = db(c.env.DB);

  const existing = await database.select().from(users).where(eq(users.email, email)).get();
  if (existing) {
    return c.json({ error: "Email already registered" }, 409);
  }

  const id = nanoid();
  const passwordHash = await hashPassword(password);

  await database.insert(users).values({ id, email, passwordHash, role: "customer" });

  const token = await createJwt(id, "customer", c.env.JWT_SECRET);

  return c.json({ token, user: { id, email, role: "customer" } }, 201);
});

// POST /api/auth/login
auth.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");
  const database = db(c.env.DB);

  const user = await database.select().from(users).where(eq(users.email, email)).get();
  if (!user) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const passwordHash = await hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = await createJwt(user.id, user.role, c.env.JWT_SECRET);

  return c.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

// GET /api/auth/me
auth.get("/me", async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const payload = await verifyJwt(authHeader.slice(7), c.env.JWT_SECRET);
    const database = db(c.env.DB);
    const user = await database.select().from(users).where(eq(users.id, payload.sub)).get();
    if (!user) return c.json({ error: "User not found" }, 404);
    return c.json({ id: user.id, email: user.email, role: user.role });
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
});

export default auth;
