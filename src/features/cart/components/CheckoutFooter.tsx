/**
 * CheckoutFooter — Sticky bottom bar with total and checkout CTA.
 * White card with divider, total + savings on left, full-width purple button.
 */

import React, { memo } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { AnimatedPressable } from '../../../shared/components/AnimatedPressable';
import { formatCurrency } from '../../coupons/utils/formatCurrency';

interface CheckoutFooterProps {
  total: number;
  savings: number;
  itemCount: number;
  onCheckout: () => void;
  disabled?: boolean;
  label?: string;
}

export const CheckoutFooter = memo(function CheckoutFooter({
  total,
  savings,
  itemCount,
  onCheckout,
  disabled = false,
  label = 'Proceed to Checkout',
}: CheckoutFooterProps) {
  const { colors, typography: typo, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const isDisabled = disabled || itemCount === 0;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingTop: 12,
          paddingHorizontal: spacing.base,
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={styles.inner}>
        {/* Left: Total + savings */}
        <View style={styles.priceSection}>
          <Text style={[typo.h4, { color: colors.textPrimary, fontWeight: '800' }]}>
            {formatCurrency(total)}
          </Text>
          {savings > 0 && (
            <Text style={[typo.caption, { color: colors.success, fontWeight: '600', marginTop: 1 }]}>
              Save {formatCurrency(savings)}
            </Text>
          )}
        </View>

        {/* Right: CTA Button */}
        <AnimatedPressable
          onPress={onCheckout}
          disabled={isDisabled}
          style={[
            styles.ctaButton,
            {
              backgroundColor: isDisabled ? colors.textTertiary : colors.accent,
              opacity: isDisabled ? 0.5 : 1,
            },
          ]}
          pressScale={0.96}
          accessibilityLabel={label}
          testID="checkout-button"
        >
          <Text style={[typo.button, { color: '#FFFFFF', fontWeight: '700' }]}>
            {label}
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
        </AnimatedPressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceSection: {
    width: 90,
  },
  ctaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
  },
});
