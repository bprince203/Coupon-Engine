/**
 * Toast — Slide-in notification with auto-dismiss.
 * Supports success, error, and info variants.
 */

import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import type { ToastVariant } from '../hooks/useToast';

interface ToastProps {
  visible: boolean;
  message: string;
  variant: ToastVariant;
  onHide: () => void;
}

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: keyof typeof Ionicons.glyphMap }
> = {
  success: { icon: 'checkmark-circle' },
  error: { icon: 'alert-circle' },
  info: { icon: 'information-circle' },
};

export function Toast({ visible, message, variant, onHide }: ToastProps) {
  const { colors, typography: typo, borderRadius: br, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  const variantColors: Record<ToastVariant, string> = {
    success: colors.success,
    error: colors.error,
    info: colors.accent,
  };

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 18, stiffness: 120 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withSpring(-100, { damping: 18, stiffness: 120 });
      opacity.value = withTiming(0, { duration: 200 }, (finished) => {
        if (finished) {
          runOnJS(onHide)();
        }
      });
    }
  }, [visible, translateY, opacity, onHide]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const iconColor = variantColors[variant];
  const config = VARIANT_CONFIG[variant];

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        {
          top: insets.top + spacing.sm,
          backgroundColor: colors.surfaceElevated,
          borderRadius: br.md,
          borderLeftColor: iconColor,
        },
      ]}
      pointerEvents="none"
      accessibilityLiveRegion="polite"
    >
      <Ionicons name={config.icon} size={20} color={iconColor} />
      <Text
        style={[typo.bodySmall, styles.message, { color: colors.textPrimary }]}
        numberOfLines={2}
      >
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderLeftWidth: 3,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  message: {
    flex: 1,
    marginLeft: 10,
  },
});
