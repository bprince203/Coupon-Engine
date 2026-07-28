/**
 * Core domain types for the Coupon Engine.
 * These types define the shape of data flowing through the entire application.
 */

// ─── Enums ───────────────────────────────────────────────────────

export type DiscountType = 'percentage' | 'flat' | 'free_shipping';

export type CouponStatus = 'active' | 'expired';

export type ValidationErrorCode =
  | 'INVALID_CODE'
  | 'EXPIRED'
  | 'MINIMUM_NOT_MET'
  | 'CATEGORY_MISMATCH'
  | 'ALREADY_APPLIED';

export type CouponFilterType = DiscountType | 'all';

// ─── Core Entities ───────────────────────────────────────────────

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderValue: number;
  /** Maximum discount cap for percentage coupons */
  maxDiscount?: number;
  applicableCategories: string[];
  /** ISO 8601 date string */
  expiryDate: string;
  status: CouponStatus;
}

// ─── Validation ──────────────────────────────────────────────────

export interface ValidationResult {
  isValid: boolean;
  errorCode?: ValidationErrorCode;
  errorMessage?: string;
  discountAmount?: number;
  finalPrice?: number;
  coupon?: Coupon;
}

/** Input to the validation pipeline */
export interface ValidationInput {
  code: string;
  cartTotal: number;
  /** Optional — defaults to 'all' if not specified */
  category?: string;
}

// ─── Applied Coupons ─────────────────────────────────────────────

export interface AppliedCoupon {
  coupon: Coupon;
  cartTotal: number;
  discountAmount: number;
  finalPrice: number;
  appliedAt: number;
}

// ─── API ─────────────────────────────────────────────────────────

export interface APIResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// ─── Validator Interface ─────────────────────────────────────────

/**
 * Each validator in the pipeline implements this interface.
 * Returns a ValidationResult — if isValid is false, the pipeline halts.
 */
export interface CouponValidator {
  validate(coupon: Coupon, input: ValidationInput): ValidationResult;
}

// ─── Discount Calculation ────────────────────────────────────────

export interface DiscountResult {
  discountAmount: number;
  finalPrice: number;
}
