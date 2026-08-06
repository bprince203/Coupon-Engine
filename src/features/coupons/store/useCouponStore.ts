/**
 * Applied coupons store — manages session-level coupon applications.
 * Zustand provides minimal boilerplate without provider wrapping.
 *
 * Two modes:
 * 1. appliedCoupons[] — legacy multi-coupon list (used by Applied tab)
 * 2. activeCoupon — single active coupon for cart checkout flow
 */

import { create } from 'zustand';
import { AppliedCoupon, Coupon } from '../types';

interface CouponStoreState {
  /** Legacy multi-coupon list (Applied tab) */
  appliedCoupons: AppliedCoupon[];
  applyCoupon: (coupon: Coupon, cartTotal: number, discountAmount: number, finalPrice: number) => void;
  removeCoupon: (couponId: string) => void;
  clearAll: () => void;
  isAlreadyApplied: (couponId: string) => boolean;
  getTotalSavings: () => number;

  /** Single active coupon for cart checkout flow */
  activeCoupon: AppliedCoupon | null;
  setActiveCoupon: (coupon: Coupon, cartTotal: number, discountAmount: number, finalPrice: number) => void;
  removeActiveCoupon: () => void;
}

export const useCouponStore = create<CouponStoreState>((set, get) => ({
  appliedCoupons: [],
  activeCoupon: null,

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
      // Also clear activeCoupon if it matches
      activeCoupon:
        state.activeCoupon?.coupon.id === couponId ? null : state.activeCoupon,
    }));
  },

  clearAll: () => {
    set({ appliedCoupons: [], activeCoupon: null });
  },

  isAlreadyApplied: (couponId) => {
    return get().appliedCoupons.some((ac) => ac.coupon.id === couponId);
  },

  getTotalSavings: () => {
    return get().appliedCoupons.reduce((sum, ac) => sum + ac.discountAmount, 0);
  },

  setActiveCoupon: (coupon, cartTotal, discountAmount, finalPrice) => {
    const applied: AppliedCoupon = {
      coupon,
      cartTotal,
      discountAmount,
      finalPrice,
      appliedAt: Date.now(),
    };

    set((state) => {
      // Remove any previously active coupon from the list, then add new one
      const filtered = state.activeCoupon
        ? state.appliedCoupons.filter((ac) => ac.coupon.id !== state.activeCoupon!.coupon.id)
        : state.appliedCoupons;

      return {
        activeCoupon: applied,
        appliedCoupons: [...filtered, applied],
      };
    });
  },

  removeActiveCoupon: () => {
    set((state) => ({
      activeCoupon: null,
      appliedCoupons: state.activeCoupon
        ? state.appliedCoupons.filter((ac) => ac.coupon.id !== state.activeCoupon!.coupon.id)
        : state.appliedCoupons,
    }));
  },
}));
