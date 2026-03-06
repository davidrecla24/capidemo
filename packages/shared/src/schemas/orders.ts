import { z } from 'zod';

export const OrderStatusEnum = z.enum([
  'pending',
  'pending_payment',
  'paid',
  'fulfilled',
  'shipped',
  'delivered',
  'cancelled',
]);

export const PaymentStatusEnum = z.enum(['unpaid', 'paid', 'refunded']);

export const CreateOrderItemSchema = z.object({
  skuId: z.string(),
  quantity: z.number().int().positive(),
});

export const CreateOrderSchema = z.object({
  addressId: z.string(),
  items: z.array(CreateOrderItemSchema).min(1),
});

export const UpdateOrderStatusSchema = z.object({
  status: OrderStatusEnum,
});

export type OrderStatus = z.infer<typeof OrderStatusEnum>;
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;
