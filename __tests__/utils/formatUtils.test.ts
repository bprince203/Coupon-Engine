/**
 * Utility function tests — formatCurrency and formatDate.
 */

import { formatCurrency, formatDiscount } from '../../src/features/coupons/utils/formatCurrency';
import { formatDate, isExpired, getExpiryText } from '../../src/features/coupons/utils/formatDate';

describe('formatCurrency', () => {
  it('formats integer amounts', () => {
    expect(formatCurrency(1500)).toBe('₹1,500');
  });

  it('rounds decimal amounts', () => {
    expect(formatCurrency(1500.5)).toBe('₹1,501');
    expect(formatCurrency(1500.4)).toBe('₹1,500');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('₹0');
  });

  it('formats large amounts', () => {
    expect(formatCurrency(100000)).toContain('₹');
    expect(formatCurrency(100000)).toBe('₹1,00,000');
  });
});

describe('formatDiscount', () => {
  it('formats percentage discount', () => {
    expect(formatDiscount('percentage', 20)).toBe('20% OFF');
  });

  it('formats flat discount', () => {
    expect(formatDiscount('flat', 100)).toContain('OFF');
    expect(formatDiscount('flat', 100)).toContain('₹');
  });

  it('formats free shipping', () => {
    expect(formatDiscount('free_shipping', 0)).toBe('FREE SHIPPING');
  });
});

describe('formatDate', () => {
  it('formats ISO date to readable format', () => {
    const result = formatDate('2027-12-15T12:00:00.000Z');
    expect(result).toContain('Dec');
    expect(result).toContain('2027');
  });
});

describe('isExpired', () => {
  const now = new Date('2025-06-15T12:00:00.000Z');

  it('returns true for past dates', () => {
    expect(isExpired('2023-01-01T00:00:00.000Z', now)).toBe(true);
  });

  it('returns false for future dates', () => {
    expect(isExpired('2027-12-31T23:59:59.000Z', now)).toBe(false);
  });
});

describe('getExpiryText', () => {
  it('shows "Expired" for past dates', () => {
    const result = getExpiryText('2023-01-01T00:00:00.000Z');
    expect(result).toContain('Expired');
  });

  it('shows "Expires" for future dates', () => {
    const result = getExpiryText('2027-12-31T23:59:59.000Z');
    expect(result).toContain('Expires');
  });
});
