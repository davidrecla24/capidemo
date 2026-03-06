import { z } from 'zod';

export const AddressInputSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  stateProvince: z.string().min(1),
  postalCode: z.string().min(1),
  countryCode: z.string().length(2).default('PH'),
});

export const ValidateAddressSchema = AddressInputSchema;

export type AddressInput = z.infer<typeof AddressInputSchema>;
