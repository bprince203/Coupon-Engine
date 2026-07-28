/**
 * CouponDetailScreen — Full coupon details with copy code and apply actions.
 */

import React, { useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { ScreenContainer } from '../../../shared/components/ScreenContainer';
import { PrimaryButton } from '../../../shared/components/PrimaryButton';
import { ErrorView } from '../../../shared/components/ErrorView';
import { Toast } from '../../../shared/components/Toast';
import { StatusBadge } from '../components/StatusBadge';
import { DiscountChip } from '../components/DiscountChip';
import { useCouponById } from '../hooks/useCouponById';
import { useClipboard } from '../hooks/useClipboard';
import { useToast } from '../../../shared/hooks/useToast';
import { formatCurrency } from '../utils/formatCurrency';
import { getExpiryText } from '../utils/formatDate';
import { CouponCardSkeleton } from '../components/CouponCardSkeleton';
import type { CouponDetailScreenProps } from '../../../navigation/navigationTypes';

export function CouponDetailScreen({ route, navigation }: CouponDetailScreenProps) {
  const { couponId } = route.params;
  const { colors, typography: typo, borderRadius: br, spacing } = useTheme();
  const { data: coupon, isLoading, isError, error, refetch } = useCouponById(couponId);
  const { copy } = useClipboard();
  const { toast, showToast, hideToast } = useToast();

  const handleCopyCode = useCallback(async () => {
    if (!coupon) return;
    const success = await copy(coupon.code);
    if (success) {
      showToast('Coupon code copied to clipboard!', 'success');
    } else {
      showToast('Failed to copy code', 'error');
    }
  }, [coupon, copy, showToast]);

  const handleApply = useCallback(() => {
    if (!coupon) return;
    // Navigate to validator with prefilled code
    navigation.getParent()?.navigate('ValidatorTab', { prefillCode: coupon.code });
  }, [coupon, navigation]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <CouponCardSkeleton />
        <CouponCardSkeleton />
      </ScreenContainer>
    );
  }

  if (isError || !coupon) {
    return (
      <ScreenContainer>
        <ErrorView
          message={error?.message ?? 'Coupon not found'}
          onRetry={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  const isExpired = coupon.status === 'expired';

  return (
    <ScreenContainer>
      <Toast
        visible={toast.visible}
        message={toast.message}
        variant={toast.variant}
        onHide={hideToast}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xxxl }}
      >
        {/* Code + Status */}
        <Animated.View
          entering={FadeInDown.duration(400).springify()}
          style={[
            styles.codeCard,
            {
              backgroundColor: colors.surface,
              borderRadius: br.xl,
              borderColor: colors.border,
              padding: spacing.xl,
              marginTop: spacing.base,
            },
          ]}
        >
          <View style={styles.codeRow}>
            <Text style={[typo.monoLarge, { color: colors.accent }]}>
              {coupon.code}
            </Text>
            <StatusBadge status={coupon.status} />
          </View>
          <DiscountChip
            discountType={coupon.discountType}
            discountValue={coupon.discountValue}
          />
        </Animated.View>

        {/* Description */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400).springify()}
          style={{ marginTop: spacing.xl }}
        >
          <Text style={[typo.body, { color: colors.textSecondary, lineHeight: 24 }]}>
            {coupon.description}
          </Text>
        </Animated.View>

        {/* Details Card */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400).springify()}
          style={[
            styles.detailsCard,
            {
              backgroundColor: colors.surface,
              borderRadius: br.lg,
              borderColor: colors.border,
              padding: spacing.base,
              marginTop: spacing.xl,
            },
          ]}
        >
          <DetailRow
            icon="cash-outline"
            label="Minimum Order"
            value={coupon.minimumOrderValue > 0 ? formatCurrency(coupon.minimumOrderValue) : 'No minimum'}
            colors={colors}
            typo={typo}
            spacing={spacing}
          />
          <DetailRow
            icon="time-outline"
            label="Expiry"
            value={getExpiryText(coupon.expiryDate)}
            colors={colors}
            typo={typo}
            spacing={spacing}
            valueColor={isExpired ? colors.error : colors.textPrimary}
          />
          <DetailRow
            icon="grid-outline"
            label="Categories"
            value={coupon.applicableCategories
              .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
              .join(', ')}
            colors={colors}
            typo={typo}
            spacing={spacing}
            isLast
          />
          {coupon.maxDiscount !== undefined && coupon.maxDiscount > 0 && (
            <DetailRow
              icon="trending-down-outline"
              label="Max Discount"
              value={formatCurrency(coupon.maxDiscount)}
              colors={colors}
              typo={typo}
              spacing={spacing}
              isLast
            />
          )}
        </Animated.View>

        {/* Actions */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400).springify()}
          style={{ marginTop: spacing.xl, gap: spacing.md }}
        >
          <PrimaryButton
            title="Copy Code"
            onPress={handleCopyCode}
            variant="outline"
            size="lg"
            testID="copy-code-button"
            accessibilityLabel="Copy coupon code to clipboard"
          />
          {!isExpired && (
            <PrimaryButton
              title="Apply Coupon"
              onPress={handleApply}
              variant="filled"
              size="lg"
              testID="apply-coupon-button"
              accessibilityLabel="Apply this coupon"
            />
          )}
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── Detail Row Sub-component ────────────────────────────────────

interface DetailRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  colors: ReturnType<typeof useTheme>['colors'];
  typo: ReturnType<typeof useTheme>['typography'];
  spacing: ReturnType<typeof useTheme>['spacing'];
  valueColor?: string;
  isLast?: boolean;
}

function DetailRow({ icon, label, value, colors, typo, spacing, valueColor, isLast }: DetailRowProps) {
  return (
    <View
      style={[
        detailStyles.row,
        !isLast && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
          paddingBottom: spacing.md,
          marginBottom: spacing.md,
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={colors.textTertiary} style={detailStyles.icon} />
      <View style={detailStyles.textContainer}>
        <Text style={[typo.caption, { color: colors.textTertiary }]}>{label}</Text>
        <Text style={[typo.body, { color: valueColor ?? colors.textPrimary, marginTop: 2 }]}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  codeCard: {
    borderWidth: 1,
    alignItems: 'flex-start',
    gap: 12,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  detailsCard: {
    borderWidth: 1,
  },
});

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
});
