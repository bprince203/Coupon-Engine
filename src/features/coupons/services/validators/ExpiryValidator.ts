/**
 * ExpiryValidator — Checks if the coupon has expired.
 * Uses injectable date comparison for testability.
 */

import { Coupon, ValidationResult, CouponValidator, ValidationInput } from '../../types';
import { VALIDATION_ERROR_MESSAGES } from '../../constants';
import { isExpired } from '../../utils/formatDate';

export class ExpiryValidator implements CouponValidator {
  private readonly now: Date;

  constructor(now?: Date) {
    this.now = now ?? new Date();
  }

  validate(coupon: Coupon, _input: ValidationInput): ValidationResult {
    if (isExpired(coupon.expiryDate, this.now)) {
      return {
        isValid: false,
        errorCode: 'EXPIRED',
        errorMessage: VALIDATION_ERROR_MESSAGES.EXPIRED,
      };
    }

    return { isValid: true };
  }
}
