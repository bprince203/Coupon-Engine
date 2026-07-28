/**
 * useCoupons — React Query hook for fetching the coupon list.
 * Handles loading, error, and refetch states automatically.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchCoupons } from '../api/couponApi';
import { Coupon } from '../types';

const QUERY_KEY = ['coupons'] as const;

export function useCoupons() {
  return useQuery<Coupon[], Error>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await fetchCoupons();
      if (!response.success) {
        throw new Error(response.error ?? 'Failed to fetch coupons');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}
