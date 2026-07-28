/**
 * MinimumOrderValidator — Checks if the cart total meets the coupon's minimum.
 */

import { Coupon, ValidationResult, CouponValidator, ValidationInput } from '../../types';
import { VALIDATION_ERROR_MESSAGES } from '../../constants';
import { formatCurrency } from '../../utils/formatCurrency';

export class MinimumOrderValidator implements CouponValidator {
  validate(coupon: Coupon, input: ValidationInput): ValidationResult {
    if (input.cartTotal < coupon.minimumOrderValue) {
      return {
        isValid: false,
        errorCode: 'MINIMUM_NOT_MET',
        errorMessage: `${VALIDATION_ERROR_MESSAGES.MINIMUM_NOT_MET} Minimum: ${formatCurrency(coupon.minimumOrderValue)}.`,
      };
    }

    return { isValid: true };
  }
}
