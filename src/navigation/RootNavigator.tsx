/**
 * RootNavigator — Bottom tab navigator with themed tab bar.
 * Compatible with React Navigation v6 (Expo SDK 52).
 *
 * Tabs: Cart | Coupons | Applied
 * (Validator tab removed — its functionality lives in the cart coupon drawer)
 */

import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { RootTabParamList } from './navigationTypes';
import { CartStackNavigator } from './CartStackNavigator';
import { CouponStackNavigator } from './CouponStackNavigator';
import { AppliedCouponsScreen } from '../features/coupons/screens/AppliedCouponsScreen';
import { useCouponStore } from '../features/coupons/store/useCouponStore';
import { useCartStore } from '../features/cart/store/useCartStore';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator() {
  const { colors } = useTheme();
  const appliedCount = useCouponStore((state) => state.appliedCoupons.length);
  const cartItemCount = useCartStore((state) => state.getItemCount());

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500' as const,
        },
      }}
    >
      <Tab.Screen
        name="CartTab"
        component={CartStackNavigator}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.accent,
            fontSize: 10,
            minWidth: 18,
          },
          tabBarAccessibilityLabel: 'Cart tab',
        }}
      />
      <Tab.Screen
        name="CouponsTab"
        component={CouponStackNavigator}
        options={{
          tabBarLabel: 'Coupons',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pricetags-outline" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Coupons tab',
        }}
      />
      <Tab.Screen
        name="AppliedTab"
        component={AppliedCouponsScreen}
        options={{
          tabBarLabel: 'Applied',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-outline" size={size} color={color} />
          ),
          tabBarBadge: appliedCount > 0 ? appliedCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.accent,
            fontSize: 10,
            minWidth: 18,
          },
          tabBarAccessibilityLabel: 'Applied coupons tab',
        }}
      />
    </Tab.Navigator>
  );
}

