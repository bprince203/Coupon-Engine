/**
 * Color palette for the Coupon Engine app.
 *
 * Dark theme inspired by Linear/CRED — deep backgrounds with
 * vibrant accent colors for high contrast and readability.
 * Light theme uses muted surfaces with the same accent family.
 */

export const palette = {
  // Brand accent — electric violet
  violet50: '#F5F0FF',
  violet100: '#E8DEFF',
  violet200: '#C9B2FF',
  violet400: '#9B6DFF',
  violet500: '#7C3AED',
  violet600: '#6D28D9',
  violet700: '#5B21B6',

  // Neutrals — cool gray scale
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  gray950: '#0B0F19',

  // Semantic
  green400: '#4ADE80',
  green500: '#22C55E',
  green600: '#16A34A',
  green900: '#14532D',
  red400: '#F87171',
  red500: '#EF4444',
  red600: '#DC2626',
  red900: '#7F1D1D',
  amber400: '#FBBF24',
  amber500: '#F59E0B',
  blue400: '#60A5FA',
  blue500: '#3B82F6',

  // Absolute
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export interface ColorScheme {
  // Backgrounds
  background: string;
  surface: string;
  surfaceElevated: string;
  surfacePressed: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // Brand
  accent: string;
  accentLight: string;
  accentDark: string;

  // Semantic
  success: string;
  successLight: string;
  successBackground: string;
  error: string;
  errorLight: string;
  errorBackground: string;
  warning: string;
  warningLight: string;

  // Borders
  border: string;
  borderLight: string;

  // Misc
  skeleton: string;
  skeletonHighlight: string;
  overlay: string;
  tabBarBackground: string;
  tabBarBorder: string;
  cardGradientStart: string;
  cardGradientEnd: string;
}

export const darkColors: ColorScheme = {
  background: palette.gray950,
  surface: '#151921',
  surfaceElevated: '#1C2130',
  surfacePressed: '#252B3B',

  textPrimary: palette.gray50,
  textSecondary: palette.gray400,
  textTertiary: palette.gray500,
  textInverse: palette.gray950,

  accent: palette.violet500,
  accentLight: palette.violet400,
  accentDark: palette.violet700,

  success: palette.green500,
  successLight: palette.green400,
  successBackground: `${palette.green500}15`,
  error: palette.red500,
  errorLight: palette.red400,
  errorBackground: `${palette.red500}15`,
  warning: palette.amber500,
  warningLight: palette.amber400,

  border: '#1E2433',
  borderLight: '#2A3040',

  skeleton: '#1C2130',
  skeletonHighlight: '#252B3B',
  overlay: 'rgba(0, 0, 0, 0.6)',
  tabBarBackground: '#0F1219',
  tabBarBorder: '#1A1F2E',
  cardGradientStart: '#1C2130',
  cardGradientEnd: '#151921',
};

export const lightColors: ColorScheme = {
  background: palette.gray50,
  surface: palette.white,
  surfaceElevated: palette.white,
  surfacePressed: palette.gray100,

  textPrimary: palette.gray900,
  textSecondary: palette.gray600,
  textTertiary: palette.gray400,
  textInverse: palette.white,

  accent: palette.violet500,
  accentLight: palette.violet400,
  accentDark: palette.violet700,

  success: palette.green600,
  successLight: palette.green500,
  successBackground: `${palette.green500}12`,
  error: palette.red600,
  errorLight: palette.red500,
  errorBackground: `${palette.red500}12`,
  warning: palette.amber500,
  warningLight: palette.amber400,

  border: palette.gray200,
  borderLight: palette.gray100,

  skeleton: palette.gray200,
  skeletonHighlight: palette.gray100,
  overlay: 'rgba(0, 0, 0, 0.4)',
  tabBarBackground: palette.white,
  tabBarBorder: palette.gray200,
  cardGradientStart: palette.white,
  cardGradientEnd: palette.gray50,
};
