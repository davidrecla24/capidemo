import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// ── Users ──
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["customer", "admin"] }).notNull().default("customer"),
  createdAt: text("created_at").notNull().default("(datetime('now'))"),
});

// ── Plans ──
export const plans = sqliteTable("plans", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  speedMbps: integer("speed_mbps").notNull(),
  priceMonthly: real("price_monthly").notNull(),
  promoText: text("promo_text"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

// ── Addresses ──
export const addresses = sqliteTable("addresses", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  province: text("province").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull().default("PH"),
  validated: integer("validated", { mode: "boolean" }).notNull().default(false),
  validationProvider: text("validation_provider"),
  validationPayloadJson: text("validation_payload_json"),
});

// ── Orders ──
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  planId: text("plan_id").notNull().references(() => plans.id),
  addressId: text("address_id").notNull().references(() => addresses.id),
  status: text("status", {
    enum: ["draft", "submitted", "paid", "provisioning", "shipped", "installed", "complete", "cancelled"],
  }).notNull().default("draft"),
  createdAt: text("created_at").notNull().default("(datetime('now'))"),
  updatedAt: text("updated_at").notNull().default("(datetime('now'))"),
});

// ── Order Events ──
export const orderEvents = sqliteTable("order_events", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id),
  status: text("status").notNull(),
  note: text("note"),
  createdAt: text("created_at").notNull().default("(datetime('now'))"),
  createdBy: text("created_by"),
});

// ── Inventory Items ──
export const inventoryItems = sqliteTable("inventory_items", {
  id: text("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  qtyAvailable: integer("qty_available").notNull().default(0),
  qtyReserved: integer("qty_reserved").notNull().default(0),
  location: text("location"),
  updatedAt: text("updated_at").notNull().default("(datetime('now'))"),
});

// ── Inventory Events ──
export const inventoryEvents = sqliteTable("inventory_events", {
  id: text("id").primaryKey(),
  sku: text("sku").notNull(),
  delta: integer("delta").notNull(),
  reason: text("reason").notNull(),
  createdAt: text("created_at").notNull().default("(datetime('now'))"),
  createdBy: text("created_by"),
});

// ── Payments ──
export const payments = sqliteTable("payments", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id),
  amount: real("amount").notNull(),
  currency: text("currency").notNull().default("PHP"),
  method: text("method").notNull().default("simulated"),
  status: text("status", { enum: ["initiated", "success", "failed"] }).notNull().default("initiated"),
  providerPayloadJson: text("provider_payload_json"),
  createdAt: text("created_at").notNull().default("(datetime('now'))"),
});

// ── Customer Notes ──
export const customerNotes = sqliteTable("customer_notes", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  note: text("note").notNull(),
  createdAt: text("created_at").notNull().default("(datetime('now'))"),
  createdBy: text("created_by"),
});
