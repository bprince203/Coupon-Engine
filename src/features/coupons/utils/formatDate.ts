/**
 * Date formatting and comparison utilities.
 * Centralizes date logic for testability and consistency.
 */

/**
 * Formats an ISO date string into a human-readable format.
 * @example formatDate('2027-12-31T23:59:59.000Z') → 'Dec 31, 2027'
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Checks if a date string represents a date that has passed.
 * @param isoDate - ISO 8601 date string
 * @param now - Optional reference date for testing (defaults to current time)
 */
export function isExpired(isoDate: string, now: Date = new Date()): boolean {
  return new Date(isoDate).getTime() < now.getTime();
}

/**
 * Returns a human-readable relative expiry description.
 * @example getExpiryText('2027-12-31') → 'Expires Dec 31, 2027'
 * @example getExpiryText('2023-01-01') → 'Expired Jan 1, 2023'
 */
export function getExpiryText(isoDate: string): string {
  const expired = isExpired(isoDate);
  const formatted = formatDate(isoDate);
  return expired ? `Expired ${formatted}` : `Expires ${formatted}`;
}
