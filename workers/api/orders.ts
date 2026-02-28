import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { orders, orderEvents, addresses, plans } from "../db/schema";
import { createOrderSchema } from "../../shared/schemas";
import { StubProvider } from "../services/address-validation";
import { authMiddleware } from "./middleware";
import type { Env } from "../../env.d.ts";

type OrderEnv = {
  Bindings: Env;
  Variables: { userId: string; userRole: string };
};

const ordersRouter = new Hono<OrderEnv>();

ordersRouter.use("*", authMiddleware);

// POST /api/orders — create order
ordersRouter.post("/", zValidator("json", createOrderSchema), async (c) => {
  const userId = c.get("userId");
  const { planId, address } = c.req.valid("json");
  const database = db(c.env.DB);

  const plan = await database.select().from(plans).where(eq(plans.id, planId)).get();
  if (!plan) return c.json({ error: "Plan not found" }, 404);

  const provider = new StubProvider();
  const validation = await provider.validate(address);

  const addressId = nanoid();
  await database.insert(addresses).values({
    id: addressId,
    userId,
    line1: validation.normalized.line1,
    line2: validation.normalized.line2 ?? null,
    city: validation.normalized.city,
    province: validation.normalized.province,
    postalCode: validation.normalized.postalCode,
    country: validation.normalized.country,
    validated: validation.valid,
    validationProvider: "stub",
    validationPayloadJson: JSON.stringify(validation.metadata),
  });

  const orderId = nanoid();
  await database.insert(orders).values({
    id: orderId,
    userId,
    planId,
    addressId,
    status: "submitted",
  });

  const eventId = nanoid();
  await database.insert(orderEvents).values({
    id: eventId,
    orderId,
    status: "submitted",
    note: "Order created",
    createdBy: userId,
  });

  return c.json({ id: orderId, status: "submitted", addressValidated: validation.valid }, 201);
});

// GET /api/orders/:id
ordersRouter.get("/:id", async (c) => {
  const userId = c.get("userId");
  const role = c.get("userRole");
  const orderId = c.req.param("id");
  const database = db(c.env.DB);

  const order = await database.select().from(orders).where(eq(orders.id, orderId)).get();
  if (!order) return c.json({ error: "Order not found" }, 404);
  if (role !== "admin" && order.userId !== userId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const events = await database
    .select()
    .from(orderEvents)
    .where(eq(orderEvents.orderId, orderId));

  return c.json({ ...order, events });
});

// GET /api/orders/:id/stream — SSE for order updates
ordersRouter.get("/:id/stream", async (c) => {
  const orderId = c.req.param("id");
  const doId = c.env.ORDER_UPDATES_DO.idFromName(orderId);
  const stub = c.env.ORDER_UPDATES_DO.get(doId);

  const url = new URL(c.req.url);
  url.pathname = "/subscribe";
  const req = new Request(url.toString(), { headers: c.req.raw.headers });
  return stub.fetch(req);
});

export default ordersRouter;
