/**
 * Core domain types for the Cart feature.
 */

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  quantity: number;
  category: string;
  initials: string;
  gradientColors: [string, string];
  variant: string;
  seller: string;
  rating: number;
  discountBadge?: string;
  /** e.g. "Free · Instant Access" or "Delivery by Tomorrow" */
  deliveryEstimate: string;
  /** Stock availability status */
  stockStatus: 'in_stock' | 'low_stock';
  /** Only populated when stockStatus is 'low_stock' */
  stockCount?: number;
}

export interface OrderSummary {
  subtotal: number;
  itemDiscount: number;
  couponDiscount: number;
  deliveryCharge: number;
  platformFee: number;
  tax: number;
  total: number;
  savings: number;
}
