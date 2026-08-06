import React, { useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';
import { AnimatedPressable } from '../../../shared/components/AnimatedPressable';
import { Toast } from '../../../shared/components/Toast';
import { useToast } from '../../../shared/hooks/useToast';
import { useCartStore } from '../store/useCartStore';
import { formatCurrency } from '../../coupons/utils/formatCurrency';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CartStackParamList } from '../../../navigation/navigationTypes';

type OrderSuccessScreenProps = NativeStackScreenProps<CartStackParamList, 'OrderSuccess'>;

function formatOrderDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function estimatedDelivery(): string {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
}

export function OrderSuccessScreen({ route, navigation }: OrderSuccessScreenProps) {
  const { colors, typography: typo, borderRadius: br } = useTheme();
  const insets = useSafeAreaInsets();
  const { toast, showToast, hideToast } = useToast();
  const { restoreDefaultItems } = useCartStore();
  const { orderId, paidAmount, paymentMethod, savings, orderDate } = route.params;

  const handleContinueShopping = useCallback(() => {
    restoreDefaultItems();
    navigation.popToTop();
  }, [navigation, restoreDefaultItems]);

  const handleTrackOrder = useCallback(() => {
    showToast(`Tracking order ${orderId}`, 'success');
  }, [orderId, showToast]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}
    >
      <Toast visible={toast.visible} message={toast.message} variant={toast.variant} onHide={hideToast} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Success icon */}
        <Animated.View entering={ZoomIn.duration(500).springify()} style={styles.iconWrap}>
          <View style={[styles.outerCircle, { backgroundColor: `${colors.success}12` }]}>
            <View style={[styles.innerCircle, { backgroundColor: colors.successBackground }]}>
              <Ionicons name="checkmark-circle" size={72} color={colors.success} />
            </View>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.delay(200).duration(400).springify()} style={styles.titleWrap}>
          <Text style={[typo.h2, { color: colors.textPrimary, fontWeight: '800', textAlign: 'center' }]}>
            Order Confirmed!
          </Text>
          <Text
            style={[
              typo.body,
              { color: colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 24 },
            ]}
          >
            Your order has been placed successfully.{'\n'}A confirmation will be sent to your email.
          </Text>
        </Animated.View>

        {/* Estimated delivery */}
        <Animated.View
          entering={FadeInDown.delay(280).duration(380).springify()}
          style={[
            styles.deliveryCard,
            {
              backgroundColor: `${colors.accent}0A`,
              borderColor: `${colors.accent}25`,
              borderRadius: br.lg,
              marginTop: 20,
            },
          ]}
        >
          <Ionicons name="cube-outline" size={18} color={colors.accent} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[typo.caption, { color: colors.textTertiary }]}>Estimated Delivery</Text>
            <Text style={[typo.body, { color: colors.accent, fontWeight: '700', marginTop: 2 }]}>
              {estimatedDelivery()}
            </Text>
          </View>
        </Animated.View>

        {/* Order details card */}
        <Animated.View
          entering={FadeInDown.delay(340).duration(400).springify()}
          style={[
            styles.detailsCard,
            { backgroundColor: colors.surface, borderRadius: br.lg, borderColor: colors.border, marginTop: 16 },
          ]}
        >
          <DetailRow label="Order ID" value={orderId} valueColor={colors.accent} showCopy />
          <DetailRow label="Order Date" value={formatOrderDate(orderDate)} />
          <DetailRow label="Amount Paid" value={formatCurrency(paidAmount)} isBold />
          <DetailRow label="Payment Method" value={paymentMethod} isLast />
        </Animated.View>

        {/* Savings callout */}
        {savings > 0 && (
          <Animated.View
            entering={FadeInDown.delay(440).duration(400).springify()}
            style={[
              styles.savingsCard,
              {
                backgroundColor: colors.successBackground,
                borderRadius: br.lg,
                borderColor: `${colors.success}30`,
                marginTop: 12,
              },
            ]}
          >
            <Ionicons name="pricetag" size={18} color={colors.success} />
            <Text style={[typo.body, { color: colors.success, fontWeight: '700', marginLeft: 8 }]}>
              You saved {formatCurrency(savings)} on this order 🎉
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      {/* Action buttons */}
      <Animated.View
        entering={FadeInDown.delay(500).duration(380).springify()}
        style={[styles.ctaWrap, { paddingHorizontal: 20 }]}
      >
        {/* Track Order */}
        <AnimatedPressable
          onPress={handleTrackOrder}
          pressScale={0.96}
          style={[styles.primaryCta, { backgroundColor: colors.accent }]}
          accessibilityLabel="Track your order"
          testID="track-order"
        >
          <Ionicons name="location-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={[typo.button, { color: '#FFFFFF', fontWeight: '700' }]}>Track Order</Text>
        </AnimatedPressable>

        {/* Continue Shopping */}
        <AnimatedPressable
          onPress={handleContinueShopping}
          pressScale={0.95}
          style={[styles.secondaryCta, { borderColor: colors.border }]}
          accessibilityLabel="Continue shopping"
          testID="continue-shopping"
        >
          <Text style={[typo.button, { color: colors.textPrimary, fontWeight: '600' }]}>
            Continue Shopping
          </Text>
        </AnimatedPressable>
      </Animated.View>
    </View>
  );
}

function DetailRow({
  label,
  value,
  valueColor,
  isBold,
  isLast,
  showCopy,
}: {
  label: string;
  value: string;
  valueColor?: string;
  isBold?: boolean;
  isLast?: boolean;
  showCopy?: boolean;
}) {
  const { colors, typography: typo } = useTheme();
  return (
    <View
      style={[
        styles.detailRow,
        {
          borderBottomColor: colors.border,
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
        },
      ]}
    >
      <Text style={[typo.bodySmall, { color: colors.textSecondary }]}>{label}</Text>
      <View style={styles.valueRow}>
        <Text
          style={[
            typo.bodySmall,
            {
              color: valueColor ?? colors.textPrimary,
              fontWeight: isBold ? '700' : '600',
              maxWidth: 180,
              textAlign: 'right',
            },
          ]}
          numberOfLines={1}
        >
          {value}
        </Text>
        {showCopy && (
          <Ionicons name="copy-outline" size={14} color={colors.textTertiary} style={{ marginLeft: 6 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 32,
    paddingBottom: 16,
  },
  iconWrap: { alignItems: 'center' },
  outerCircle: {
    width: 156,
    height: 156,
    borderRadius: 78,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: { alignItems: 'center', marginTop: 20 },
  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  detailsCard: { borderWidth: 1, overflow: 'hidden' },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueRow: { flexDirection: 'row', alignItems: 'center' },
  savingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  ctaWrap: { paddingTop: 12, gap: 10 },
  primaryCta: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  secondaryCta: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
