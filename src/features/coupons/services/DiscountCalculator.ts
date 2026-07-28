/**
 * DiscountCalculator — Computes the actual discount amount and final price.
 *
 * Handles all discount types with proper edge cases:
 * - Percentage discounts respect maxDiscount caps
 * - Flat discounts never exceed the cart total
 * - Free shipping returns zero discount (shipping handled separately)
 * - Negative/zero carts always result in zero discount
 */

import { Coupon, DiscountResult } from '../types';
import { MAX_DISCOUNT_PERCENTAGE, MIN_CART_VALUE } from '../constants';

export function calculateDiscount(coupon: Coupon, cartTotal: number): DiscountResult {
  // Guard: negative or zero cart
  if (cartTotal <= MIN_CART_VALUE) {
    return { discountAmount: 0, finalPrice: 0 };
  }

  let discountAmount: number;

  switch (coupon.discountType) {
    case 'percentage': {
      const clampedPercentage = Math.min(coupon.discountValue, MAX_DISCOUNT_PERCENTAGE);
      discountAmount = (cartTotal * clampedPercentage) / 100;

      // Apply max discount cap if defined
      if (coupon.maxDiscount !== undefined && coupon.maxDiscount > 0) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
      break;
    }

    case 'flat': {
      // Flat discount cannot exceed cart total
      discountAmount = Math.min(coupon.discountValue, cartTotal);
      break;
    }

    case 'free_shipping': {
      // Free shipping doesn't reduce the cart price
      discountAmount = 0;
      break;
    }

    default: {
      // Exhaustive check — TypeScript will flag if a new type is added
      const _exhaustive: never = coupon.discountType;
      discountAmount = 0;
      break;
    }
  }

  // Round to avoid floating-point artifacts
  discountAmount = Math.round(discountAmount * 100) / 100;
  const finalPrice = Math.max(0, Math.round((cartTotal - discountAmount) * 100) / 100);

  return { discountAmount, finalPrice };
}
