import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { AnimatedPressable } from '../../../shared/components/AnimatedPressable';
import { QuantityStepper } from './QuantityStepper';
import { CartItem } from '../types';
import { formatCurrency } from '../../coupons/utils/formatCurrency';

interface CartItemCardProps {
  item: CartItem;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
  onWishlist?: (id: string, wishlisted: boolean) => void;
  index: number;
}

const OFFER_COLOR = '#F97316';
const OFFER_BG = '#FFF7ED';

export const CartItemCard = memo(function CartItemCard({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onWishlist,
  index,
}: CartItemCardProps) {
  const { colors, typography: typo, borderRadius: br, spacing } = useTheme();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleIncrement = useCallback(() => onIncrement(item.id), [item.id, onIncrement]);
  const handleDecrement = useCallback(() => onDecrement(item.id), [item.id, onDecrement]);
  const handleRemove = useCallback(() => onRemove(item.id), [item.id, onRemove]);

  const handleWishlist = useCallback(() => {
    const next = !isWishlisted;
    setIsWishlisted(next);
    onWishlist?.(item.id, next);
  }, [isWishlisted, item.id, onWishlist]);

  const lineTotal = item.price * item.quantity;
  const isLowStock = item.stockStatus === 'low_stock';

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(350).springify()}
      exiting={FadeOutLeft.duration(220)}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {/* ── Top: image + info ────────────────────────────────────────────── */}
      <View style={styles.row}>
        {/* Image placeholder with gradient + initials */}
        <View
          style={[
            styles.imageContainer,
            {
              backgroundColor: item.gradientColors[0],
              borderRadius: br.md,
            },
          ]}
        >
          <Text style={styles.imageText}>{item.initials}</Text>
          {item.discountBadge && (
            <View style={[styles.imageBadge, { backgroundColor: OFFER_COLOR }]}>
              <Text style={styles.imageBadgeText}>{item.discountBadge}</Text>
            </View>
          )}
        </View>

        {/* Product info */}
        <View style={styles.info}>
          {/* Name */}
          <Text
            style={[typo.body, { color: colors.textPrimary, fontWeight: '600', lineHeight: 20 }]}
            numberOfLines={2}
          >
            {item.name}
          </Text>

          {/* Variant */}
          <Text
            style={[typo.caption, { color: colors.textSecondary, marginTop: 3 }]}
            numberOfLines={1}
          >
            {item.variant}
          </Text>

          {/* Rating + Seller */}
          <View style={[styles.ratingRow, { marginTop: 4 }]}>
            <Ionicons name="star" size={11} color="#F59E0B" />
            <Text style={[typo.caption, { color: colors.textSecondary, marginLeft: 2 }]}>
              {item.rating.toFixed(1)}
            </Text>
            <Text style={[typo.caption, { color: colors.textTertiary, marginLeft: 4 }]}>
              · {item.seller}
            </Text>
          </View>

          {/* Price row */}
          <View style={[styles.priceRow, { marginTop: spacing.sm }]}>
            <Text style={[typo.body, { color: colors.textPrimary, fontWeight: '800' }]}>
              {formatCurrency(item.price)}
            </Text>
            <Text
              style={[
                typo.caption,
                {
                  color: colors.textTertiary,
                  textDecorationLine: 'line-through',
                  marginLeft: 6,
                },
              ]}
            >
              {formatCurrency(item.originalPrice)}
            </Text>
            <View style={[styles.discountBadge, { backgroundColor: OFFER_BG, marginLeft: 6 }]}>
              <Text style={[styles.discountText, { color: OFFER_COLOR }]}>
                {item.discountPercent}% off
              </Text>
            </View>
          </View>

          {/* Delivery estimate */}
          <View style={[styles.metaRow, { marginTop: 6 }]}>
            <Ionicons name="flash-outline" size={12} color={colors.success} />
            <Text style={[typo.caption, { color: colors.success, marginLeft: 4, fontWeight: '500' }]}>
              {item.deliveryEstimate}
            </Text>
          </View>

          {/* Stock status */}
          <View style={[styles.metaRow, { marginTop: 4 }]}>
            <View
              style={[
                styles.stockDot,
                {
                  backgroundColor: isLowStock ? OFFER_COLOR : colors.success,
                },
              ]}
            />
            <Text
              style={[
                typo.caption,
                {
                  color: isLowStock ? OFFER_COLOR : colors.success,
                  marginLeft: 5,
                  fontWeight: isLowStock ? '600' : '400',
                },
              ]}
            >
              {isLowStock
                ? `Only ${item.stockCount ?? 'a few'} left — order soon!`
                : 'In Stock'}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Bottom: qty stepper + actions ────────────────────────────────── */}
      <View
        style={[
          styles.bottomRow,
          {
            marginTop: spacing.md,
            paddingTop: spacing.md,
            borderTopColor: colors.border,
          },
        ]}
      >
        <QuantityStepper
          quantity={item.quantity}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          compact
        />

        <View style={styles.actions}>
          {/* Line total (when qty > 1) */}
          {item.quantity > 1 && (
            <Text
              style={[typo.caption, { color: colors.textTertiary, marginRight: spacing.sm }]}
            >
              {formatCurrency(lineTotal)}
            </Text>
          )}

          {/* Wishlist toggle */}
          <AnimatedPressable
            onPress={handleWishlist}
            pressScale={0.85}
            style={styles.actionBtn}
            accessibilityLabel={isWishlisted ? 'Remove from wishlist' : 'Save for later'}
            testID={`wishlist-item-${item.id}`}
          >
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={18}
              color={isWishlisted ? '#EF4444' : colors.textSecondary}
            />
          </AnimatedPressable>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Remove */}
          <AnimatedPressable
            onPress={handleRemove}
            pressScale={0.9}
            style={styles.actionBtn}
            accessibilityLabel={`Remove ${item.name}`}
            testID={`remove-item-${item.id}`}
          >
            <Text style={[typo.buttonSmall, { color: colors.error }]}>Remove</Text>
          </AnimatedPressable>
        </View>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  imageText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 22,
    letterSpacing: 1,
  },
  imageBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 3,
    alignItems: 'center',
  },
  imageBadgeText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  discountBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  divider: {
    width: 1,
    height: 14,
    marginHorizontal: 8,
  },
});
