import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';
import { AnimatedPressable } from '../../../shared/components/AnimatedPressable';
import { CouponDrawerCard, CouponEligibility } from './CouponDrawerCard';
import { useCoupons } from '../../coupons/hooks/useCoupons';
import { useCouponStore } from '../../coupons/store/useCouponStore';
import { validateCoupon } from '../../coupons/services/ValidationEngine';
import { Coupon } from '../../coupons/types';
import { CouponCardSkeleton } from '../../coupons/components/CouponCardSkeleton';
import { formatCurrency } from '../../coupons/utils/formatCurrency';

interface CouponDrawerProps {
  visible: boolean;
  onClose: () => void;
  cartTotal: number;
  onCouponApplied: () => void;
  onCouponRemoved: () => void;
}

type CouponItem = { coupon: Coupon; eligibility: CouponEligibility };

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const RECOMMENDED_COUNT = 2;
const OFFER_COLOR = '#F97316';

export function CouponDrawer({
  visible,
  onClose,
  cartTotal,
  onCouponApplied,
  onCouponRemoved,
}: CouponDrawerProps) {
  const { colors, typography: typo, borderRadius: br } = useTheme();
  const insets = useSafeAreaInsets();
  const { data: coupons, isLoading } = useCoupons();
  const { activeCoupon, setActiveCoupon, removeActiveCoupon } = useCouponStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSuccessId, setAppliedSuccessId] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) setSearchQuery('');
  }, [visible]);

  // ─── Compute eligibility sections ─────────────────────────────────────────

  const { recommended, moreCoupons, lockedCoupons, expiredCoupons } = useMemo<{
    recommended: CouponItem[];
    moreCoupons: CouponItem[];
    lockedCoupons: CouponItem[];
    expiredCoupons: CouponItem[];
  }>(() => {
    if (!coupons) {
      return { recommended: [], moreCoupons: [], lockedCoupons: [], expiredCoupons: [] };
    }

    const q = searchQuery.trim().toLowerCase();
    const filtered = q
      ? coupons.filter(
          (c) =>
            c.code.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q),
        )
      : coupons;

    const eligible: CouponItem[] = [];
    const locked: CouponItem[] = [];
    const expired: CouponItem[] = [];

    for (const coupon of filtered) {
      // Already-applied coupon
      if (activeCoupon?.coupon.id === coupon.id) {
        eligible.unshift({
          coupon,
          eligibility: { status: 'applied', discountAmount: activeCoupon.discountAmount },
        });
        continue;
      }

      const result = validateCoupon(coupons, { code: coupon.code, cartTotal });

      if (result.isValid && result.discountAmount !== undefined) {
        eligible.push({
          coupon,
          eligibility: { status: 'eligible', savingsAmount: result.discountAmount },
        });
      } else if (result.errorCode === 'EXPIRED') {
        expired.push({ coupon, eligibility: { status: 'expired' } });
      } else if (result.errorCode === 'MINIMUM_NOT_MET') {
        const remaining = Math.max(0, coupon.minimumOrderValue - cartTotal);
        const progress = Math.min(1, cartTotal / coupon.minimumOrderValue);
        locked.push({
          coupon,
          eligibility: {
            status: 'locked',
            reason: `Spend ${formatCurrency(remaining)} more to unlock`,
            errorCode: 'MINIMUM_NOT_MET',
            remainingAmount: remaining,
            minimumOrder: coupon.minimumOrderValue,
            progress,
            cartTotal,
          },
        });
      } else {
        locked.push({
          coupon,
          eligibility: {
            status: 'locked',
            reason: result.errorMessage ?? 'Not applicable',
            errorCode: result.errorCode,
          },
        });
      }
    }

    // Sort eligible: applied first, then by savingsAmount descending
    const appliedIdx = eligible.findIndex((e) => e.eligibility.status === 'applied');
    const appliedItem: CouponItem | null = appliedIdx >= 0 ? eligible[appliedIdx] : null;
    const rest: CouponItem[] = eligible.filter((_, i) => i !== appliedIdx);

    const sortedRest = rest.slice().sort((a, b) => {
      const aAmt = a.eligibility.status === 'eligible' ? a.eligibility.savingsAmount : 0;
      const bAmt = b.eligibility.status === 'eligible' ? b.eligibility.savingsAmount : 0;
      return bAmt - aAmt;
    });

    const allEligible: CouponItem[] = appliedItem ? [appliedItem, ...sortedRest] : sortedRest;

    return {
      recommended: allEligible.slice(0, RECOMMENDED_COUNT),
      moreCoupons: allEligible.slice(RECOMMENDED_COUNT),
      lockedCoupons: locked,
      expiredCoupons: expired,
    };
  }, [coupons, cartTotal, activeCoupon, searchQuery]);

  // ─── Best coupon for the recommendation banner ─────────────────────────────
  const bestCoupon = useMemo<CouponItem | null>(() => {
    if (activeCoupon) return null; // already applied — no need to push another
    const allEligible = [...recommended, ...moreCoupons].filter(
      (e) => e.eligibility.status === 'eligible',
    );
    if (allEligible.length === 0) return null;
    return allEligible.sort((a, b) => {
      const aAmt = a.eligibility.status === 'eligible' ? a.eligibility.savingsAmount : 0;
      const bAmt = b.eligibility.status === 'eligible' ? b.eligibility.savingsAmount : 0;
      return bAmt - aAmt;
    })[0];
  }, [recommended, moreCoupons, activeCoupon]);

  const bestSavings =
    bestCoupon?.eligibility.status === 'eligible' ? bestCoupon.eligibility.savingsAmount : 0;

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleApply = useCallback(
    (coupon: Coupon) => {
      if (!coupons) return;
      const result = validateCoupon(coupons, { code: coupon.code, cartTotal });
      if (result.isValid && result.discountAmount !== undefined && result.finalPrice !== undefined) {
        setActiveCoupon(coupon, cartTotal, result.discountAmount, result.finalPrice);
        setAppliedSuccessId(coupon.id);
        onCouponApplied();
        setTimeout(() => {
          setAppliedSuccessId(null);
          onClose();
        }, 1200);
      }
    },
    [coupons, cartTotal, setActiveCoupon, onCouponApplied, onClose],
  );

  const handleRemove = useCallback(
    (_coupon: Coupon) => {
      removeActiveCoupon();
      onCouponRemoved();
    },
    [removeActiveCoupon, onCouponRemoved],
  );

  const totalVisible =
    recommended.length + moreCoupons.length + lockedCoupons.length + expiredCoupons.length;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.45)' }]}>
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); onClose(); }}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: SCREEN_HEIGHT * 0.88,
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}
        >
          {/* Handle */}
          <View style={styles.handleWrap}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>

          {/* Header */}
          <View
            style={[
              styles.header,
              { paddingHorizontal: 16, paddingBottom: 12, borderBottomColor: colors.border },
            ]}
          >
            <View>
              <Text style={[typo.h4, { color: colors.textPrimary, fontWeight: '700' }]}>
                Coupons & Offers
              </Text>
              {totalVisible > 0 && (
                <Text style={[typo.caption, { color: colors.textTertiary, marginTop: 2 }]}>
                  {totalVisible} coupon{totalVisible !== 1 ? 's' : ''} available
                </Text>
              )}
            </View>
            <AnimatedPressable
              onPress={onClose}
              pressScale={0.88}
              style={[styles.closeBtn, { backgroundColor: colors.surfaceElevated }]}
              accessibilityLabel="Close"
              testID="close-coupon-drawer"
            >
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </AnimatedPressable>
          </View>

          {/* Best Coupon Recommendation Banner */}
          {bestCoupon && !isLoading && (
            <Animated.View
              entering={FadeInDown.duration(350).springify()}
              style={[
                styles.bestBanner,
                {
                  marginHorizontal: 16,
                  marginTop: 12,
                  borderRadius: 12,
                  backgroundColor: `${colors.accent}0D`,
                  borderColor: `${colors.accent}30`,
                },
              ]}
            >
              <View style={[styles.bestIconWrap, { backgroundColor: `${colors.accent}15` }]}>
                <Ionicons name="sparkles" size={16} color={colors.accent} />
              </View>
              <View style={styles.bestText}>
                <Text style={[typo.caption, { color: colors.accent, fontWeight: '700', letterSpacing: 0.3 }]}>
                  BEST COUPON FOR YOU
                </Text>
                <Text style={[typo.bodySmall, { color: colors.textPrimary, fontWeight: '600', marginTop: 2 }]}>
                  {bestCoupon.coupon.code} · Save {formatCurrency(bestSavings)} instantly
                </Text>
              </View>
              <AnimatedPressable
                onPress={() => handleApply(bestCoupon.coupon)}
                pressScale={0.92}
                style={[styles.bestApplyBtn, { backgroundColor: colors.accent }]}
                testID="best-coupon-apply"
              >
                <Text style={[typo.caption, { color: '#FFFFFF', fontWeight: '700' }]}>APPLY</Text>
              </AnimatedPressable>
            </Animated.View>
          )}

          {/* Search */}
          <View style={[styles.searchWrap, { paddingHorizontal: 16, paddingVertical: 12 }]}>
            <View
              style={[
                styles.searchBox,
                { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={18}
                color={colors.textTertiary}
                style={{ marginRight: 8 }}
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search for coupon code"
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="characters"
                autoCorrect={false}
                style={[typo.body, { flex: 1, color: colors.textPrimary, height: 44 }]}
                testID="coupon-search-input"
              />
              {searchQuery.length > 0 && (
                <AnimatedPressable onPress={() => setSearchQuery('')} pressScale={0.9}>
                  <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
                </AnimatedPressable>
              )}
            </View>
          </View>

          {/* Applied success flash */}
          {appliedSuccessId && (
            <Animated.View
              entering={ZoomIn.duration(250).springify()}
              style={[
                styles.successFlash,
                {
                  backgroundColor: colors.successBackground,
                  borderColor: `${colors.success}40`,
                  marginHorizontal: 16,
                  marginBottom: 12,
                  borderRadius: 12,
                },
              ]}
            >
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={[typo.body, { color: colors.success, fontWeight: '700', marginLeft: 8 }]}>
                Coupon applied! Prices updated.
              </Text>
            </Animated.View>
          )}

          {/* Coupon List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
          >
            {isLoading ? (
              <>
                <CouponCardSkeleton />
                <CouponCardSkeleton />
                <CouponCardSkeleton />
              </>
            ) : (
              <>
                {/* Recommended */}
                {recommended.length > 0 && (
                  <View style={{ marginBottom: 4 }}>
                    <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>
                      RECOMMENDED FOR YOU
                    </Text>
                    {recommended.map(({ coupon, eligibility }) => (
                      <CouponDrawerCard
                        key={coupon.id}
                        coupon={coupon}
                        eligibility={eligibility}
                        onApply={handleApply}
                        onRemove={handleRemove}
                      />
                    ))}
                  </View>
                )}

                {/* More Coupons */}
                {moreCoupons.length > 0 && (
                  <View style={{ marginBottom: 4 }}>
                    <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>
                      MORE COUPONS
                    </Text>
                    {moreCoupons.map(({ coupon, eligibility }) => (
                      <CouponDrawerCard
                        key={coupon.id}
                        coupon={coupon}
                        eligibility={eligibility}
                        onApply={handleApply}
                        onRemove={handleRemove}
                      />
                    ))}
                  </View>
                )}

                {/* Locked — with progress bars */}
                {lockedCoupons.length > 0 && (
                  <View style={{ marginBottom: 4 }}>
                    <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>
                      LOCKED COUPONS
                    </Text>
                    {lockedCoupons.map(({ coupon, eligibility }) => (
                      <CouponDrawerCard
                        key={coupon.id}
                        coupon={coupon}
                        eligibility={eligibility}
                        onApply={handleApply}
                        onRemove={handleRemove}
                      />
                    ))}
                  </View>
                )}

                {/* Expired */}
                {expiredCoupons.length > 0 && (
                  <View>
                    <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>
                      EXPIRED COUPONS
                    </Text>
                    {expiredCoupons.map(({ coupon, eligibility }) => (
                      <CouponDrawerCard
                        key={coupon.id}
                        coupon={coupon}
                        eligibility={eligibility}
                        onApply={handleApply}
                        onRemove={handleRemove}
                      />
                    ))}
                  </View>
                )}

                {/* Empty state */}
                {totalVisible === 0 && !isLoading && (
                  <View style={styles.emptyState}>
                    <Ionicons name="pricetag-outline" size={40} color={colors.textTertiary} />
                    <Text
                      style={[
                        typo.body,
                        { color: colors.textTertiary, marginTop: 12, textAlign: 'center' },
                      ]}
                    >
                      No coupons found
                    </Text>
                    {searchQuery.length > 0 && (
                      <AnimatedPressable
                        pressScale={0.95}
                        onPress={() => setSearchQuery('')}
                        style={{ marginTop: 10 }}
                      >
                        <Text style={[typo.bodySmall, { color: colors.accent }]}>
                          Clear search
                        </Text>
                      </AnimatedPressable>
                    )}
                  </View>
                )}
              </>
            )}
          </ScrollView>

          {/* Footer */}
          {totalVisible > 0 && (
            <View
              style={[
                styles.drawerFooter,
                { borderTopColor: colors.border, paddingHorizontal: 16, paddingTop: 10 },
              ]}
            >
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={[typo.caption, { color: colors.textSecondary, marginLeft: 6 }]}>
                Best offer applied automatically
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    overflow: 'hidden',
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
    borderWidth: 1,
  },
  bestIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bestText: {
    flex: 1,
  },
  bestApplyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    flexShrink: 0,
  },
  searchWrap: {},
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  successFlash: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  drawerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: 4,
  },
});
