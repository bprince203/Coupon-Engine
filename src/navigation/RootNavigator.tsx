/**
 * RootNavigator — Bottom tab navigator with themed tab bar.
 * Three tabs: Coupons (stack), Validator, Applied.
 */

import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { RootTabParamList } from './navigationTypes';
import { CouponStackNavigator } from './CouponStackNavigator';
import { CouponValidatorScreen } from '../features/coupons/screens/CouponValidatorScreen';
import { AppliedCouponsScreen } from '../features/coupons/screens/AppliedCouponsScreen';
import { useCouponStore } from '../features/coupons/store/useCouponStore';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator() {
  const { colors, typography: typo } = useTheme();
  const appliedCount = useCouponStore((state) => state.appliedCoupons.length);

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
          ...typo.caption,
          fontSize: 11,
        },
      }}
    >
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
        name="ValidatorTab"
        component={CouponValidatorScreen}
        options={{
          tabBarLabel: 'Validate',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield-checkmark-outline" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Validate coupon tab',
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
            color: colors.textInverse,
            fontSize: 10,
            fontWeight: '600',
            minWidth: 18,
            height: 18,
            lineHeight: 18,
          },
          tabBarAccessibilityLabel: 'Applied coupons tab',
        }}
      />
    </Tab.Navigator>
  );
}
