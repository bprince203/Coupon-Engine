import React, { useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';
import { AnimatedPressable } from '../../../shared/components/AnimatedPressable';
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

export function OrderSuccessScreen({ route, navigation }: OrderSuccessScreenProps) {
  const { colors, typography: typo, borderRadius: br } = useTheme();
  const insets = useSafeAreaInsets();
  const { orderId, paidAmount, paymentMethod, savings, orderDate } = route.params;

  const handleContinue = useCallback(() => {
    navigation.popToTop();
  }, [navigation]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: Math.max(insets.bottom, 24),
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <Animated.View entering={ZoomIn.duration(500).springify()} style={styles.iconWrap}>
          <View style={[styles.outerCircle, { backgroundColor: `${colors.success}15` }]}>
            <View style={[styles.innerCircle, { backgroundColor: colors.successBackground }]}>
              <Ionicons name="checkmark-circle" size={72} color={colors.success} />
            </View>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.delay(200).duration(400).springify()} style={styles.titleWrap}>
          <Text style={[typo.h2, { color: colors.textPrimary, fontWeight: '800', textAlign: 'center' }]}>
            Order Placed{'\n'}Successfully!
          </Text>
          <Text style={[typo.body, { color: colors.textSecondary, textAlign: 'center', marginTop: 10, lineHeight: 24 }]}>
            Thank you for your purchase.{'\n'}You'll receive a confirmation email shortly.
          </Text>
        </Animated.View>

        {/* Order Details Card */}
        <Animated.View
          entering={FadeInDown.delay(320).duration(400).springify()}
          style={[
            styles.detailsCard,
            {
              backgroundColor: colors.surface,
              borderRadius: br.lg,
              borderColor: colors.border,
              marginTop: 28,
            },
          ]}
        >
          <DetailRow
            label="Order ID"
            value={orderId}
            valueColor={colors.accent}
            showCopy
          />
          <DetailRow label="Order Date" value={formatOrderDate(orderDate)} />
          <DetailRow label="Paid Amount" value={formatCurrency(paidAmount)} isBold />
          <DetailRow label="Payment Method" value={paymentMethod} isLast />
        </Animated.View>

        {/* Savings Callout */}
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

      {/* CTAs */}
      <Animated.View
        entering={FadeInDown.delay(500).duration(400).springify()}
        style={[styles.ctaWrap, { paddingHorizontal: 16 }]}
      >
        <AnimatedPressable
          onPress={handleContinue}
          pressScale={0.96}
          style={[styles.primaryCta, { backgroundColor: colors.accent }]}
          accessibilityLabel="Continue shopping"
          testID="continue-shopping"
        >
          <Text style={[typo.button, { color: '#FFFFFF', fontWeight: '700' }]}>Continue Shopping</Text>
        </AnimatedPressable>

        <AnimatedPressable pressScale={0.95} style={{ marginTop: 12, alignSelf: 'center' }}>
          <Text style={[typo.body, { color: colors.accent }]}>View Order Details</Text>
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
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  iconWrap: {
    alignItems: 'center',
  },
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
  titleWrap: {
    alignItems: 'center',
    marginTop: 20,
  },
  detailsCard: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  ctaWrap: { paddingTop: 16 },
  primaryCta: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
