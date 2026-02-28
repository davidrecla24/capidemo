import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { nanoid } from "nanoid";
import { eq, desc, like, and, gte, lte } from "drizzle-orm";
import { db } from "../db";
import {
  orders, orderEvents, inventoryItems, inventoryEvents,
  payments, users, customerNotes,
} from "../db/schema";
import { updateOrderStatusSchema, adjustInventorySchema, addCustomerNoteSchema } from "../../shared/schemas";
import { authMiddleware, adminMiddleware } from "./middleware";
import type { Env } from "../../env.d.ts";

type AdminEnv = {
  Bindings: Env;
  Variables: { userId: string; userRole: string };
};

const adminRouter = new Hono<AdminEnv>();

adminRouter.use("*", authMiddleware, adminMiddleware);

// ── Orders ──

// GET /api/admin/orders
adminRouter.get("/orders", async (c) => {
  const database = db(c.env.DB);
  const status = c.req.query("status");

  let query = database.select().from(orders).orderBy(desc(orders.createdAt));
  if (status) {
    const rows = await database.select().from(orders).where(eq(orders.status, status)).orderBy(desc(orders.createdAt));
    return c.json(rows);
  }
  const rows = await query;
  return c.json(rows);
});

// POST /api/admin/orders/:id/status
adminRouter.post("/orders/:id/status", zValidator("json", updateOrderStatusSchema), async (c) => {
  const adminId = c.get("userId");
  const orderId = c.req.param("id");
  const { status, note } = c.req.valid("json");
  const database = db(c.env.DB);

  const order = await database.select().from(orders).where(eq(orders.id, orderId)).get();
  if (!order) return c.json({ error: "Order not found" }, 404);

  await database.update(orders).set({ status, updatedAt: new Date().toISOString() }).where(eq(orders.id, orderId));

  await database.insert(orderEvents).values({
    id: nanoid(),
    orderId,
    status,
    note: note ?? `Status changed to ${status}`,
    createdBy: adminId,
  });

  // Broadcast to DO
  try {
    const doId = c.env.ORDER_UPDATES_DO.idFromName(orderId);
    const stub = c.env.ORDER_UPDATES_DO.get(doId);
    await stub.fetch(new Request("https://internal/broadcast", {
      method: "POST",
      body: JSON.stringify({ orderId, status, note }),
    }));
  } catch {
    // Non-critical
  }

  return c.json({ orderId, status });
});

// ── Inventory ──

// GET /api/admin/inventory
adminRouter.get("/inventory", async (c) => {
  const database = db(c.env.DB);
  const items = await database.select().from(inventoryItems);
  return c.json(items);
});

// POST /api/admin/inventory/adjust
adminRouter.post("/inventory/adjust", zValidator("json", adjustInventorySchema), async (c) => {
  const adminId = c.get("userId");
  const { sku, delta, reason } = c.req.valid("json");
  const database = db(c.env.DB);

  const item = await database.select().from(inventoryItems).where(eq(inventoryItems.sku, sku)).get();
  if (!item) return c.json({ error: "SKU not found" }, 404);

  const newQty = item.qtyAvailable + delta;
  if (newQty < 0) return c.json({ error: "Insufficient stock" }, 400);

  await database.update(inventoryItems).set({
    qtyAvailable: newQty,
    updatedAt: new Date().toISOString(),
  }).where(eq(inventoryItems.sku, sku));

  await database.insert(inventoryEvents).values({
    id: nanoid(),
    sku,
    delta,
    reason,
    createdBy: adminId,
  });

  return c.json({ sku, qtyAvailable: newQty });
});

// ── Accounting ──

// GET /api/admin/accounting
adminRouter.get("/accounting", async (c) => {
  const database = db(c.env.DB);
  const from = c.req.query("from");
  const to = c.req.query("to");

  let rows;
  if (from && to) {
    rows = await database.select().from(payments)
      .where(and(gte(payments.createdAt, from), lte(payments.createdAt, to)))
      .orderBy(desc(payments.createdAt));
  } else {
    rows = await database.select().from(payments).orderBy(desc(payments.createdAt));
  }

  return c.json(rows);
});

// ── Customers ──

// GET /api/admin/customers
adminRouter.get("/customers", async (c) => {
  const database = db(c.env.DB);
  const customerList = await database.select().from(users).where(eq(users.role, "customer"));
  return c.json(customerList);
});

// POST /api/admin/customers/:id/note
adminRouter.post("/customers/:id/note", zValidator("json", addCustomerNoteSchema), async (c) => {
  const adminId = c.get("userId");
  const userId = c.req.param("id");
  const { note } = c.req.valid("json");
  const database = db(c.env.DB);

  const user = await database.select().from(users).where(eq(users.id, userId)).get();
  if (!user) return c.json({ error: "User not found" }, 404);

  await database.insert(customerNotes).values({
    id: nanoid(),
    userId,
    note,
    createdBy: adminId,
  });

  return c.json({ success: true }, 201);
});

export default adminRouter;
