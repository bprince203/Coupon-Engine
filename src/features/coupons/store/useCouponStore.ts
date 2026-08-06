import { create } from 'zustand';
import { AppliedCoupon, Coupon } from '../types';

interface CouponStoreState {
  activeCoupon: AppliedCoupon | null;
  setActiveCoupon: (coupon: Coupon, cartTotal: number, discountAmount: number, finalPrice: number) => void;
  removeActiveCoupon: () => void;
}

export const useCouponStore = create<CouponStoreState>((set) => ({
  activeCoupon: null,

  setActiveCoupon: (coupon, cartTotal, discountAmount, finalPrice) => {
    set({
      activeCoupon: {
        coupon,
        cartTotal,
        discountAmount,
        finalPrice,
        appliedAt: Date.now(),
      },
    });
  },

  removeActiveCoupon: () => {
    set({ activeCoupon: null });
  },
}));
