/**
 * useSearchCoupons — Combines debounced search with filter store.
 * Returns the filtered coupon list based on current search query and filter type.
 */

import { useMemo } from 'react';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { useFilterStore } from '../store/useFilterStore';
import { applyFilters } from '../utils/couponHelpers';
import { Coupon } from '../types';
import { SEARCH_DEBOUNCE_MS } from '../constants';

export function useSearchCoupons(coupons: Coupon[] | undefined) {
  const { searchQuery, activeFilter } = useFilterStore();
  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  const filteredCoupons = useMemo(() => {
    if (!coupons) return [];
    return applyFilters(coupons, debouncedQuery, activeFilter);
  }, [coupons, debouncedQuery, activeFilter]);

  return {
    filteredCoupons,
    totalCount: coupons?.length ?? 0,
    filteredCount: filteredCoupons.length,
    isFiltering: debouncedQuery.length > 0 || activeFilter !== 'all',
  };
}
