/**
 * PrimaryButton — Main CTA button with loading state and press animation.
 */

import React from 'react';
import { StyleSheet, Text, ActivityIndicator, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme';
import { AnimatedPressable } from './AnimatedPressable';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'filled' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

export function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'filled',
  size = 'md',
  style,
  testID,
  accessibilityLabel,
}: PrimaryButtonProps) {
  const { colors, typography: typo, borderRadius: br, spacing } = useTheme();

  const isDisabled = disabled || loading;

  const sizeStyles: Record<string, ViewStyle> = {
    sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.base },
    md: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
    lg: { paddingVertical: spacing.base, paddingHorizontal: spacing.xl },
  };

  const containerStyle: ViewStyle = {
    ...sizeStyles[size],
    borderRadius: br.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    opacity: isDisabled ? 0.5 : 1,
    ...(variant === 'filled' && { backgroundColor: colors.accent }),
    ...(variant === 'outline' && {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.accent,
    }),
    ...(variant === 'ghost' && { backgroundColor: 'transparent' }),
  };

  const textColor =
    variant === 'filled' ? colors.textInverse : colors.accent;

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      style={[containerStyle, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel ?? title}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={textColor}
          style={styles.loader}
        />
      ) : null}
      <Text style={[typo.button, { color: textColor }]}>{title}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  loader: {
    marginRight: 8,
  },
});
