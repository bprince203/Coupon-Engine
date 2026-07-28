/**
 * Currency formatting utility.
 * Uses Indian locale (en-IN) with the ₹ symbol.
 */

import { CURRENCY_SYMBOL } from '../constants';

/**
 * Formats a number as Indian Rupee currency.
 * @example formatCurrency(1500) → '₹1,500'
 * @example formatCurrency(1500.5) → '₹1,501' (rounds to nearest)
 */
export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = rounded.toLocaleString('en-IN');
  return `${CURRENCY_SYMBOL}${formatted}`;
}

/**
 * Formats discount display text based on coupon type.
 * @example formatDiscount('percentage', 20) → '20% OFF'
 * @example formatDiscount('flat', 100) → '₹100 OFF'
 * @example formatDiscount('free_shipping', 0) → 'FREE SHIPPING'
 */
export function formatDiscount(
  type: 'percentage' | 'flat' | 'free_shipping',
  value: number,
): string {
  switch (type) {
    case 'percentage':
      return `${value}% OFF`;
    case 'flat':
      return `${formatCurrency(value)} OFF`;
    case 'free_shipping':
      return 'FREE SHIPPING';
  }
}
