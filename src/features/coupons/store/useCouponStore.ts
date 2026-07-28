/**
 * Applied coupons store — manages session-level coupon applications.
 * Zustand provides minimal boilerplate without provider wrapping.
 */

import { create } from 'zustand';
import { AppliedCoupon, Coupon } from '../types';

interface CouponStoreState {
  appliedCoupons: AppliedCoupon[];
  applyCoupon: (coupon: Coupon, cartTotal: number, discountAmount: number, finalPrice: number) => void;
  removeCoupon: (couponId: string) => void;
  clearAll: () => void;
  isAlreadyApplied: (couponId: string) => boolean;
  getTotalSavings: () => number;
}

export const useCouponStore = create<CouponStoreState>((set, get) => ({
  appliedCoupons: [],

  applyCoupon: (coupon, cartTotal, discountAmount, finalPrice) => {
    const applied: AppliedCoupon = {
      coupon,
      cartTotal,
      discountAmount,
      finalPrice,
      appliedAt: Date.now(),
    };

    set((state) => ({
      appliedCoupons: [...state.appliedCoupons, applied],
    }));
  },

  removeCoupon: (couponId) => {
    set((state) => ({
      appliedCoupons: state.appliedCoupons.filter((ac) => ac.coupon.id !== couponId),
    }));
  },

  clearAll: () => {
    set({ appliedCoupons: [] });
  },

  isAlreadyApplied: (couponId) => {
    return get().appliedCoupons.some((ac) => ac.coupon.id === couponId);
  },

  getTotalSavings: () => {
    return get().appliedCoupons.reduce((sum, ac) => sum + ac.discountAmount, 0);
  },
}));
