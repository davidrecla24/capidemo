import { Hono } from "hono";
import { nanoid } from "nanoid";
import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import {
  orders, orderEvents, inventoryItems, inventoryEvents,
  payments, users, customerNotes,
} from "../db/schema";
import { authMiddleware, adminMiddleware } from "../api/middleware";
import type { Env } from "../../env.d.ts";

type McpEnv = {
  Bindings: Env;
  Variables: { userId: string; userRole: string };
};

const mcpAdmin = new Hono<McpEnv>();

mcpAdmin.use("*", authMiddleware, adminMiddleware);

// MCP tool: listOrders
mcpAdmin.post("/tools/listOrders", async (c) => {
  const { status, limit } = await c.req.json() as { status?: string; limit?: number };
  const database = db(c.env.DB);

  let rows;
  if (status) {
    rows = await database.select().from(orders).where(eq(orders.status, status)).orderBy(desc(orders.createdAt)).limit(limit ?? 50);
  } else {
    rows = await database.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit ?? 50);
  }
  return c.json({ result: rows });
});

// MCP tool: getOrder
mcpAdmin.post("/tools/getOrder", async (c) => {
  const { orderId } = await c.req.json() as { orderId: string };
  const database = db(c.env.DB);

  const order = await database.select().from(orders).where(eq(orders.id, orderId)).get();
  if (!order) return c.json({ error: "Order not found" }, 404);

  const events = await database.select().from(orderEvents).where(eq(orderEvents.orderId, orderId));
  return c.json({ result: { ...order, events } });
});

// MCP tool: updateOrderStatus
mcpAdmin.post("/tools/updateOrderStatus", async (c) => {
  const adminId = c.get("userId");
  const { orderId, status, note } = await c.req.json() as { orderId: string; status: string; note?: string };
  const database = db(c.env.DB);

  await database.update(orders).set({ status, updatedAt: new Date().toISOString() }).where(eq(orders.id, orderId));
  await database.insert(orderEvents).values({
    id: nanoid(), orderId, status, note: note ?? `MCP: Status → ${status}`, createdBy: adminId,
  });

  return c.json({ result: { orderId, status } });
});

// MCP tool: listInventory
mcpAdmin.post("/tools/listInventory", async (c) => {
  const { sku, lowStockOnly } = await c.req.json() as { sku?: string; lowStockOnly?: boolean };
  const database = db(c.env.DB);

  let rows;
  if (sku) {
    rows = await database.select().from(inventoryItems).where(eq(inventoryItems.sku, sku));
  } else {
    rows = await database.select().from(inventoryItems);
  }

  if (lowStockOnly) {
    rows = rows.filter((r) => r.qtyAvailable < 10);
  }

  return c.json({ result: rows });
});

// MCP tool: adjustInventory
mcpAdmin.post("/tools/adjustInventory", async (c) => {
  const adminId = c.get("userId");
  const { sku, delta, reason } = await c.req.json() as { sku: string; delta: number; reason: string };
  const database = db(c.env.DB);

  const item = await database.select().from(inventoryItems).where(eq(inventoryItems.sku, sku)).get();
  if (!item) return c.json({ error: "SKU not found" }, 404);

  const newQty = item.qtyAvailable + delta;
  await database.update(inventoryItems).set({ qtyAvailable: newQty, updatedAt: new Date().toISOString() }).where(eq(inventoryItems.sku, sku));
  await database.insert(inventoryEvents).values({ id: nanoid(), sku, delta, reason, createdBy: adminId });

  return c.json({ result: { sku, qtyAvailable: newQty } });
});

// MCP tool: getCustomer
mcpAdmin.post("/tools/getCustomer", async (c) => {
  const { emailOrId } = await c.req.json() as { emailOrId: string };
  const database = db(c.env.DB);

  let user = await database.select().from(users).where(eq(users.id, emailOrId)).get();
  if (!user) {
    user = await database.select().from(users).where(eq(users.email, emailOrId)).get();
  }
  if (!user) return c.json({ error: "Customer not found" }, 404);

  const notes = await database.select().from(customerNotes).where(eq(customerNotes.userId, user.id));
  return c.json({ result: { ...user, notes } });
});

// MCP tool: addCustomerNote
mcpAdmin.post("/tools/addCustomerNote", async (c) => {
  const adminId = c.get("userId");
  const { userId, note } = await c.req.json() as { userId: string; note: string };
  const database = db(c.env.DB);

  await database.insert(customerNotes).values({ id: nanoid(), userId, note, createdBy: adminId });
  return c.json({ result: { success: true } });
});

// MCP tool: listPayments
mcpAdmin.post("/tools/listPayments", async (c) => {
  const database = db(c.env.DB);
  const rows = await database.select().from(payments).orderBy(desc(payments.createdAt)).limit(100);
  return c.json({ result: rows });
});

export default mcpAdmin;
