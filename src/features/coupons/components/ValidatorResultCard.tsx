/**
 * ValidatorResultCard — Displays the validation result with success/error styling.
 * Shows price breakdown on success, error message on failure.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { ValidationResult } from '../types';
import { formatCurrency, formatDiscount } from '../utils/formatCurrency';
import { PriceSummary } from './PriceSummary';

interface ValidatorResultCardProps {
  result: ValidationResult;
  cartTotal: number;
}

export function ValidatorResultCard({ result, cartTotal }: ValidatorResultCardProps) {
  const { colors, typography: typo, borderRadius: br, spacing } = useTheme();

  const isSuccess = result.isValid;

  return (
    <Animated.View
      entering={FadeInUp.duration(400).springify()}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderRadius: br.lg,
          borderColor: isSuccess ? colors.success : colors.error,
          padding: spacing.base,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: isSuccess ? colors.successBackground : colors.errorBackground,
            },
          ]}
        >
          <Ionicons
            name={isSuccess ? 'checkmark-circle' : 'close-circle'}
            size={28}
            color={isSuccess ? colors.success : colors.error}
          />
        </View>
        <View style={styles.headerText}>
          <Text style={[typo.h4, { color: colors.textPrimary }]}>
            {isSuccess ? 'Coupon Applied!' : 'Invalid Coupon'}
          </Text>
          {isSuccess && result.coupon ? (
            <Text style={[typo.bodySmall, { color: colors.textSecondary, marginTop: 2 }]}>
              {formatDiscount(result.coupon.discountType, result.coupon.discountValue)}
            </Text>
          ) : (
            <Text style={[typo.bodySmall, { color: colors.error, marginTop: 2 }]}>
              {result.errorMessage}
            </Text>
          )}
        </View>
      </View>

      {/* Price Breakdown (success only) */}
      {isSuccess && result.discountAmount !== undefined && result.finalPrice !== undefined && (
        <View style={[styles.divider, { borderColor: colors.border, marginVertical: spacing.md }]}>
          <PriceSummary
            cartTotal={cartTotal}
            discountAmount={result.discountAmount}
            finalPrice={result.finalPrice}
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  divider: {
    borderTopWidth: 1,
    paddingTop: 12,
  },
});
