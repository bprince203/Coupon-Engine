/**
 * ValidationEngine tests — end-to-end validation pipeline coverage.
 */

import { validateCoupon } from '../../src/features/coupons/services/ValidationEngine';
import { Coupon } from '../../src/features/coupons/types';

// ─── Test Fixtures ───────────────────────────────────────────────

const FUTURE_DATE = '2027-12-31T23:59:59.000Z';
const PAST_DATE = '2023-01-01T00:00:00.000Z';
const REFERENCE_DATE = new Date('2025-06-15T12:00:00.000Z');

const coupons: Coupon[] = [
  {
    id: '1',
    code: 'SAVE20',
    description: '20% off',
    discountType: 'percentage',
    discountValue: 20,
    minimumOrderValue: 500,
    maxDiscount: 200,
    applicableCategories: ['all'],
    expiryDate: FUTURE_DATE,
    status: 'active',
  },
  {
    id: '2',
    code: 'EXPIRED50',
    description: 'Expired coupon',
    discountType: 'percentage',
    discountValue: 50,
    minimumOrderValue: 0,
    applicableCategories: ['all'],
    expiryDate: PAST_DATE,
    status: 'expired',
  },
  {
    id: '3',
    code: 'FLAT100',
    description: '₹100 off',
    discountType: 'flat',
    discountValue: 100,
    minimumOrderValue: 999,
    applicableCategories: ['all'],
    expiryDate: FUTURE_DATE,
    status: 'active',
  },
  {
    id: '4',
    code: 'SCIENCE30',
    description: '30% off science',
    discountType: 'percentage',
    discountValue: 30,
    minimumOrderValue: 0,
    applicableCategories: ['science'],
    expiryDate: FUTURE_DATE,
    status: 'active',
  },
  {
    id: '5',
    code: 'FREESHIP',
    description: 'Free shipping',
    discountType: 'free_shipping',
    discountValue: 0,
    minimumOrderValue: 0,
    applicableCategories: ['all'],
    expiryDate: FUTURE_DATE,
    status: 'active',
  },
  {
    id: '6',
    code: 'FULL100',
    description: '100% off',
    discountType: 'percentage',
    discountValue: 100,
    minimumOrderValue: 0,
    applicableCategories: ['all'],
    expiryDate: FUTURE_DATE,
    status: 'active',
  },
];

// ─── Tests ───────────────────────────────────────────────────────

describe('ValidationEngine', () => {
  describe('Valid Coupons', () => {
    it('validates a valid percentage coupon', () => {
      const result = validateCoupon(
        coupons,
        { code: 'SAVE20', cartTotal: 1000 },
        REFERENCE_DATE,
      );
      expect(result.isValid).toBe(true);
      expect(result.discountAmount).toBe(200);
      expect(result.finalPrice).toBe(800);
      expect(result.coupon?.code).toBe('SAVE20');
    });

    it('validates a flat discount coupon', () => {
      const result = validateCoupon(
        coupons,
        { code: 'FLAT100', cartTotal: 1500 },
        REFERENCE_DATE,
      );
      expect(result.isValid).toBe(true);
      expect(result.discountAmount).toBe(100);
      expect(result.finalPrice).toBe(1400);
    });

    it('validates a free shipping coupon', () => {
      const result = validateCoupon(
        coupons,
        { code: 'FREESHIP', cartTotal: 500 },
        REFERENCE_DATE,
      );
      expect(result.isValid).toBe(true);
      expect(result.discountAmount).toBe(0);
      expect(result.finalPrice).toBe(500);
    });

    it('validates a 100% discount coupon', () => {
      const result = validateCoupon(
        coupons,
        { code: 'FULL100', cartTotal: 1000 },
        REFERENCE_DATE,
      );
      expect(result.isValid).toBe(true);
      expect(result.discountAmount).toBe(1000);
      expect(result.finalPrice).toBe(0);
    });

    it('is case-insensitive for coupon codes', () => {
      const result = validateCoupon(
        coupons,
        { code: 'save20', cartTotal: 1000 },
        REFERENCE_DATE,
      );
      expect(result.isValid).toBe(true);
    });

    it('trims whitespace from code', () => {
      const result = validateCoupon(
        coupons,
        { code: '  SAVE20  ', cartTotal: 1000 },
        REFERENCE_DATE,
      );
      expect(result.isValid).toBe(true);
    });
  });

  describe('Invalid Code', () => {
    it('rejects a non-existent code', () => {
      const result = validateCoupon(
        coupons,
        { code: 'NOTREAL', cartTotal: 1000 },
        REFERENCE_DATE,
      );
      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe('INVALID_CODE');
    });

    it('rejects an empty code', () => {
      const result = validateCoupon(
        coupons,
        { code: '', cartTotal: 1000 },
        REFERENCE_DATE,
      );
      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe('INVALID_CODE');
    });

    it('rejects a whitespace-only code', () => {
      const result = validateCoupon(
        coupons,
        { code: '   ', cartTotal: 1000 },
        REFERENCE_DATE,
      );
      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe('INVALID_CODE');
    });
  });

  describe('Expired Coupon', () => {
    it('rejects an expired coupon', () => {
      const result = validateCoupon(
        coupons,
        { code: 'EXPIRED50', cartTotal: 1000 },
        REFERENCE_DATE,
      );
      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe('EXPIRED');
    });
  });

  describe('Minimum Order Value', () => {
    it('rejects when cart is below minimum', () => {
      const result = validateCoupon(
        coupons,
        { code: 'SAVE20', cartTotal: 400 },
        REFERENCE_DATE,
      );
      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe('MINIMUM_NOT_MET');
    });

    it('accepts when cart equals minimum exactly', () => {
      const result = validateCoupon(
        coupons,
        { code: 'SAVE20', cartTotal: 500 },
        REFERENCE_DATE,
      );
      expect(result.isValid).toBe(true);
    });

    it('accepts when cart exceeds minimum', () => {
      const result = validateCoupon(
        coupons,
        { code: 'SAVE20', cartTotal: 5000 },
        REFERENCE_DATE,
      );
      expect(result.isValid).toBe(true);
    });
  });

  describe('Category Validation', () => {
    it('accepts coupon with matching category', () => {
      const result = validateCoupon(
        coupons,
        { code: 'SCIENCE30', cartTotal: 1000, category: 'science' },
        REFERENCE_DATE,
      );
      expect(result.isValid).toBe(true);
    });

    it('rejects coupon with wrong category', () => {
      const result = validateCoupon(
        coupons,
        { code: 'SCIENCE30', cartTotal: 1000, category: 'math' },
        REFERENCE_DATE,
      );
      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe('CATEGORY_MISMATCH');
    });

    it('accepts "all" category coupon regardless of input', () => {
      const result = validateCoupon(
        coupons,
        { code: 'SAVE20', cartTotal: 1000, category: 'anything' },
        REFERENCE_DATE,
      );
      expect(result.isValid).toBe(true);
    });

    it('defaults to "all" when no category provided', () => {
      const result = validateCoupon(
        coupons,
        { code: 'SCIENCE30', cartTotal: 1000 },
        REFERENCE_DATE,
      );
      // 'all' doesn't match 'science' — should fail
      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe('CATEGORY_MISMATCH');
    });
  });

  describe('Discount Capping', () => {
    it('caps percentage discount at maxDiscount', () => {
      const result = validateCoupon(
        coupons,
        { code: 'SAVE20', cartTotal: 2000 },
        REFERENCE_DATE,
      );
      // 20% of 2000 = 400, but maxDiscount is 200
      expect(result.isValid).toBe(true);
      expect(result.discountAmount).toBe(200);
      expect(result.finalPrice).toBe(1800);
    });
  });
});
