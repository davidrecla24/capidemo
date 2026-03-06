import { z } from 'zod';

export const AdjustInventorySchema = z.object({
  skuId: z.string(),
  delta: z.number().int(),
  eventType: z.enum(['adjustment', 'restock', 'reservation', 'release', 'fulfillment']),
  note: z.string().optional(),
  orderId: z.string().optional(),
});

export type AdjustInventoryInput = z.infer<typeof AdjustInventorySchema>;
