/**
 * Mock API layer that simulates network requests with configurable
 * latency and failure rate. Returns typed APIResponse wrappers.
 */

import { Coupon, APIResponse } from '../types';
import { MOCK_COUPONS } from './mockData';
import { API_MIN_LATENCY_MS, API_MAX_LATENCY_MS, API_FAILURE_RATE } from '../constants';

/**
 * Simulates network latency with a random delay in the configured range.
 */
const simulateLatency = (): Promise<void> => {
  const delay = API_MIN_LATENCY_MS + Math.random() * (API_MAX_LATENCY_MS - API_MIN_LATENCY_MS);
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Determines if the current request should fail based on the configured failure rate.
 */
const shouldFail = (): boolean => Math.random() < API_FAILURE_RATE;

/**
 * Fetches all coupons from the mock API.
 * Simulates real-world latency and occasional failures.
 */
export async function fetchCoupons(): Promise<APIResponse<Coupon[]>> {
  await simulateLatency();

  if (shouldFail()) {
    return {
      data: [],
      success: false,
      error: 'Failed to fetch coupons. Please check your connection and try again.',
    };
  }

  return {
    data: MOCK_COUPONS,
    success: true,
  };
}

/**
 * Fetches a single coupon by its ID.
 * Returns an error if the coupon is not found.
 */
export async function fetchCouponById(id: string): Promise<APIResponse<Coupon | null>> {
  await simulateLatency();

  if (shouldFail()) {
    return {
      data: null,
      success: false,
      error: 'Failed to load coupon details. Please try again.',
    };
  }

  const coupon = MOCK_COUPONS.find((c) => c.id === id) ?? null;

  if (!coupon) {
    return {
      data: null,
      success: false,
      error: 'Coupon not found.',
    };
  }

  return {
    data: coupon,
    success: true,
  };
}
