import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';
import { Toast } from '../../../shared/components/Toast';
import { AnimatedPressable } from '../../../shared/components/AnimatedPressable';
import { CartItemCard } from '../components/CartItemCard';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { CheckoutFooter } from '../components/CheckoutFooter';
import { CouponDrawer } from '../components/CouponDrawer';
import { useCartStore } from '../store/useCartStore';
import { useCouponStore } from '../../coupons/store/useCouponStore';
import { useToast } from '../../../shared/hooks/useToast';
import { formatCurrency } from '../../coupons/utils/formatCurrency';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CartStackParamList } from '../../../navigation/navigationTypes';

type CartScreenProps = NativeStackScreenProps<CartStackParamList, 'Cart'>;

const OFFER_COLOR = '#F97316';
const OFFER_BG = '#FFF7ED';
const MOCK_ADDRESS = 'Home – Bengaluru, Karnataka 560001';

export function CartScreen({ navigation }: CartScreenProps) {
  const { colors, typography: typo, borderRadius: br, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    items,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    getSubtotal,
    getItemCount,
    getOrderSummary,
    restoreDefaultItems,
  } = useCartStore();
  const { activeCoupon, removeActiveCoupon } = useCouponStore();
  const { toast, showToast, hideToast } = useToast();
  const [couponDrawerVisible, setCouponDrawerVisible] = useState(false);

  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const couponDiscount = activeCoupon?.discountAmount ?? 0;
  const summary = getOrderSummary(couponDiscount);

  const handleIncrement = useCallback(
    (id: string) => incrementQuantity(id),
    [incrementQuantity],
  );
  const handleDecrement = useCallback(
    (id: string) => decrementQuantity(id),
    [decrementQuantity],
  );

  const handleRemove = useCallback(
    (id: string) => {
      removeItem(id);
      showToast('Item removed from cart', 'info');
    },
    [removeItem, showToast],
  );

  const handleWishlist = useCallback(
    (_id: string, wishlisted: boolean) => {
      showToast(wishlisted ? 'Saved to Wishlist ♡' : 'Removed from Wishlist', 'success');
    },
    [showToast],
  );

  const handleCouponApplied = useCallback(() => {
    setCouponDrawerVisible(false);
    showToast('Coupon applied! Prices updated.', 'success');
  }, [showToast]);

  const handleCouponRemoved = useCallback(() => {
    showToast('Coupon removed', 'info');
  }, [showToast]);

  const handleRemoveActiveCoupon = useCallback(() => {
    removeActiveCoupon();
    showToast('Coupon removed', 'info');
  }, [removeActiveCoupon, showToast]);

  const handleCheckout = useCallback(
    () => navigation.navigate('Checkout'),
    [navigation],
  );

  // ─── Continue Shopping — restores demo products ────────────────────────────
  const handleContinueShopping = useCallback(() => {
    restoreDefaultItems();
    showToast('Demo products restored 🛒', 'success');
  }, [restoreDefaultItems, showToast]);

  // ─── Empty Cart ────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <View style={[styles.flex, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <Toast
          visible={toast.visible}
          message={toast.message}
          variant={toast.variant}
          onHide={hideToast}
        />

        {/* Header */}
        <View
          style={[
            styles.header,
            { borderBottomColor: colors.border, paddingHorizontal: 16 },
          ]}
        >
          <Text style={[typo.h4, { color: colors.textPrimary, fontWeight: '700' }]}>Shopping Cart</Text>
        </View>

        {/* Empty State */}
        <View style={styles.emptyCenter}>
          <Animated.View
            entering={FadeInDown.duration(500).springify()}
            style={[styles.emptyIconWrap, { backgroundColor: `${colors.accent}10` }]}
          >
            <Ionicons name="cart-outline" size={64} color={colors.accent} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(450).springify()} style={styles.emptyTextWrap}>
            <Text
              style={[
                typo.h4,
                { color: colors.textPrimary, fontWeight: '700', textAlign: 'center' },
              ]}
            >
              Your cart is empty
            </Text>
            <Text
              style={[
                typo.body,
                {
                  color: colors.textSecondary,
                  textAlign: 'center',
                  lineHeight: 24,
                  marginTop: 8,
                },
              ]}
            >
              Looks like you haven't added anything yet.{'\n'}Tap below to start shopping.
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).duration(400).springify()}
            style={styles.emptyActions}
          >
            {/* Primary CTA — restores demo products */}
            <AnimatedPressable
              onPress={handleContinueShopping}
              pressScale={0.96}
              style={[styles.shopNowBtn, { backgroundColor: colors.accent }]}
              accessibilityLabel="Continue shopping"
              testID="continue-shopping"
            >
              <Ionicons name="bag-add-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={[typo.button, { color: '#FFFFFF', fontWeight: '700' }]}>
                Continue Shopping
              </Text>
            </AnimatedPressable>

            {/* Secondary CTA — open coupon browser */}
            <AnimatedPressable
              onPress={() => setCouponDrawerVisible(true)}
              pressScale={0.95}
              style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center' }}
              accessibilityLabel="Explore coupons"
            >
              <Ionicons name="pricetags-outline" size={15} color={colors.accent} style={{ marginRight: 6 }} />
              <Text style={[typo.body, { color: colors.accent, fontWeight: '600' }]}>
                Explore Coupons
              </Text>
            </AnimatedPressable>
          </Animated.View>
        </View>

        {/* Coupon Drawer (accessible even from empty cart) */}
        <CouponDrawer
          visible={couponDrawerVisible}
          onClose={() => setCouponDrawerVisible(false)}
          cartTotal={0}
          onCouponApplied={() => setCouponDrawerVisible(false)}
          onCouponRemoved={() => {}}
        />
      </View>
    );
  }

  // ─── Cart with Items ───────────────────────────────────────────────────────
  return (
    <View style={[styles.flex, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        variant={toast.variant}
        onHide={hideToast}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          { borderBottomColor: colors.border, paddingHorizontal: 16 },
        ]}
      >
        <Text style={[typo.h4, { color: colors.textPrimary, fontWeight: '700' }]}>
          Shopping Cart ({itemCount})
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Delivery Address Row */}
        <AnimatedPressable
          onPress={() => showToast('Address management coming soon', 'info')}
          pressScale={0.99}
          style={[
            styles.addressRow,
            {
              borderBottomColor: colors.border,
              paddingHorizontal: 16,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Ionicons name="location-outline" size={18} color={colors.accent} />
          <View style={styles.addressText}>
            <Text style={[typo.caption, { color: colors.textTertiary }]}>Deliver to</Text>
            <Text
              style={[
                typo.bodySmall,
                { color: colors.textPrimary, fontWeight: '600', marginTop: 1 },
              ]}
            >
              {MOCK_ADDRESS}
            </Text>
          </View>
          <Text style={[typo.buttonSmall, { color: colors.accent }]}>Change</Text>
        </AnimatedPressable>

        {/* Cart Items */}
        <View style={[styles.itemsCard, { backgroundColor: colors.surface, marginTop: 8 }]}>
          {items.map((item, index) => (
            <CartItemCard
              key={item.id}
              item={item}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onRemove={handleRemove}
              onWishlist={handleWishlist}
              index={index}
            />
          ))}
        </View>

        {/* Coupons & Offers */}
        <Animated.View
          entering={FadeInDown.delay(items.length * 60 + 100).duration(350)}
          style={{ marginTop: 8 }}
        >
          {activeCoupon ? (
            /* Applied coupon display */
            <View
              style={[
                styles.appliedCard,
                {
                  backgroundColor: colors.surface,
                  borderTopColor: colors.border,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.appliedBanner,
                  {
                    backgroundColor: colors.successBackground,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                  },
                ]}
              >
                <Ionicons name="checkmark-circle" size={15} color={colors.success} />
                <Text
                  style={[
                    typo.bodySmall,
                    { color: colors.success, fontWeight: '700', marginLeft: 6 },
                  ]}
                >
                  {activeCoupon.coupon.code} applied · Saving{' '}
                  {formatCurrency(activeCoupon.discountAmount)}
                </Text>
              </View>
              <View
                style={[
                  styles.appliedActions,
                  { paddingHorizontal: 16, paddingVertical: 11 },
                ]}
              >
                <View style={styles.rowCenter}>
                  <Ionicons
                    name="pricetags-outline"
                    size={15}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[typo.bodySmall, { color: colors.textSecondary, marginLeft: 6 }]}
                  >
                    Coupon applied
                  </Text>
                </View>
                <View style={styles.rowCenter}>
                  <AnimatedPressable
                    onPress={() => setCouponDrawerVisible(true)}
                    pressScale={0.93}
                    testID="change-coupon"
                  >
                    <Text style={[typo.buttonSmall, { color: colors.accent }]}>Change</Text>
                  </AnimatedPressable>
                  <Text style={{ color: colors.border, marginHorizontal: 8 }}>|</Text>
                  <AnimatedPressable
                    onPress={handleRemoveActiveCoupon}
                    pressScale={0.93}
                    testID="remove-coupon"
                  >
                    <Text style={[typo.buttonSmall, { color: colors.error }]}>Remove</Text>
                  </AnimatedPressable>
                </View>
              </View>
            </View>
          ) : (
            /* Apply coupon CTA */
            <AnimatedPressable
              onPress={() => setCouponDrawerVisible(true)}
              pressScale={0.98}
              style={[
                styles.couponCTACard,
                {
                  backgroundColor: colors.surface,
                  borderTopColor: colors.border,
                  borderBottomColor: colors.border,
                },
              ]}
              accessibilityLabel="Apply a coupon"
              testID="open-coupon-drawer"
            >
              <View style={[styles.couponIcon, { backgroundColor: OFFER_BG }]}>
                <Ionicons name="pricetags" size={20} color={OFFER_COLOR} />
              </View>
              <View style={styles.couponCTAText}>
                <Text style={[typo.body, { color: colors.textPrimary, fontWeight: '600' }]}>
                  Coupons & Offers
                </Text>
                <Text
                  style={[
                    typo.caption,
                    { color: OFFER_COLOR, fontWeight: '600', marginTop: 2 },
                  ]}
                >
                  Apply coupon to save more
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </AnimatedPressable>
          )}
        </Animated.View>

        {/* Price Breakdown */}
        <View style={{ marginTop: 8 }}>
          <PriceBreakdown
            summary={summary}
            couponCode={activeCoupon?.coupon.code}
            itemCount={items.length}
          />
        </View>

        {/* Disclaimer */}
        <Animated.View
          entering={FadeIn.delay(400).duration(300)}
          style={{ paddingHorizontal: 16, paddingVertical: 12 }}
        >
          <Text
            style={[
              typo.caption,
              { color: colors.textTertiary, textAlign: 'center', lineHeight: 18 },
            ]}
          >
            Safe & Secure Payments · 100% Authentic Digital Products
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Sticky Footer */}
      <CheckoutFooter
        total={summary.total}
        savings={summary.savings}
        itemCount={itemCount}
        onCheckout={handleCheckout}
      />

      {/* Coupon Drawer */}
      <CouponDrawer
        visible={couponDrawerVisible}
        onClose={() => setCouponDrawerVisible(false)}
        cartTotal={subtotal}
        onCouponApplied={handleCouponApplied}
        onCouponRemoved={handleCouponRemoved}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    height: 56,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  emptyCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  emptyIconWrap: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTextWrap: {
    alignItems: 'center',
    marginTop: 24,
  },
  emptyActions: {
    alignItems: 'center',
    marginTop: 32,
    width: '100%',
  },
  shopNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: '100%',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  addressText: { flex: 1 },
  itemsCard: {},
  appliedCard: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  appliedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appliedActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponCTACard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  couponIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponCTAText: { flex: 1 },
});
