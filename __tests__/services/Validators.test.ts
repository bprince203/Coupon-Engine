/**
 * Individual validator unit tests.
 */

import { ExpiryValidator } from '../../src/features/coupons/services/validators/ExpiryValidator';
import { MinimumOrderValidator } from '../../src/features/coupons/services/validators/MinimumOrderValidator';
import { CategoryValidator } from '../../src/features/coupons/services/validators/CategoryValidator';
import { Coupon, ValidationInput } from '../../src/features/coupons/types';

const REFERENCE_DATE = new Date('2025-06-15T12:00:00.000Z');

const createCoupon = (overrides: Partial<Coupon>): Coupon => ({
  id: '1',
  code: 'TEST',
  description: 'Test',
  discountType: 'percentage',
  discountValue: 20,
  minimumOrderValue: 0,
  applicableCategories: ['all'],
  expiryDate: '2027-12-31T23:59:59.000Z',
  status: 'active',
  ...overrides,
});

const createInput = (overrides: Partial<ValidationInput> = {}): ValidationInput => ({
  code: 'TEST',
  cartTotal: 1000,
  ...overrides,
});

describe('ExpiryValidator', () => {
  it('passes for future expiry', () => {
    const validator = new ExpiryValidator(REFERENCE_DATE);
    const result = validator.validate(
      createCoupon({ expiryDate: '2027-12-31T23:59:59.000Z' }),
      createInput(),
    );
    expect(result.isValid).toBe(true);
  });

  it('fails for past expiry', () => {
    const validator = new ExpiryValidator(REFERENCE_DATE);
    const result = validator.validate(
      createCoupon({ expiryDate: '2023-01-01T00:00:00.000Z' }),
      createInput(),
    );
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe('EXPIRED');
  });
});

describe('MinimumOrderValidator', () => {
  const validator = new MinimumOrderValidator();

  it('passes when cart exceeds minimum', () => {
    const result = validator.validate(
      createCoupon({ minimumOrderValue: 500 }),
      createInput({ cartTotal: 1000 }),
    );
    expect(result.isValid).toBe(true);
  });

  it('passes when cart equals minimum', () => {
    const result = validator.validate(
      createCoupon({ minimumOrderValue: 500 }),
      createInput({ cartTotal: 500 }),
    );
    expect(result.isValid).toBe(true);
  });

  it('fails when cart is below minimum', () => {
    const result = validator.validate(
      createCoupon({ minimumOrderValue: 500 }),
      createInput({ cartTotal: 499 }),
    );
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe('MINIMUM_NOT_MET');
  });

  it('passes when minimum is zero', () => {
    const result = validator.validate(
      createCoupon({ minimumOrderValue: 0 }),
      createInput({ cartTotal: 0 }),
    );
    expect(result.isValid).toBe(true);
  });
});

describe('CategoryValidator', () => {
  const validator = new CategoryValidator();

  it('passes for "all" categories coupon', () => {
    const result = validator.validate(
      createCoupon({ applicableCategories: ['all'] }),
      createInput({ category: 'anything' }),
    );
    expect(result.isValid).toBe(true);
  });

  it('passes for matching category', () => {
    const result = validator.validate(
      createCoupon({ applicableCategories: ['science', 'math'] }),
      createInput({ category: 'science' }),
    );
    expect(result.isValid).toBe(true);
  });

  it('fails for non-matching category', () => {
    const result = validator.validate(
      createCoupon({ applicableCategories: ['science'] }),
      createInput({ category: 'math' }),
    );
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe('CATEGORY_MISMATCH');
  });

  it('is case-insensitive', () => {
    const result = validator.validate(
      createCoupon({ applicableCategories: ['Science'] }),
      createInput({ category: 'science' }),
    );
    expect(result.isValid).toBe(true);
  });

  it('defaults category to "all" when not provided', () => {
    const result = validator.validate(
      createCoupon({ applicableCategories: ['all'] }),
      createInput(),
    );
    expect(result.isValid).toBe(true);
  });
});
