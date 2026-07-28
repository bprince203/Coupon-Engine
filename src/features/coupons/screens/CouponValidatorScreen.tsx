/**
 * CouponValidatorScreen — Validate coupon codes against a cart total.
 *
 * Uses React Hook Form + Zod for form handling, and the ValidationEngine
 * for business logic. Displays results via ValidatorResultCard.
 */

import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '../../../theme';
import { ScreenContainer } from '../../../shared/components/ScreenContainer';
import { PrimaryButton } from '../../../shared/components/PrimaryButton';
import { Toast } from '../../../shared/components/Toast';
import { ValidatorResultCard } from '../components/ValidatorResultCard';
import { useCoupons } from '../hooks/useCoupons';
import { useValidatorStore } from '../store/useValidatorStore';
import { useCouponStore } from '../store/useCouponStore';
import { useToast } from '../../../shared/hooks/useToast';
import { validateCoupon } from '../services/ValidationEngine';
import { couponValidatorSchema, CouponValidatorFormData } from '../validators/couponFormSchema';
import type { CouponValidatorScreenProps } from '../../../navigation/navigationTypes';

export function CouponValidatorScreen({ route }: CouponValidatorScreenProps) {
  const { colors, typography: typo, borderRadius: br, spacing } = useTheme();
  const { data: coupons } = useCoupons();
  const { validationResult, setResult, clearResult } = useValidatorStore();
  const { applyCoupon, isAlreadyApplied } = useCouponStore();
  const { toast, showToast, hideToast } = useToast();

  const prefillCode = route.params?.prefillCode;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<CouponValidatorFormData>({
    resolver: zodResolver(couponValidatorSchema),
    defaultValues: { code: prefillCode ?? '', cartTotal: '' },
    mode: 'onChange',
  });

  // Prefill code when navigating from detail screen
  useEffect(() => {
    if (prefillCode) {
      setValue('code', prefillCode);
      clearResult();
    }
  }, [prefillCode, setValue, clearResult]);

  const cartTotalValue = watch('cartTotal');

  const onSubmit = useCallback(
    (data: CouponValidatorFormData) => {
      if (!coupons) return;

      const cartTotal = Number(data.cartTotal);
      const result = validateCoupon(coupons, {
        code: data.code,
        cartTotal,
      });

      setResult(result);
    },
    [coupons, setResult],
  );

  const handleApply = useCallback(() => {
    if (!validationResult?.isValid || !validationResult.coupon) return;

    if (isAlreadyApplied(validationResult.coupon.id)) {
      showToast('This coupon is already applied!', 'error');
      return;
    }

    applyCoupon(
      validationResult.coupon,
      Number(cartTotalValue),
      validationResult.discountAmount ?? 0,
      validationResult.finalPrice ?? 0,
    );
    showToast('Coupon applied successfully!', 'success');
  }, [validationResult, cartTotalValue, applyCoupon, isAlreadyApplied, showToast]);

  return (
    <ScreenContainer>
      <Toast
        visible={toast.visible}
        message={toast.message}
        variant={toast.variant}
        onHide={hideToast}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.xxxl }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[typo.h2, styles.title, { color: colors.textPrimary }]}>
            Validate Coupon
          </Text>
          <Text style={[typo.bodySmall, { color: colors.textSecondary, marginTop: spacing.xs }]}>
            Enter a coupon code and cart total to check validity
          </Text>

          {/* Form */}
          <Animated.View
            entering={FadeInDown.duration(400).springify()}
            style={{ marginTop: spacing.xl }}
          >
            {/* Coupon Code Input */}
            <View style={{ marginBottom: spacing.base }}>
              <Text style={[typo.caption, styles.label, { color: colors.textSecondary }]}>
                COUPON CODE
              </Text>
              <Controller
                control={control}
                name="code"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="e.g. SAVE20"
                    placeholderTextColor={colors.textTertiary}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    style={[
                      typo.mono,
                      styles.input,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: errors.code ? colors.error : colors.border,
                        borderRadius: br.md,
                        color: colors.textPrimary,
                        paddingHorizontal: spacing.base,
                      },
                    ]}
                    accessibilityLabel="Coupon code input"
                    testID="coupon-code-input"
                  />
                )}
              />
              {errors.code && (
                <Text style={[typo.caption, { color: colors.error, marginTop: spacing.xs }]}>
                  {errors.code.message}
                </Text>
              )}
            </View>

            {/* Cart Total Input */}
            <View style={{ marginBottom: spacing.xl }}>
              <Text style={[typo.caption, styles.label, { color: colors.textSecondary }]}>
                CART TOTAL (₹)
              </Text>
              <Controller
                control={control}
                name="cartTotal"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="e.g. 1500"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="numeric"
                    style={[
                      typo.mono,
                      styles.input,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: errors.cartTotal ? colors.error : colors.border,
                        borderRadius: br.md,
                        color: colors.textPrimary,
                        paddingHorizontal: spacing.base,
                      },
                    ]}
                    accessibilityLabel="Cart total input"
                    testID="cart-total-input"
                  />
                )}
              />
              {errors.cartTotal && (
                <Text style={[typo.caption, { color: colors.error, marginTop: spacing.xs }]}>
                  {errors.cartTotal.message}
                </Text>
              )}
            </View>

            {/* Validate Button */}
            <PrimaryButton
              title="Validate"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
              size="lg"
              testID="validate-button"
              accessibilityLabel="Validate coupon"
            />
          </Animated.View>

          {/* Result */}
          {validationResult && (
            <View style={{ marginTop: spacing.xl }}>
              <ValidatorResultCard
                result={validationResult}
                cartTotal={Number(cartTotalValue) || 0}
              />
              {validationResult.isValid && (
                <PrimaryButton
                  title="Apply This Coupon"
                  onPress={handleApply}
                  variant="outline"
                  size="lg"
                  style={{ marginTop: spacing.base }}
                  testID="apply-validated-coupon"
                  accessibilityLabel="Apply validated coupon"
                />
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  title: {
    marginTop: 8,
  },
  label: {
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    letterSpacing: 1,
  },
});
