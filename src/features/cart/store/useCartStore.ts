/**
 * Cart store — manages cart items and computes order totals.
 * Zustand store consistent with existing useCouponStore pattern.
 *
 * Business rules:
 * - Delivery: ₹40 (free above ₹499 subtotal after coupon)
 * - Platform fee: ₹5 flat
 * - Tax: 18% GST on discounted subtotal
 * - itemDiscount: computed from (originalPrice − price) × qty
 * - Quantity: min 1, max 10 per item
 */

import { create } from 'zustand';
import { CartItem, OrderSummary } from '../types';
import { DEFAULT_CART_ITEMS } from '../api/mockProducts';

const DELIVERY_CHARGE = 40;
const FREE_DELIVERY_THRESHOLD = 499;
const PLATFORM_FEE = 5;
const TAX_RATE = 0.18;
const MAX_QUANTITY = 10;
const MIN_QUANTITY = 1;

interface CartStoreState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  incrementQuantity: (itemId: string) => void;
  decrementQuantity: (itemId: string) => void;
  clearCart: () => void;
  /** Restores cart to the original demo products (used by empty-cart "Continue Shopping") */
  restoreDefaultItems: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
  getOrderSummary: (couponDiscount?: number) => OrderSummary;
}

export const useCartStore = create<CartStoreState>((set, get) => ({
  items: DEFAULT_CART_ITEMS,

  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QUANTITY) }
              : i,
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    });
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== itemId),
    }));
  },

  updateQuantity: (itemId, quantity) => {
    const clamped = Math.max(MIN_QUANTITY, Math.min(quantity, MAX_QUANTITY));
    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId ? { ...i, quantity: clamped } : i,
      ),
    }));
  },

  incrementQuantity: (itemId) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId
          ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QUANTITY) }
          : i,
      ),
    }));
  },

  decrementQuantity: (itemId) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId
          ? { ...i, quantity: Math.max(i.quantity - 1, MIN_QUANTITY) }
          : i,
      ),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  restoreDefaultItems: () => {
    set({ items: DEFAULT_CART_ITEMS.map(item => ({ ...item })) });
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getOrderSummary: (couponDiscount = 0) => {
    const items = get().items;

    // Subtotal at selling price
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Item-level discount: saving from originalPrice vs price
    const itemDiscount = items.reduce(
      (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
      0,
    );

    // Coupon discount capped at subtotal
    const couponDisc = Math.min(couponDiscount, subtotal);
    const afterCoupon = subtotal - couponDisc;

    const freeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
    const deliveryCharge = freeDelivery ? 0 : DELIVERY_CHARGE;
    const platformFee = subtotal > 0 ? PLATFORM_FEE : 0;
    const tax = Math.round(afterCoupon * TAX_RATE * 100) / 100;
    const total = Math.round((afterCoupon + deliveryCharge + platformFee + tax) * 100) / 100;

    // Total savings = item discounts + coupon discount + free delivery saving
    const savings = itemDiscount + couponDisc + (freeDelivery ? DELIVERY_CHARGE : 0);

    return {
      subtotal,
      itemDiscount,
      couponDiscount: couponDisc,
      deliveryCharge,
      platformFee,
      tax,
      total,
      savings,
    };
  },
}));
