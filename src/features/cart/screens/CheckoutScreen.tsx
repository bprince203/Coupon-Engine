import React, { useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';
import { AnimatedPressable } from '../../../shared/components/AnimatedPressable';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { CheckoutFooter } from '../components/CheckoutFooter';
import { Toast } from '../../../shared/components/Toast';
import { useCartStore } from '../store/useCartStore';
import { useCouponStore } from '../../coupons/store/useCouponStore';
import { useToast } from '../../../shared/hooks/useToast';
import { formatCurrency } from '../../coupons/utils/formatCurrency';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CartStackParamList } from '../../../navigation/navigationTypes';

type CheckoutScreenProps = NativeStackScreenProps<CartStackParamList, 'Checkout'>;

const MOCK_USER = {
  name: 'Rahul Sharma',
  address: 'Home – Bengaluru, Karnataka 560001',
  phone: '+91 98765 43210',
};

export function CheckoutScreen({ navigation }: CheckoutScreenProps) {
  const { colors, typography: typo, borderRadius: br, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { items, getSubtotal, getItemCount, getOrderSummary } = useCartStore();
  const { activeCoupon } = useCouponStore();
  const { toast, showToast, hideToast } = useToast();

  const couponDiscount = activeCoupon?.discountAmount ?? 0;
  const summary = getOrderSummary(couponDiscount);
  const itemCount = getItemCount();

  const handlePayment = useCallback(() => navigation.navigate('Payment'), [navigation]);

  const handleChangeAddress = useCallback(() => {
    showToast('Address management coming soon', 'info');
  }, [showToast]);

  const handleViewAllItems = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={[styles.flex, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <Toast visible={toast.visible} message={toast.message} variant={toast.variant} onHide={hideToast} />
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, paddingHorizontal: 16 }]}>
        <AnimatedPressable onPress={() => navigation.goBack()} pressScale={0.9} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </AnimatedPressable>
        <Text style={[typo.h4, { color: colors.textPrimary, fontWeight: '700' }]}>Checkout</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Delivery Address */}
        <Animated.View
          entering={FadeInDown.duration(350).springify()}
          style={[styles.sectionCard, { backgroundColor: colors.surface, borderBottomColor: colors.border, borderTopColor: colors.border, marginTop: 12 }]}
        >
          <View style={[styles.sectionHeader, { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 }]}>
            <Text style={[typo.overline, { color: colors.textTertiary }]}>DELIVER TO</Text>
          </View>
          <View style={[styles.addressBody, { paddingHorizontal: 16, paddingBottom: 14 }]}>
            <View style={styles.addressRow}>
              <Ionicons name="person-circle-outline" size={36} color={colors.textTertiary} />
              <View style={styles.addressInfo}>
                <Text style={[typo.body, { color: colors.textPrimary, fontWeight: '600' }]}>
                  {MOCK_USER.name}
                </Text>
                <Text style={[typo.bodySmall, { color: colors.textSecondary, marginTop: 2, lineHeight: 20 }]}>
                  {MOCK_USER.address}
                </Text>
                <Text style={[typo.caption, { color: colors.textTertiary, marginTop: 2 }]}>
                  {MOCK_USER.phone}
                </Text>
              </View>
              <AnimatedPressable onPress={handleChangeAddress} pressScale={0.93}>
                <Text style={[typo.buttonSmall, { color: colors.accent }]}>Change</Text>
              </AnimatedPressable>
            </View>
          </View>
        </Animated.View>

        {/* Order Items */}
        <Animated.View
          entering={FadeInDown.delay(60).duration(350).springify()}
          style={[styles.sectionCard, { backgroundColor: colors.surface, borderBottomColor: colors.border, borderTopColor: colors.border, marginTop: 8 }]}
        >
          <View style={[styles.sectionHeaderRow, { paddingHorizontal: 16, paddingVertical: 14 }]}>
            <Text style={[typo.body, { color: colors.textPrimary, fontWeight: '700' }]}>
              Order Items ({itemCount})
            </Text>
            <AnimatedPressable onPress={handleViewAllItems} pressScale={0.93}>
              <Text style={[typo.buttonSmall, { color: colors.accent }]}>View all</Text>
            </AnimatedPressable>
          </View>
          {/* Preview: first 2 items */}
          {items.slice(0, 2).map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                {
                  paddingHorizontal: 16,
                  paddingBottom: 12,
                  borderTopColor: colors.border,
                  borderTopWidth: index === 0 ? StyleSheet.hairlineWidth : 0,
                  paddingTop: 12,
                },
              ]}
            >
              <View style={[styles.miniImage, { backgroundColor: item.gradientColors[0], borderRadius: 8 }]}>
                <Text style={styles.miniText}>{item.initials}</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={[typo.bodySmall, { color: colors.textPrimary, fontWeight: '500' }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[typo.caption, { color: colors.textTertiary, marginTop: 2 }]}>
                  Qty: {item.quantity}
                </Text>
              </View>
              <Text style={[typo.bodySmall, { color: colors.textPrimary, fontWeight: '600' }]}>
                {formatCurrency(item.price * item.quantity)}
              </Text>
            </View>
          ))}
          {items.length > 2 && (
            <Text style={[typo.caption, { color: colors.textTertiary, paddingHorizontal: 16, paddingBottom: 12 }]}>
              + {items.length - 2} more item{items.length - 2 !== 1 ? 's' : ''}
            </Text>
          )}
        </Animated.View>

        {/* Applied Coupon */}
        {activeCoupon && (
          <Animated.View
            entering={FadeInDown.delay(120).duration(350).springify()}
            style={[styles.sectionCard, { backgroundColor: colors.surface, borderBottomColor: colors.border, borderTopColor: colors.border, marginTop: 8 }]}
          >
            <View style={[styles.couponRow, { paddingHorizontal: 16, paddingVertical: 14 }]}>
              <View style={styles.rowCenter}>
                <Ionicons name="pricetags" size={16} color={colors.success} />
                <Text style={[typo.bodySmall, { color: colors.textPrimary, fontWeight: '600', marginLeft: 8 }]}>
                  Applied Coupon
                </Text>
              </View>
              <View style={styles.rowCenter}>
                <View style={[styles.codeChip, { backgroundColor: `${colors.success}12`, borderColor: `${colors.success}40` }]}>
                  <Text style={[typo.mono, { color: colors.success, fontWeight: '700', fontSize: 12 }]}>
                    {activeCoupon.coupon.code}
                  </Text>
                </View>
                <Text style={[typo.caption, { color: colors.success, marginLeft: 8, fontWeight: '600' }]}>
                  −{formatCurrency(activeCoupon.discountAmount)}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Price Details */}
        <Animated.View
          entering={FadeInDown.delay(180).duration(350).springify()}
          style={{ marginTop: 8 }}
        >
          <PriceBreakdown
            summary={summary}
            couponCode={activeCoupon?.coupon.code}
            itemCount={items.length}
          />
        </Animated.View>

        {/* Payment Method Preview */}
        <Animated.View
          entering={FadeInDown.delay(240).duration(350).springify()}
          style={[styles.sectionCard, { backgroundColor: colors.surface, borderBottomColor: colors.border, borderTopColor: colors.border, marginTop: 8 }]}
        >
          <View style={[styles.sectionHeaderRow, { paddingHorizontal: 16, paddingVertical: 14 }]}>
            <View style={styles.rowCenter}>
              <View style={[styles.methodIcon, { backgroundColor: '#F0F4FF' }]}>
                <Ionicons name="phone-portrait-outline" size={18} color="#4F46E5" />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={[typo.caption, { color: colors.textTertiary }]}>Payment Method</Text>
                <Text style={[typo.bodySmall, { color: colors.textPrimary, fontWeight: '600', marginTop: 1 }]}>
                  UPI
                </Text>
              </View>
            </View>
            <AnimatedPressable onPress={handlePayment} pressScale={0.93}>
              <Text style={[typo.buttonSmall, { color: colors.accent }]}>Change</Text>
            </AnimatedPressable>
          </View>
        </Animated.View>

        {/* Estimated Delivery Note */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          <View style={styles.rowCenter}>
            <Ionicons name="time-outline" size={14} color={colors.success} />
            <Text style={[typo.caption, { color: colors.success, marginLeft: 4, fontWeight: '500' }]}>
              Estimated delivery: Instant (Digital Product)
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <CheckoutFooter
        total={summary.total}
        savings={summary.savings}
        itemCount={itemCount}
        onCheckout={handlePayment}
        label="Continue to Payment"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { padding: 4 },
  sectionCard: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionHeader: {},
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressBody: {},
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  addressInfo: { flex: 1 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  miniImage: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  miniText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  itemInfo: { flex: 1 },
  couponRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  methodIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
