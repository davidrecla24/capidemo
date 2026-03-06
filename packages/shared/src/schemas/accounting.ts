import { z } from 'zod';

export const AccountingEntrySchema = z.object({
  orderId: z.string().optional(),
  paymentId: z.string().optional(),
  entryType: z.enum(['payment_received', 'refund', 'adjustment', 'revenue']),
  amountMinor: z.number().int(),
  currency: z.string().default('PHP'),
  notes: z.string().optional(),
});

export type AccountingEntryInput = z.infer<typeof AccountingEntrySchema>;
