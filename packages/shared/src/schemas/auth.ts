import { z } from 'zod';

export const RequestCodeSchema = z.object({
  email: z.string().email(),
});

export const VerifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6).max(6),
});

export type RequestCodeInput = z.infer<typeof RequestCodeSchema>;
export type VerifyCodeInput = z.infer<typeof VerifyCodeSchema>;
