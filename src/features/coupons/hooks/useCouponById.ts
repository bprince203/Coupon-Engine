/**
 * useCouponById — React Query hook for fetching a single coupon.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchCouponById } from '../api/couponApi';
import { Coupon } from '../types';

export function useCouponById(id: string) {
  return useQuery<Coupon | null, Error>({
    queryKey: ['coupon', id] as const,
    queryFn: async () => {
      const response = await fetchCouponById(id);
      if (!response.success) {
        throw new Error(response.error ?? 'Failed to fetch coupon');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
