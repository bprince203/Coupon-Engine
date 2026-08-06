import React, { memo, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { AnimatedPressable } from '../../../shared/components/AnimatedPressable';
import { Coupon } from '../../coupons/types';
import { formatCurrency, formatDiscount } from '../../coupons/utils/formatCurrency';
import { getExpiryText } from '../../coupons/utils/formatDate';

export type CouponEligibility =
  | { status: 'eligible'; savingsAmount: number }
  | { status: 'applied'; discountAmount: number }
  | {
      status: 'locked';
      reason: string;
      errorCode?: string;
      /** Amount remaining to meet minimum (only when errorCode === 'MINIMUM_NOT_MET') */
      remainingAmount?: number;
      /** Minimum order value for the coupon */
      minimumOrder?: number;
      /** Cart progress toward minimum, 0–1 */
      progress?: number;
      /** Cart total at validation time */
      cartTotal?: number;
    }
  | { status: 'expired' };

interface CouponDrawerCardProps {
  coupon: Coupon;
  eligibility: CouponEligibility;
  onApply: (coupon: Coupon) => void;
  onRemove: (coupon: Coupon) => void;
}

export const CouponDrawerCard = memo(function CouponDrawerCard({
  coupon,
  eligibility,
  onApply,
  onRemove,
}: CouponDrawerCardProps) {
  const { colors, typography: typo, borderRadius: br } = useTheme();

  const handlePress = useCallback(() => {
    if (eligibility.status === 'applied') onRemove(coupon);
    else if (eligibility.status === 'eligible') onApply(coupon);
  }, [coupon, eligibility, onApply, onRemove]);

  const isApplied = eligibility.status === 'applied';
  const isEligible = eligibility.status === 'eligible';
  const isLocked = eligibility.status === 'locked';
  const isExpired = eligibility.status === 'expired';

  const isMinimumNotMet =
    isLocked && eligibility.status === 'locked' && eligibility.errorCode === 'MINIMUM_NOT_MET';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: isApplied
            ? colors.success
            : isExpired
            ? colors.border
            : colors.border,
          borderRadius: br.lg,
          opacity: isExpired ? 0.55 : 1,
        },
      ]}
    >
      {/* ── Applied banner ─────────────────────────────────────────────────── */}
      {isApplied && (
        <View
          style={[
            styles.appliedBanner,
            {
              backgroundColor: colors.successBackground,
              borderTopLeftRadius: br.lg,
              borderTopRightRadius: br.lg,
              paddingHorizontal: 12,
              paddingVertical: 7,
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={13} color={colors.success} />
          <Text style={[typo.caption, { color: colors.success, fontWeight: '700', marginLeft: 5 }]}>
            Coupon Applied · You saved {formatCurrency(eligibility.discountAmount)}
          </Text>
        </View>
      )}

      {/* ── Card Body ──────────────────────────────────────────────────────── */}
      <View style={styles.body}>
        {/* Top row: code chip + discount label + action */}
        <View style={styles.topRow}>
          <View style={styles.topLeft}>
            {/* Code chip */}
            <View
              style={[
                styles.codeChip,
                {
                  borderColor: isApplied
                    ? colors.success
                    : isExpired
                    ? colors.textTertiary
                    : colors.accent,
                  backgroundColor: isApplied
                    ? `${colors.success}12`
                    : isExpired
                    ? `${colors.textTertiary}10`
                    : `${colors.accent}0D`,
                },
              ]}
            >
              <Text
                style={[
                  typo.mono,
                  {
                    color: isApplied
                      ? colors.success
                      : isExpired
                      ? colors.textTertiary
                      : colors.accent,
                    fontWeight: '700',
                    fontSize: 12,
                    letterSpacing: 0.5,
                  },
                ]}
              >
                {coupon.code}
              </Text>
            </View>

            {/* Discount label */}
            <Text
              style={[
                typo.bodySmall,
                { color: colors.textPrimary, fontWeight: '600', marginLeft: 8, flex: 1 },
              ]}
              numberOfLines={1}
            >
              {formatDiscount(coupon.discountType, coupon.discountValue)}
            </Text>
          </View>

          {/* Action button — eligible or applied only */}
          {(isEligible || isApplied) && (
            <AnimatedPressable
              onPress={handlePress}
              style={[
                styles.actionBtn,
                {
                  backgroundColor: isApplied ? 'transparent' : colors.accent,
                  borderColor: isApplied ? colors.error : 'transparent',
                  borderWidth: isApplied ? 1.5 : 0,
                },
              ]}
              pressScale={0.93}
              accessibilityLabel={isApplied ? `Remove ${coupon.code}` : `Apply ${coupon.code}`}
              testID={`coupon-action-${coupon.id}`}
            >
              <Text
                style={[
                  typo.caption,
                  {
                    color: isApplied ? colors.error : '#FFFFFF',
                    fontWeight: '700',
                    letterSpacing: 0.3,
                  },
                ]}
              >
                {isApplied ? 'REMOVE' : 'APPLY'}
              </Text>
            </AnimatedPressable>
          )}

          {/* Expired badge */}
          {isExpired && (
            <View style={[styles.expiredBadge, { backgroundColor: `${colors.error}12` }]}>
              <Text style={[typo.caption, { color: colors.error, fontWeight: '700' }]}>
                Expired
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        <Text
          style={[typo.bodySmall, { color: colors.textSecondary, marginTop: 6, lineHeight: 18 }]}
          numberOfLines={2}
        >
          {coupon.description}
        </Text>

        {/* Progress Bar — only for MINIMUM_NOT_MET locked coupons */}
        {isMinimumNotMet && eligibility.status === 'locked' && eligibility.progress !== undefined && (
          <View style={{ marginTop: 10 }}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.accent,
                    width: `${Math.round((eligibility.progress ?? 0) * 100)}%` as any,
                  },
                ]}
              />
            </View>
            <View style={[styles.progressLabels, { marginTop: 5 }]}>
              <Text style={[typo.caption, { color: colors.textSecondary, fontWeight: '500' }]}>
                {formatCurrency(eligibility.cartTotal ?? 0)} of {formatCurrency(eligibility.minimumOrder ?? 0)}
              </Text>
              <Text style={[typo.caption, { color: OFFER_COLOR, fontWeight: '600' }]}>
                Add {formatCurrency(eligibility.remainingAmount ?? 0)} more
              </Text>
            </View>
          </View>
        )}

        {/* Meta chips row */}
        <View style={[styles.metaRow, { marginTop: 8 }]}>
          {coupon.minimumOrderValue > 0 && !isMinimumNotMet && (
            <Text style={[styles.metaChip, { color: colors.textTertiary, borderColor: colors.border }]}>
              Min. {formatCurrency(coupon.minimumOrderValue)}
            </Text>
          )}
          {coupon.maxDiscount && coupon.maxDiscount > 0 && (
            <Text style={[styles.metaChip, { color: colors.textTertiary, borderColor: colors.border }]}>
              Max. {formatCurrency(coupon.maxDiscount)}
            </Text>
          )}
          <Text style={[styles.metaChip, { color: colors.textTertiary, borderColor: colors.border }]}>
            {getExpiryText(coupon.expiryDate)}
          </Text>
        </View>

        {/* Status badge row */}
        <View style={[styles.statusRow, { marginTop: 10 }]}>
          {isEligible && (
            <View style={[styles.statusBadge, { backgroundColor: colors.successBackground }]}>
              <View style={[styles.dot, { backgroundColor: colors.success }]} />
              <Text style={[typo.caption, { color: colors.success, fontWeight: '600' }]}>
                Eligible · Save {formatCurrency(eligibility.savingsAmount)}
              </Text>
            </View>
          )}
          {isApplied && (
            <View style={[styles.statusBadge, { backgroundColor: colors.successBackground }]}>
              <Ionicons name="checkmark-circle" size={12} color={colors.success} />
              <Text style={[typo.caption, { color: colors.success, fontWeight: '600', marginLeft: 4 }]}>
                Applied
              </Text>
            </View>
          )}
          {isLocked && !isMinimumNotMet && eligibility.status === 'locked' && (
            <View style={[styles.statusBadge, { backgroundColor: `${colors.error}10` }]}>
              <Ionicons name="lock-closed" size={11} color={colors.error} />
              <Text
                style={[typo.caption, { color: colors.error, marginLeft: 4 }]}
                numberOfLines={1}
              >
                {eligibility.reason}
              </Text>
            </View>
          )}
          {isLocked && isMinimumNotMet && eligibility.status === 'locked' && (
            <View style={[styles.statusBadge, { backgroundColor: `${OFFER_COLOR}12` }]}>
              <Ionicons name="lock-closed" size={11} color={OFFER_COLOR} />
              <Text style={[typo.caption, { color: OFFER_COLOR, fontWeight: '600', marginLeft: 4 }]}>
                Add more to unlock
              </Text>
            </View>
          )}
          {isExpired && (
            <View style={[styles.statusBadge, { backgroundColor: `${colors.error}10` }]}>
              <Ionicons name="time-outline" size={12} color={colors.error} />
              <Text style={[typo.caption, { color: colors.error, marginLeft: 4 }]}>
                This coupon has expired
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
});

// ─── Styles ──────────────────────────────────────────────────────────────────

const OFFER_COLOR = '#F97316';

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  appliedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  codeChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    flexShrink: 0,
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    flexShrink: 0,
  },
  expiredBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    flexShrink: 0,
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    minWidth: 6,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaChip: {
    fontSize: 11,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },
  statusRow: {
    flexDirection: 'row',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
});
