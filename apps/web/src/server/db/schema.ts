import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  role: text('role', { enum: ['customer', 'admin'] }).notNull().default('customer'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

export const addresses = sqliteTable('addresses', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  line1: text('line1').notNull(),
  line2: text('line2'),
  city: text('city').notNull(),
  stateProvince: text('state_province').notNull(),
  postalCode: text('postal_code').notNull(),
  countryCode: text('country_code').notNull().default('PH'),
  formattedAddress: text('formatted_address'),
  googlePlaceId: text('google_place_id_or_validation_id'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  isValidated: integer('is_validated', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
});

export const skus = sqliteTable('skus', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id),
  code: text('code').notNull().unique(),
  label: text('label').notNull(),
  weightKg: real('weight_kg').notNull(),
  priceMinor: integer('price_minor').notNull(),
  currency: text('currency').notNull().default('PHP'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
});

export const inventoryLots = sqliteTable('inventory_lots', {
  id: text('id').primaryKey(),
  skuId: text('sku_id').notNull().references(() => skus.id),
  quantityOnHand: integer('quantity_on_hand').notNull().default(0),
  quantityReserved: integer('quantity_reserved').notNull().default(0),
  reorderThreshold: integer('reorder_threshold').notNull().default(10),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

export const inventoryLedger = sqliteTable('inventory_ledger', {
  id: text('id').primaryKey(),
  skuId: text('sku_id').notNull().references(() => skus.id),
  orderId: text('order_id'),
  eventType: text('event_type').notNull(),
  delta: integer('delta').notNull(),
  note: text('note'),
  actorUserId: text('actor_user_id'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  addressId: text('address_id').references(() => addresses.id),
  orderNumber: text('order_number').notNull().unique(),
  status: text('status').notNull().default('pending'),
  subtotalMinor: integer('subtotal_minor').notNull(),
  shippingMinor: integer('shipping_minor').notNull().default(0),
  totalMinor: integer('total_minor').notNull(),
  currency: text('currency').notNull().default('PHP'),
  paymentStatus: text('payment_status').notNull().default('unpaid'),
  paymentProvider: text('payment_provider').default('simulation'),
  trackingCode: text('tracking_code'),
  trackingStatus: text('tracking_status'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  skuId: text('sku_id').notNull().references(() => skus.id),
  quantity: integer('quantity').notNull(),
  unitPriceMinor: integer('unit_price_minor').notNull(),
  lineTotalMinor: integer('line_total_minor').notNull(),
});

export const payments = sqliteTable('payments', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  provider: text('provider').notNull().default('simulation'),
  providerRef: text('provider_ref'),
  status: text('status').notNull(),
  amountMinor: integer('amount_minor').notNull(),
  paidAt: text('paid_at'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const accountingEntries = sqliteTable('accounting_entries', {
  id: text('id').primaryKey(),
  orderId: text('order_id'),
  paymentId: text('payment_id'),
  entryType: text('entry_type').notNull(),
  amountMinor: integer('amount_minor').notNull(),
  currency: text('currency').notNull().default('PHP'),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const chatThreads = sqliteTable('chat_threads', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  channel: text('channel', { enum: ['customer', 'admin'] }).notNull(),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

export const chatMessages = sqliteTable('chat_messages', {
  id: text('id').primaryKey(),
  threadId: text('thread_id').notNull().references(() => chatThreads.id),
  role: text('role', { enum: ['system', 'user', 'assistant', 'tool'] }).notNull(),
  content: text('content').notNull(),
  metadataJson: text('metadata_json'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  actorUserId: text('actor_user_id'),
  area: text('area').notNull(),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  payloadJson: text('payload_json'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});
