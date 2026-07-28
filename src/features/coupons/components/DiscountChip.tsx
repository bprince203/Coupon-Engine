/**
 * DiscountChip — Colored chip showing the discount value and type.
 * e.g. "20% OFF", "₹100 OFF", "FREE SHIPPING"
 */

import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../theme';
import { DiscountType } from '../types';
import { formatDiscount } from '../utils/formatCurrency';

interface DiscountChipProps {
  discountType: DiscountType;
  discountValue: number;
}

export const DiscountChip = memo(function DiscountChip({
  discountType,
  discountValue,
}: DiscountChipProps) {
  const { colors, typography: typo, borderRadius: br, spacing } = useTheme();

  const chipColor =
    discountType === 'percentage'
      ? colors.accent
      : discountType === 'flat'
        ? colors.success
        : colors.warning;

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: `${chipColor}18`,
          borderRadius: br.sm,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
        },
      ]}
      accessibilityLabel={`Discount: ${formatDiscount(discountType, discountValue)}`}
    >
      <Text style={[typo.caption, styles.text, { color: chipColor }]}>
        {formatDiscount(discountType, discountValue)}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
