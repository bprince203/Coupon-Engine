/**
 * AppliedCouponItem — Compact card for the applied coupons list.
 * Shows coupon info with a remove button.
 */

import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { AppliedCoupon } from '../types';
import { formatCurrency, formatDiscount } from '../utils/formatCurrency';

interface AppliedCouponItemProps {
  item: AppliedCoupon;
  onRemove: (couponId: string) => void;
}

export const AppliedCouponItem = memo(function AppliedCouponItem({
  item,
  onRemove,
}: AppliedCouponItemProps) {
  const { colors, typography: typo, borderRadius: br, spacing } = useTheme();

  const handleRemove = useCallback(() => {
    onRemove(item.coupon.id);
  }, [item.coupon.id, onRemove]);

  return (
    <Animated.View
      entering={FadeInRight.duration(300)}
      exiting={FadeOutLeft.duration(300)}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderRadius: br.lg,
          borderColor: colors.border,
          padding: spacing.base,
          marginBottom: spacing.md,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.codeRow}>
          <View
            style={[
              styles.codeBadge,
              {
                backgroundColor: `${colors.accent}12`,
                borderRadius: br.sm,
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xxs,
              },
            ]}
          >
            <Text style={[typo.mono, styles.code, { color: colors.accent }]}>
              {item.coupon.code}
            </Text>
          </View>
          <Text style={[typo.caption, { color: colors.textTertiary, marginLeft: spacing.sm }]}>
            {formatDiscount(item.coupon.discountType, item.coupon.discountValue)}
          </Text>
        </View>
        <Pressable
          onPress={handleRemove}
          hitSlop={12}
          accessibilityLabel={`Remove coupon ${item.coupon.code}`}
          accessibilityRole="button"
        >
          <Ionicons name="close-circle-outline" size={22} color={colors.error} />
        </Pressable>
      </View>

      <View style={[styles.priceRow, { marginTop: spacing.sm }]}>
        <Text style={[typo.bodySmall, { color: colors.textSecondary }]}>
          Cart: {formatCurrency(item.cartTotal)}
        </Text>
        <Text style={[typo.bodySmall, { color: colors.success, fontWeight: '600' }]}>
          Saved {formatCurrency(item.discountAmount)}
        </Text>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  codeBadge: {},
  code: {
    fontWeight: '700',
    letterSpacing: 0.8,
    fontSize: 13,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
