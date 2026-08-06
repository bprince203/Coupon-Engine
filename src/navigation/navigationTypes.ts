import type { NativeStackScreenProps } from '@react-navigation/native-stack';

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

export type CartScreenProps = NativeStackScreenProps<CartStackParamList, 'Cart'>;
export type CheckoutScreenProps = NativeStackScreenProps<CartStackParamList, 'Checkout'>;
export type PaymentScreenProps = NativeStackScreenProps<CartStackParamList, 'Payment'>;
export type OrderSuccessScreenProps = NativeStackScreenProps<CartStackParamList, 'OrderSuccess'>;
