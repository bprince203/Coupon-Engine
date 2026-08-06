import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { OrderSummary } from '../types';
import { formatCurrency } from '../../coupons/utils/formatCurrency';

interface PriceBreakdownProps {
  summary: OrderSummary;
  couponCode?: string;
  itemCount?: number;
}

interface RowProps {
  label: string;
  value: string;
  valueColor?: string;
  labelColor?: string;
  isBold?: boolean;
  isLarge?: boolean;
}

function Row({ label, value, valueColor, labelColor, isBold, isLarge }: RowProps) {
  const { colors, typography: typo, spacing } = useTheme();
  return (
    <View style={[styles.row, { paddingVertical: 7 }]}>
      <Text
        style={[
          isLarge ? typo.body : typo.bodySmall,
          {
            color: labelColor ?? colors.textSecondary,
            fontWeight: isBold ? '600' : '400',
          },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          isLarge ? typo.body : typo.bodySmall,
          {
            color: valueColor ?? colors.textPrimary,
            fontWeight: isBold ? '700' : '500',
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

export const PriceBreakdown = memo(function PriceBreakdown({
  summary,
  couponCode,
  itemCount,
}: PriceBreakdownProps) {
  const { colors, typography: typo, borderRadius: br, spacing } = useTheme();

  const subtotalLabel = itemCount
    ? `Subtotal (${itemCount} item${itemCount !== 1 ? 's' : ''})`
    : 'Subtotal';

  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderRadius: br.lg,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Title */}
      <View style={[styles.titleRow, { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, borderBottomColor: colors.border }]}>
        <Text style={[typo.body, { color: colors.textPrimary, fontWeight: '700' }]}>
          Price Details
        </Text>
      </View>

      {/* Rows */}
      <View style={{ paddingHorizontal: 16 }}>
        <Row label={subtotalLabel} value={formatCurrency(summary.subtotal)} />

        {summary.itemDiscount > 0 && (
          <Row
            label="Item Discount"
            value={`−${formatCurrency(summary.itemDiscount)}`}
            valueColor={colors.success}
          />
        )}

        {summary.couponDiscount > 0 && (
          <Row
            label={couponCode ? `Coupon (${couponCode})` : 'Coupon Discount'}
            value={`−${formatCurrency(summary.couponDiscount)}`}
            valueColor={colors.success}
          />
        )}

        <Row
          label="Delivery Fee"
          value={summary.deliveryCharge === 0 ? 'FREE' : formatCurrency(summary.deliveryCharge)}
          valueColor={summary.deliveryCharge === 0 ? colors.success : colors.textPrimary}
        />

        <Row label="Platform Fee" value={formatCurrency(summary.platformFee)} />

        <Row
          label="GST & Fees (18%)"
          value={formatCurrency(summary.tax)}
        />
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.border, marginHorizontal: 16 }]} />

      {/* Grand Total */}
      <View style={[styles.totalRow, { paddingHorizontal: 16, paddingVertical: 14 }]}>
        <Text style={[typo.body, { color: colors.textPrimary, fontWeight: '700', fontSize: 15 }]}>
          Grand Total
        </Text>
        <Text style={[typo.h4, { color: colors.textPrimary, fontWeight: '800', fontSize: 18 }]}>
          {formatCurrency(summary.total)}
        </Text>
      </View>

      {/* Savings Banner */}
      {summary.savings > 0 && (
        <View
          style={[
            styles.savingsBanner,
            {
              backgroundColor: colors.successBackground,
              borderBottomLeftRadius: br.lg,
              borderBottomRightRadius: br.lg,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderTopColor: `${colors.success}30`,
            },
          ]}
        >
          <Ionicons name="pricetag" size={14} color={colors.success} />
          <Text style={[typo.bodySmall, { color: colors.success, fontWeight: '600', marginLeft: 6 }]}>
            You save {formatCurrency(summary.savings)} on this order 🎉
          </Text>
        </View>
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
  },
});
