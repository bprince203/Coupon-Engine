import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Modal } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';
import { AnimatedPressable } from '../../../shared/components/AnimatedPressable';
import { PaymentMethodCard } from '../components/PaymentMethodCard';
import { useCartStore } from '../store/useCartStore';
import { useCouponStore } from '../../coupons/store/useCouponStore';
import { formatCurrency } from '../../coupons/utils/formatCurrency';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CartStackParamList } from '../../../navigation/navigationTypes';

type PaymentScreenProps = NativeStackScreenProps<CartStackParamList, 'Payment'>;

// ─── Payment Data ────────────────────────────────────────────────────────────

const UPI_METHODS = [
  { id: 'gpay', name: 'Google Pay', icon: 'logo-google' as const, iconColor: '#4285F4', iconBg: '#EBF0FF' },
  { id: 'phonepe', name: 'PhonePe', icon: 'phone-portrait-outline' as const, iconColor: '#5F259F', iconBg: '#F3EBF8' },
  { id: 'paytm', name: 'Paytm', icon: 'wallet-outline' as const, iconColor: '#00BAF2', iconBg: '#E8F8FD' },
  { id: 'bhim', name: 'BHIM UPI', icon: 'card-outline' as const, iconColor: '#FF6B00', iconBg: '#FFF2E8' },
];

const CARD_METHODS = [
  { id: 'visa4521', name: 'Visa •••• 4521', subtitle: 'Credit Card', icon: 'card' as const, iconColor: '#1A1F71', iconBg: '#EEF0F8' },
  { id: 'mc7789', name: 'Mastercard •••• 7789', subtitle: 'Debit Card', icon: 'card' as const, iconColor: '#EB001B', iconBg: '#FEE9EA' },
];

const MORE_METHODS = [
  { id: 'netbanking', name: 'Net Banking', subtitle: 'All major banks', icon: 'business-outline' as const, iconColor: '#374151', iconBg: '#F3F4F6' },
  { id: 'wallets', name: 'Wallets', subtitle: 'Paytm, Amazon Pay, Mobikwik', icon: 'wallet-outline' as const, iconColor: '#374151', iconBg: '#F3F4F6' },
];

const ALL_METHODS = [...UPI_METHODS, ...CARD_METHODS, ...MORE_METHODS];

// ─── Screen ───────────────────────────────────────────────────────────────────

export function PaymentScreen({ navigation }: PaymentScreenProps) {
  const { colors, typography: typo } = useTheme();
  const insets = useSafeAreaInsets();
  const { getOrderSummary, clearCart } = useCartStore();
  const { activeCoupon, removeActiveCoupon } = useCouponStore();

  const [selectedId, setSelectedId] = useState('gpay');
  const [processing, setProcessing] = useState(false);

  const couponDiscount = activeCoupon?.discountAmount ?? 0;
  const summary = getOrderSummary(couponDiscount);

  const selectedMethod = ALL_METHODS.find((m) => m.id === selectedId);

  const handlePay = useCallback(() => {
    setProcessing(true);
    setTimeout(() => {
      const orderId = `#OD${Date.now().toString().slice(-9)}`;
      clearCart();
      removeActiveCoupon();
      setProcessing(false);
      navigation.replace('OrderSuccess', {
        orderId,
        paidAmount: summary.total,
        paymentMethod: selectedMethod?.name ?? 'UPI',
        savings: summary.savings,
        orderDate: Date.now(),
      });
    }, 1800);
  }, [navigation, summary, clearCart, removeActiveCoupon, selectedMethod]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Processing Modal */}
      <Modal visible={processing} transparent animationType="fade">
        <View style={[styles.processingOverlay, { backgroundColor: 'rgba(0,0,0,0.55)' }]}>
          <View style={[styles.processingCard, { backgroundColor: colors.surface }]}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[typo.body, { color: colors.textPrimary, fontWeight: '600', marginTop: 16 }]}>
              Processing your payment
            </Text>
            <Text style={[typo.caption, { color: colors.textSecondary, marginTop: 6, textAlign: 'center' }]}>
              Please do not go back or close the app
            </Text>
            <View style={[styles.razorpayBadge, { marginTop: 20 }]}>
              <Ionicons name="shield-checkmark-outline" size={14} color={colors.textTertiary} />
              <Text style={[typo.caption, { color: colors.textTertiary, marginLeft: 5 }]}>
                Secured by Razorpay
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, paddingHorizontal: 16 }]}>
        <AnimatedPressable onPress={() => navigation.goBack()} pressScale={0.9} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </AnimatedPressable>
        <Text style={[typo.h4, { color: colors.textPrimary, fontWeight: '700' }]}>Payment</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Amount Card */}
        <Animated.View
          entering={FadeInDown.duration(300).springify()}
          style={[styles.amountCard, { backgroundColor: colors.surface, borderBottomColor: colors.border, borderTopColor: colors.border, marginTop: 12 }]}
        >
          <View style={[styles.amountRow, { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 }]}>
            <View>
              <Text style={[typo.bodySmall, { color: colors.textSecondary }]}>Total Payable</Text>
              <Text style={[typo.h2, { color: colors.textPrimary, fontWeight: '800', marginTop: 2 }]}>
                {formatCurrency(summary.total)}
              </Text>
            </View>
            <View style={styles.rowCenter}>
              <Text style={[typo.caption, { color: colors.accent }]}>View details</Text>
              <View style={[styles.verifiedBadge, { backgroundColor: colors.successBackground, marginLeft: 8 }]}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              </View>
            </View>
          </View>
          {summary.savings > 0 && (
            <View style={[styles.savingsRow, { paddingHorizontal: 16, paddingBottom: 12 }]}>
              <Ionicons name="pricetag" size={13} color={colors.success} />
              <Text style={[typo.caption, { color: colors.success, fontWeight: '600', marginLeft: 5 }]}>
                You save {formatCurrency(summary.savings)} on this order
              </Text>
            </View>
          )}
        </Animated.View>

        {/* UPI Section */}
        <Animated.View entering={FadeInDown.delay(80).duration(300).springify()} style={{ marginTop: 8 }}>
          <SectionHeader title="UPI" />
          <View style={[styles.methodGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {UPI_METHODS.map((m) => (
              <PaymentMethodCard
                key={m.id}
                id={m.id}
                name={m.name}
                icon={m.icon}
                iconColor={m.iconColor}
                iconBg={m.iconBg}
                isSelected={selectedId === m.id}
                onSelect={setSelectedId}
              />
            ))}
          </View>
        </Animated.View>

        {/* Cards Section */}
        <Animated.View entering={FadeInDown.delay(130).duration(300).springify()} style={{ marginTop: 8 }}>
          <SectionHeader title="Cards" />
          <View style={[styles.methodGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {CARD_METHODS.map((m) => (
              <PaymentMethodCard
                key={m.id}
                id={m.id}
                name={m.name}
                subtitle={m.subtitle}
                icon={m.icon}
                iconColor={m.iconColor}
                iconBg={m.iconBg}
                isSelected={selectedId === m.id}
                onSelect={setSelectedId}
              />
            ))}
          </View>
        </Animated.View>

        {/* More Options */}
        <Animated.View entering={FadeInDown.delay(180).duration(300).springify()} style={{ marginTop: 8 }}>
          <SectionHeader title="More Options" />
          <View style={[styles.methodGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {MORE_METHODS.map((m) => (
              <PaymentMethodCard
                key={m.id}
                id={m.id}
                name={m.name}
                subtitle={m.subtitle}
                icon={m.icon}
                iconColor={m.iconColor}
                iconBg={m.iconBg}
                isSelected={selectedId === m.id}
                onSelect={setSelectedId}
              />
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Sticky Pay Button */}
      <View
        style={[
          styles.payFooter,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        <AnimatedPressable
          onPress={handlePay}
          pressScale={0.96}
          style={[styles.payButton, { backgroundColor: colors.accent }]}
          accessibilityLabel="Place order"
          testID="place-order-button"
        >
          <Ionicons name="lock-closed" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={[typo.button, { color: '#FFFFFF', fontWeight: '700' }]}>
            Pay {formatCurrency(summary.total)}
          </Text>
        </AnimatedPressable>
        <View style={[styles.rowCenter, { marginTop: 8, justifyContent: 'center' }]}>
          <Ionicons name="shield-checkmark-outline" size={13} color={colors.textTertiary} />
          <Text style={[typo.caption, { color: colors.textTertiary, marginLeft: 4 }]}>
            100% Secure & Encrypted · Powered by Razorpay
          </Text>
        </View>
      </View>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  const { colors, typography: typo } = useTheme();
  return (
    <Text
      style={[
        styles.sectionTitle,
        { color: colors.textSecondary, paddingHorizontal: 16 },
      ]}
    >
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { padding: 4 },
  amountCard: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 4,
    marginTop: 4,
  },
  methodGroup: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  payFooter: {
    borderTopWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  payButton: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingCard: {
    width: 280,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
  },
  razorpayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
