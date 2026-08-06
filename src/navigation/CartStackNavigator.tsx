import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme';
import { CartStackParamList } from './navigationTypes';
import { CartScreen } from '../features/cart/screens/CartScreen';
import { CheckoutScreen } from '../features/cart/screens/CheckoutScreen';
import { PaymentScreen } from '../features/cart/screens/PaymentScreen';
import { OrderSuccessScreen } from '../features/cart/screens/OrderSuccessScreen';

const Stack = createNativeStackNavigator<CartStackParamList>();

export function CartStackNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
