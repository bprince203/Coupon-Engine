/**
 * PriceSummary — Shows cart total, discount, and final price.
 * Strikethrough on original price when discount is applied.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../theme';
import { formatCurrency } from '../utils/formatCurrency';

interface PriceSummaryProps {
  cartTotal: number;
  discountAmount: number;
  finalPrice: number;
}

export function PriceSummary({ cartTotal, discountAmount, finalPrice }: PriceSummaryProps) {
  const { colors, typography: typo, spacing } = useTheme();

  return (
    <View>
      <View style={styles.row}>
        <Text style={[typo.body, { color: colors.textSecondary }]}>Cart Total</Text>
        <Text style={[typo.body, { color: colors.textSecondary, textDecorationLine: discountAmount > 0 ? 'line-through' : 'none' }]}>
          {formatCurrency(cartTotal)}
        </Text>
      </View>

      {discountAmount > 0 && (
        <View style={[styles.row, { marginTop: spacing.sm }]}>
          <Text style={[typo.body, { color: colors.success }]}>Discount</Text>
          <Text style={[typo.body, { color: colors.success, fontWeight: '600' }]}>
            -{formatCurrency(discountAmount)}
          </Text>
        </View>
      )}

      <View style={[styles.divider, { borderColor: colors.border, marginVertical: spacing.sm }]} />

      <View style={styles.row}>
        <Text style={[typo.h4, { color: colors.textPrimary }]}>Final Price</Text>
        <Text style={[typo.h4, { color: colors.accent }]}>
          {formatCurrency(finalPrice)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
