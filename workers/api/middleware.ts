import { createMiddleware } from "hono/factory";
import { verifyJwt } from "./auth";
import type { Env } from "../../env.d.ts";

type AuthEnv = {
  Bindings: Env;
  Variables: { userId: string; userRole: string };
};

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const payload = await verifyJwt(authHeader.slice(7), c.env.JWT_SECRET);
    c.set("userId", payload.sub);
    c.set("userRole", payload.role);
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
});

export const adminMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const role = c.get("userRole");
  if (role !== "admin") {
    return c.json({ error: "Forbidden" }, 403);
  }
  await next();
});
