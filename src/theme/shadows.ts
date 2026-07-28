/**
 * Elevation shadow presets for iOS and Android.
 * Platform-specific because iOS uses shadow* props while Android uses elevation.
 */

import { Platform, ViewStyle } from 'react-native';

interface ShadowPreset {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

const createShadow = (
  offsetY: number,
  radius: number,
  opacity: number,
  elevation: number,
  color = '#000000',
): ViewStyle => ({
  ...Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: {
      elevation,
    },
  }),
});

export const shadows = {
  /** Subtle — cards, list items */
  sm: createShadow(1, 3, 0.08, 2),
  /** Medium — elevated cards, dropdowns */
  md: createShadow(2, 6, 0.12, 4),
  /** Large — modals, floating elements */
  lg: createShadow(4, 12, 0.16, 8),
  /** Extra large — popovers */
  xl: createShadow(8, 24, 0.2, 12),
  /** None */
  none: createShadow(0, 0, 0, 0),
} as const;

/**
 * Glow shadows for accent elements (active status badges, CTAs).
 * Uses colored shadow for a subtle glow effect on iOS.
 */
export const glows = {
  accent: createShadow(2, 8, 0.3, 4, '#7C3AED'),
  success: createShadow(2, 8, 0.3, 4, '#22C55E'),
  error: createShadow(2, 8, 0.3, 4, '#EF4444'),
} as const;
