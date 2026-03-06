import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  active: z.boolean(),
});

export const SkuSchema = z.object({
  id: z.string(),
  productId: z.string(),
  code: z.string(),
  label: z.string(),
  weightKg: z.number(),
  priceMinor: z.number().int(),
  currency: z.string(),
  active: z.boolean(),
});

export type Product = z.infer<typeof ProductSchema>;
export type Sku = z.infer<typeof SkuSchema>;
