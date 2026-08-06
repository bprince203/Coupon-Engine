/**
 * Typed navigation route parameters.
 * Provides type-safe navigation.navigate() calls throughout the app.
 * Compatible with React Navigation v6 (Expo SDK 52).
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// ─── Coupon Stack ────────────────────────────────────────────────

export type CouponStackParamList = {
  CouponList: undefined;
  CouponDetail: { couponId: string };
};

// ─── Cart Stack ──────────────────────────────────────────────────

export type CartStackParamList = {
  Cart: undefined;
  Checkout: undefined;
  Payment: undefined;
  OrderSuccess: {
    orderId: string;
    paidAmount: number;
    paymentMethod: string;
    savings: number;
    orderDate: number;
  };
};

// ─── Root Tabs ───────────────────────────────────────────────────

export type RootTabParamList = {
  CartTab: NavigatorScreenParams<CartStackParamList>;
  CouponsTab: NavigatorScreenParams<CouponStackParamList>;
  ValidatorTab: { prefillCode?: string } | undefined;
  AppliedTab: undefined;
};

// ─── Screen Props ────────────────────────────────────────────────

export type CouponListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<CouponStackParamList, 'CouponList'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type CouponDetailScreenProps = NativeStackScreenProps<
  CouponStackParamList,
  'CouponDetail'
>;

export type CouponValidatorScreenProps = BottomTabScreenProps<
  RootTabParamList,
  'ValidatorTab'
>;

export type AppliedCouponsScreenProps = BottomTabScreenProps<
  RootTabParamList,
  'AppliedTab'
>;

