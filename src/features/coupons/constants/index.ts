/**
 * Feature-level constants for the coupon module.
 * Avoids magic numbers and provides a single source of truth.
 */

// ─── API Simulation ──────────────────────────────────────────────

/** Minimum simulated API latency in ms */
export const API_MIN_LATENCY_MS = 800;

/** Maximum simulated API latency in ms */
export const API_MAX_LATENCY_MS = 1500;

/** Probability (0–1) that a mock API call will fail */
export const API_FAILURE_RATE = 0.1;

// ─── Validation ──────────────────────────────────────────────────

/** User-friendly error messages keyed by validation error code */
export const VALIDATION_ERROR_MESSAGES: Record<string, string> = {
  INVALID_CODE: 'This coupon code doesn\'t exist. Please check and try again.',
  EXPIRED: 'This coupon has expired and is no longer valid.',
  MINIMUM_NOT_MET: 'Your cart total doesn\'t meet the minimum order requirement for this coupon.',
  CATEGORY_MISMATCH: 'This coupon is not applicable to the selected category.',
  ALREADY_APPLIED: 'This coupon has already been applied to your cart.',
};

// ─── Discount ────────────────────────────────────────────────────

/** Maximum discount percentage allowed (safety cap) */
export const MAX_DISCOUNT_PERCENTAGE = 100;

/** Minimum cart value for any operation */
export const MIN_CART_VALUE = 0;

// ─── UI ──────────────────────────────────────────────────────────

/** Debounce delay for search input in ms */
export const SEARCH_DEBOUNCE_MS = 300;

/** Toast auto-dismiss duration in ms */
export const TOAST_DURATION_MS = 2500;

/** Number of skeleton cards to show during loading */
export const SKELETON_COUNT = 4;

// ─── Filters ─────────────────────────────────────────────────────

export const FILTER_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'percentage', label: 'Percentage Off' },
  { key: 'flat', label: 'Flat Discount' },
  { key: 'free_shipping', label: 'Free Shipping' },
] as const;

// ─── Categories ──────────────────────────────────────────────────

/** Wildcard category — means coupon applies to everything */
export const ALL_CATEGORIES_KEY = 'all';

// ─── Currency ────────────────────────────────────────────────────

export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_LOCALE = 'en-IN';
