/**
 * ValidationEngine — Orchestrates the coupon validation pipeline.
 *
 * Architecture: Chain of Responsibility pattern.
 * Each validator runs in sequence; the pipeline halts at the first failure.
 * This makes the system easy to extend — add a new validator class and
 * register it in the pipeline array.
 *
 * Pipeline: CodeValidator → ExpiryValidator → MinimumOrderValidator → CategoryValidator → DiscountCalculator
 */

import { Coupon, ValidationResult, ValidationInput, CouponValidator } from '../types';
import { CodeValidator, ExpiryValidator, MinimumOrderValidator, CategoryValidator } from './validators';
import { calculateDiscount } from './DiscountCalculator';
import { VALIDATION_ERROR_MESSAGES } from '../constants';

/**
 * Creates the default validation pipeline.
 * Accepts optional `now` parameter for deterministic date testing.
 */
function createPipeline(now?: Date): CouponValidator[] {
  return [
    new CodeValidator(),
    new ExpiryValidator(now),
    new MinimumOrderValidator(),
    new CategoryValidator(),
  ];
}

/**
 * Resolves a coupon from the list by code (case-insensitive).
 */
function findCouponByCode(coupons: Coupon[], code: string): Coupon | undefined {
  const normalizedCode = code.trim().toUpperCase();
  return coupons.find((c) => c.code.toUpperCase() === normalizedCode);
}

/**
 * Validates a coupon code against a cart total using the full validation pipeline.
 *
 * @param coupons - Available coupon list (from API)
 * @param input - User input (code + cart total)
 * @param now - Optional date override for testing
 * @returns Complete ValidationResult with discount info on success
 */
export function validateCoupon(
  coupons: Coupon[],
  input: ValidationInput,
  now?: Date,
): ValidationResult {
  // Step 0: Resolve coupon by code
  const coupon = findCouponByCode(coupons, input.code);

  if (!coupon) {
    return {
      isValid: false,
      errorCode: 'INVALID_CODE',
      errorMessage: VALIDATION_ERROR_MESSAGES.INVALID_CODE,
    };
  }

  // Step 1-N: Run through validation pipeline (fail-fast)
  const pipeline = createPipeline(now);

  for (const validator of pipeline) {
    const result = validator.validate(coupon, input);
    if (!result.isValid) {
      return { ...result, coupon };
    }
  }

  // All validators passed — calculate discount
  const { discountAmount, finalPrice } = calculateDiscount(coupon, input.cartTotal);

  return {
    isValid: true,
    discountAmount,
    finalPrice,
    coupon,
  };
}
