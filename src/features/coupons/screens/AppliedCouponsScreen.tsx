/**
 * AppliedCouponsScreen — Shows all coupons applied in the current session.
 * Supports removing individual coupons and shows total savings.
 */

import React, { useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../../theme';
import { ScreenContainer } from '../../../shared/components/ScreenContainer';
import { PrimaryButton } from '../../../shared/components/PrimaryButton';
import { EmptyView } from '../../../shared/components/EmptyView';
import { Toast } from '../../../shared/components/Toast';
import { AppliedCouponItem } from '../components/AppliedCouponItem';
import { useCouponStore } from '../store/useCouponStore';
import { useToast } from '../../../shared/hooks/useToast';
import { AppliedCoupon } from '../types';
import { formatCurrency } from '../utils/formatCurrency';

export function AppliedCouponsScreen() {
  const { colors, typography: typo, borderRadius: br, spacing } = useTheme();
  const { appliedCoupons, removeCoupon, clearAll, getTotalSavings } = useCouponStore();
  const { toast, showToast, hideToast } = useToast();

  const handleRemove = useCallback(
    (couponId: string) => {
      removeCoupon(couponId);
      showToast('Coupon removed', 'info');
    },
    [removeCoupon, showToast],
  );

  const handleClearAll = useCallback(() => {
    clearAll();
    showToast('All coupons cleared', 'info');
  }, [clearAll, showToast]);

  const renderItem = useCallback(
    ({ item }: { item: AppliedCoupon }) => (
      <AppliedCouponItem item={item} onRemove={handleRemove} />
    ),
    [handleRemove],
  );

  const keyExtractor = useCallback((item: AppliedCoupon) => item.coupon.id, []);

  const totalSavings = getTotalSavings();

  return (
    <ScreenContainer>
      <Toast
        visible={toast.visible}
        message={toast.message}
        variant={toast.variant}
        onHide={hideToast}
      />
      <Text style={[typo.h2, styles.title, { color: colors.textPrimary }]}>
        Applied Coupons
      </Text>

      {appliedCoupons.length === 0 ? (
        <EmptyView
          icon="receipt-outline"
          title="No coupons applied"
          subtitle="Validate and apply coupons to see them here"
        />
      ) : (
        <>
          {/* Savings Summary */}
          <Animated.View
            entering={FadeInDown.duration(400).springify()}
            style={[
              styles.savingsCard,
              {
                backgroundColor: colors.successBackground,
                borderRadius: br.lg,
                padding: spacing.base,
                marginTop: spacing.base,
                marginBottom: spacing.base,
              },
            ]}
          >
            <View style={styles.savingsRow}>
              <Text style={[typo.bodySmall, { color: colors.success }]}>
                Total Savings
              </Text>
              <Text style={[typo.h3, { color: colors.success }]}>
                {formatCurrency(totalSavings)}
              </Text>
            </View>
            <Text style={[typo.caption, { color: colors.success, marginTop: spacing.xs }]}>
              {appliedCoupons.length} coupon{appliedCoupons.length !== 1 ? 's' : ''} applied
            </Text>
          </Animated.View>

          {/* Applied List */}
          <View style={styles.listContainer}>
            <FlashList
              data={appliedCoupons}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: spacing.xxxl }}
            />
          </View>

          {/* Clear All */}
          <View style={[styles.footer, { paddingBottom: spacing.base }]}>
            <PrimaryButton
              title="Clear All"
              onPress={handleClearAll}
              variant="ghost"
              size="sm"
              testID="clear-all-button"
              accessibilityLabel="Clear all applied coupons"
            />
          </View>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 8,
  },
  savingsCard: {},
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
  },
});
