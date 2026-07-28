/**
 * Zod schemas for coupon validator form.
 * Used with React Hook Form for real-time validation.
 */

import { z } from 'zod';

export const couponValidatorSchema = z.object({
  code: z
    .string()
    .min(1, 'Coupon code is required')
    .max(20, 'Coupon code is too long')
    .transform((val) => val.trim().toUpperCase()),
  cartTotal: z
    .string()
    .min(1, 'Cart total is required')
    .refine((val) => !isNaN(Number(val)), 'Please enter a valid number')
    .refine((val) => Number(val) >= 0, 'Cart total cannot be negative')
    .refine((val) => Number(val) <= 1_000_000, 'Cart total seems too high'),
});

export type CouponValidatorFormData = z.infer<typeof couponValidatorSchema>;
