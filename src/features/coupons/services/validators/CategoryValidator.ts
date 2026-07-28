/**
 * CategoryValidator — Checks if the coupon is applicable to the given category.
 * Coupons with 'all' in their categories apply universally.
 */

import { Coupon, ValidationResult, CouponValidator, ValidationInput } from '../../types';
import { VALIDATION_ERROR_MESSAGES, ALL_CATEGORIES_KEY } from '../../constants';

export class CategoryValidator implements CouponValidator {
  validate(coupon: Coupon, input: ValidationInput): ValidationResult {
    const category = input.category ?? ALL_CATEGORIES_KEY;

    const isUniversal = coupon.applicableCategories.some(
      (cat) => cat.toLowerCase() === ALL_CATEGORIES_KEY,
    );

    if (isUniversal) {
      return { isValid: true };
    }

    const isApplicable = coupon.applicableCategories.some(
      (cat) => cat.toLowerCase() === category.toLowerCase(),
    );

    if (!isApplicable) {
      return {
        isValid: false,
        errorCode: 'CATEGORY_MISMATCH',
        errorMessage: `${VALIDATION_ERROR_MESSAGES.CATEGORY_MISMATCH} Valid for: ${coupon.applicableCategories.join(', ')}.`,
      };
    }

    return { isValid: true };
  }
}
