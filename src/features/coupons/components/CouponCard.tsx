/**
 * CouponCard — Premium list item for the coupon list.
 * Shows code, discount, description, expiry, and status in a card layout.
 */

import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../../theme';
import { Coupon } from '../types';
import { StatusBadge } from './StatusBadge';
import { DiscountChip } from './DiscountChip';
import { AnimatedPressable } from '../../../shared/components/AnimatedPressable';
import { getExpiryText } from '../utils/formatDate';
import { Ionicons } from '@expo/vector-icons';

interface CouponCardProps {
  coupon: Coupon;
  onPress: (coupon: Coupon) => void;
  index: number;
}

export const CouponCard = memo(function CouponCard({
  coupon,
  onPress,
  index,
}: CouponCardProps) {
  const { colors, typography: typo, borderRadius: br, spacing, shadows: sh } = useTheme();

  const handlePress = useCallback(() => {
    onPress(coupon);
  }, [coupon, onPress]);

  const isExpired = coupon.status === 'expired';

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(400).springify()}>
      <AnimatedPressable
        onPress={handlePress}
        style={[
          styles.card,
          sh.sm,
          {
            backgroundColor: colors.surface,
            borderRadius: br.lg,
            borderColor: colors.border,
            padding: spacing.base,
            marginBottom: spacing.md,
            opacity: isExpired ? 0.65 : 1,
          },
        ]}
        accessibilityLabel={`Coupon ${coupon.code}: ${coupon.description}`}
        testID={`coupon-card-${coupon.id}`}
      >
        {/* Top Row: Code + Status */}
        <View style={styles.topRow}>
          <View style={styles.codeContainer}>
            <View
              style={[
                styles.codeBadge,
                {
                  backgroundColor: `${colors.accent}12`,
                  borderRadius: br.sm,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                },
              ]}
            >
              <Text style={[typo.mono, styles.codeText, { color: colors.accent }]}>
                {coupon.code}
              </Text>
            </View>
          </View>
          <StatusBadge status={coupon.status} />
        </View>

        {/* Description */}
        <Text
          style={[
            typo.bodySmall,
            { color: colors.textSecondary, marginTop: spacing.md },
          ]}
          numberOfLines={2}
        >
          {coupon.description}
        </Text>

        {/* Bottom Row: Discount Chip + Expiry */}
        <View style={[styles.bottomRow, { marginTop: spacing.md }]}>
          <DiscountChip
            discountType={coupon.discountType}
            discountValue={coupon.discountValue}
          />
          <View style={styles.expiryRow}>
            <Ionicons
              name="time-outline"
              size={14}
              color={colors.textTertiary}
              style={styles.expiryIcon}
            />
            <Text style={[typo.caption, { color: colors.textTertiary }]}>
              {getExpiryText(coupon.expiryDate)}
            </Text>
          </View>
        </View>
      </AnimatedPressable>
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
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeBadge: {},
  codeText: {
    fontWeight: '700',
    letterSpacing: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryIcon: {
    marginRight: 4,
  },
});
