/**
 * CouponStackNavigator — Stack navigator for coupon list → detail flow.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme';
import { CouponStackParamList } from './navigationTypes';
import { CouponListScreen } from '../features/coupons/screens/CouponListScreen';
import { CouponDetailScreen } from '../features/coupons/screens/CouponDetailScreen';

const Stack = createNativeStackNavigator<CouponStackParamList>();

export function CouponStackNavigator() {
  const { colors, typography: typo } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: typo.h4.fontWeight,
          fontSize: typo.h4.fontSize,
          fontFamily: typo.h4.fontFamily,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="CouponList"
        component={CouponListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CouponDetail"
        component={CouponDetailScreen}
        options={{ title: 'Coupon Details' }}
      />
    </Stack.Navigator>
  );
}
