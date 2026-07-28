/**
 * CodeValidator — First step in the validation pipeline.
 * Checks if the coupon code exists in the dataset.
 */

import { Coupon, ValidationResult, CouponValidator, ValidationInput } from '../../types';
import { VALIDATION_ERROR_MESSAGES } from '../../constants';

export class CodeValidator implements CouponValidator {
  validate(coupon: Coupon, _input: ValidationInput): ValidationResult {
    // If the coupon object was resolved (found by code), it's valid at this step
    // The engine handles the lookup — this validator confirms the coupon isn't null
    if (!coupon) {
      return {
        isValid: false,
        errorCode: 'INVALID_CODE',
        errorMessage: VALIDATION_ERROR_MESSAGES.INVALID_CODE,
      };
    }

    return { isValid: true };
  }
}
