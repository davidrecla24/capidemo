import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { orders, orderEvents, payments, plans } from "../db/schema";
import { simulatePaymentSchema } from "../../shared/schemas";
import { authMiddleware } from "./middleware";
import type { Env } from "../../env.d.ts";

type PayEnv = {
  Bindings: Env;
  Variables: { userId: string; userRole: string };
};

const paymentsRouter = new Hono<PayEnv>();

paymentsRouter.use("*", authMiddleware);

// POST /api/payments/simulate
paymentsRouter.post("/simulate", zValidator("json", simulatePaymentSchema), async (c) => {
  const userId = c.get("userId");
  const { orderId, outcome } = c.req.valid("json");
  const database = db(c.env.DB);

  const order = await database.select().from(orders).where(eq(orders.id, orderId)).get();
  if (!order) return c.json({ error: "Order not found" }, 404);
  if (order.userId !== userId && c.get("userRole") !== "admin") {
    return c.json({ error: "Forbidden" }, 403);
  }

  const plan = await database.select().from(plans).where(eq(plans.id, order.planId)).get();
  const amount = plan?.priceMonthly ?? 0;

  const paymentId = nanoid();
  const status = outcome === "success" ? "success" : "failed";

  await database.insert(payments).values({
    id: paymentId,
    orderId,
    amount,
    currency: "PHP",
    method: "simulated",
    status,
    providerPayloadJson: JSON.stringify({ outcome, simulatedAt: new Date().toISOString() }),
  });

  if (outcome === "success") {
    await database.update(orders).set({ status: "paid", updatedAt: new Date().toISOString() }).where(eq(orders.id, orderId));

    await database.insert(orderEvents).values({
      id: nanoid(),
      orderId,
      status: "paid",
      note: "Payment successful (simulated)",
      createdBy: userId,
    });

    // Notify OrderUpdatesDO
    try {
      const doId = c.env.ORDER_UPDATES_DO.idFromName(orderId);
      const stub = c.env.ORDER_UPDATES_DO.get(doId);
      await stub.fetch(new Request("https://internal/broadcast", {
        method: "POST",
        body: JSON.stringify({ orderId, status: "paid", note: "Payment successful" }),
      }));
    } catch {
      // Non-critical: DO broadcast failure
    }
  }

  return c.json({ paymentId, status, amount });
});

export default paymentsRouter;
