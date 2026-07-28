/**
 * Pure helper functions for coupon operations.
 * No side effects, easily testable.
 */

import { Coupon, CouponFilterType } from '../types';

/**
 * Filters coupons by search query (matches against code and description).
 * Case-insensitive partial match.
 */
export function filterBySearch(coupons: Coupon[], query: string): Coupon[] {
  if (!query.trim()) return coupons;

  const normalizedQuery = query.toLowerCase().trim();
  return coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(normalizedQuery) ||
      coupon.description.toLowerCase().includes(normalizedQuery),
  );
}

/**
 * Filters coupons by discount type.
 * 'all' returns the unfiltered list.
 */
export function filterByType(coupons: Coupon[], type: CouponFilterType): Coupon[] {
  if (type === 'all') return coupons;
  return coupons.filter((coupon) => coupon.discountType === type);
}

/**
 * Applies both search and type filters in sequence.
 */
export function applyFilters(
  coupons: Coupon[],
  searchQuery: string,
  filterType: CouponFilterType,
): Coupon[] {
  const searchFiltered = filterBySearch(coupons, searchQuery);
  return filterByType(searchFiltered, filterType);
}
