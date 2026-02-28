import { z } from "zod";

// ── Auth ──
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ── Address ──
export const addressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  province: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().default("PH"),
});

// ── Order ──
export const orderStatusEnum = z.enum([
  "draft",
  "submitted",
  "paid",
  "provisioning",
  "shipped",
  "installed",
  "complete",
  "cancelled",
]);
export type OrderStatus = z.infer<typeof orderStatusEnum>;

export const createOrderSchema = z.object({
  planId: z.string().min(1),
  address: addressSchema,
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusEnum,
  note: z.string().optional(),
});

// ── Payment ──
export const simulatePaymentSchema = z.object({
  orderId: z.string().min(1),
  outcome: z.enum(["success", "fail"]),
});

// ── Inventory ──
export const adjustInventorySchema = z.object({
  sku: z.string().min(1),
  delta: z.number().int(),
  reason: z.string().min(1),
});

// ── Customer notes ──
export const addCustomerNoteSchema = z.object({
  note: z.string().min(1),
});

// ── Chat ──
export const chatMessageSchema = z.object({
  message: z.string().min(1),
  sessionId: z.string().optional(),
});
