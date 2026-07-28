/**
 * Spacing scale based on a 4px grid system.
 * Consistent spacing creates visual rhythm across the app.
 */

export const spacing = {
  /** 2px — hairline separators */
  xxs: 2,
  /** 4px — tight internal padding */
  xs: 4,
  /** 8px — compact spacing */
  sm: 8,
  /** 12px — medium spacing */
  md: 12,
  /** 16px — base spacing / standard padding */
  base: 16,
  /** 20px — comfortable spacing */
  lg: 20,
  /** 24px — section spacing */
  xl: 24,
  /** 32px — large section gaps */
  xxl: 32,
  /** 40px — major section breaks */
  xxxl: 40,
  /** 48px — page-level spacing */
  xxxxl: 48,
} as const;

export const borderRadius = {
  /** 4px — subtle rounding */
  xs: 4,
  /** 8px — cards */
  sm: 8,
  /** 12px — medium elements */
  md: 12,
  /** 16px — prominent cards */
  lg: 16,
  /** 20px — large cards */
  xl: 20,
  /** 24px — modals */
  xxl: 24,
  /** Full circle */
  full: 9999,
} as const;

export const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
} as const;

export const hitSlop = {
  top: 8,
  bottom: 8,
  left: 8,
  right: 8,
} as const;
