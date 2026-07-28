/**
 * DiscountCalculator tests — comprehensive edge case coverage.
 */

import { calculateDiscount } from '../../src/features/coupons/services/DiscountCalculator';
import { Coupon } from '../../src/features/coupons/types';

// ─── Test Fixtures ───────────────────────────────────────────────

const createCoupon = (overrides: Partial<Coupon>): Coupon => ({
  id: '1',
  code: 'TEST',
  description: 'Test coupon',
  discountType: 'percentage',
  discountValue: 20,
  minimumOrderValue: 0,
  applicableCategories: ['all'],
  expiryDate: '2027-12-31T23:59:59.000Z',
  status: 'active',
  ...overrides,
});

// ─── Tests ───────────────────────────────────────────────────────

describe('DiscountCalculator', () => {
  describe('Percentage Discounts', () => {
    it('calculates 20% off correctly', () => {
      const coupon = createCoupon({ discountValue: 20 });
      const result = calculateDiscount(coupon, 1000);
      expect(result.discountAmount).toBe(200);
      expect(result.finalPrice).toBe(800);
    });

    it('respects maxDiscount cap', () => {
      const coupon = createCoupon({ discountValue: 20, maxDiscount: 150 });
      const result = calculateDiscount(coupon, 1000);
      expect(result.discountAmount).toBe(150);
      expect(result.finalPrice).toBe(850);
    });

    it('handles 100% discount', () => {
      const coupon = createCoupon({ discountValue: 100 });
      const result = calculateDiscount(coupon, 500);
      expect(result.discountAmount).toBe(500);
      expect(result.finalPrice).toBe(0);
    });

    it('clamps percentage to 100%', () => {
      const coupon = createCoupon({ discountValue: 150 });
      const result = calculateDiscount(coupon, 500);
      expect(result.discountAmount).toBe(500);
      expect(result.finalPrice).toBe(0);
    });

    it('ignores zero/negative maxDiscount', () => {
      const coupon = createCoupon({ discountValue: 20, maxDiscount: 0 });
      const result = calculateDiscount(coupon, 1000);
      expect(result.discountAmount).toBe(200);
      expect(result.finalPrice).toBe(800);
    });
  });

  describe('Flat Discounts', () => {
    it('applies flat discount correctly', () => {
      const coupon = createCoupon({ discountType: 'flat', discountValue: 100 });
      const result = calculateDiscount(coupon, 500);
      expect(result.discountAmount).toBe(100);
      expect(result.finalPrice).toBe(400);
    });

    it('caps flat discount at cart total', () => {
      const coupon = createCoupon({ discountType: 'flat', discountValue: 500 });
      const result = calculateDiscount(coupon, 300);
      expect(result.discountAmount).toBe(300);
      expect(result.finalPrice).toBe(0);
    });

    it('handles flat discount equal to cart', () => {
      const coupon = createCoupon({ discountType: 'flat', discountValue: 200 });
      const result = calculateDiscount(coupon, 200);
      expect(result.discountAmount).toBe(200);
      expect(result.finalPrice).toBe(0);
    });
  });

  describe('Free Shipping', () => {
    it('returns zero discount for free shipping', () => {
      const coupon = createCoupon({ discountType: 'free_shipping', discountValue: 0 });
      const result = calculateDiscount(coupon, 1000);
      expect(result.discountAmount).toBe(0);
      expect(result.finalPrice).toBe(1000);
    });
  });

  describe('Edge Cases', () => {
    it('returns zero for zero cart total', () => {
      const coupon = createCoupon({ discountValue: 20 });
      const result = calculateDiscount(coupon, 0);
      expect(result.discountAmount).toBe(0);
      expect(result.finalPrice).toBe(0);
    });

    it('returns zero for negative cart total', () => {
      const coupon = createCoupon({ discountValue: 20 });
      const result = calculateDiscount(coupon, -100);
      expect(result.discountAmount).toBe(0);
      expect(result.finalPrice).toBe(0);
    });

    it('handles very small cart total with percentage', () => {
      const coupon = createCoupon({ discountValue: 10 });
      const result = calculateDiscount(coupon, 1);
      expect(result.discountAmount).toBe(0.1);
      expect(result.finalPrice).toBe(0.9);
    });

    it('handles large cart totals', () => {
      const coupon = createCoupon({ discountValue: 5 });
      const result = calculateDiscount(coupon, 100000);
      expect(result.discountAmount).toBe(5000);
      expect(result.finalPrice).toBe(95000);
    });
  });
});
