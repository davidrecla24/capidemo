import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { plans } from "../db/schema";
import type { Env } from "../../env.d.ts";

const plansRouter = new Hono<{ Bindings: Env }>();

// GET /api/plans — list active plans
plansRouter.get("/", async (c) => {
  const database = db(c.env.DB);
  const activePlans = await database
    .select()
    .from(plans)
    .where(eq(plans.isActive, true));
  return c.json(activePlans);
});

export default plansRouter;
