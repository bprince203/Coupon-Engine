/**
 * QuantityStepper — Pill-shaped quantity control.
 * Clean bordered design: [−] count [+]
 */

import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../../../theme';
import { AnimatedPressable } from '../../../shared/components/AnimatedPressable';

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  compact?: boolean;
}

export const QuantityStepper = memo(function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 10,
  compact = false,
}: QuantityStepperProps) {
  const { colors, typography: typo } = useTheme();

  const isMinReached = quantity <= min;
  const isMaxReached = quantity >= max;
  const btnSize = compact ? 28 : 32;
  const countWidth = compact ? 28 : 36;

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: colors.border,
          height: btnSize,
        },
      ]}
    >
      <AnimatedPressable
        onPress={onDecrement}
        disabled={isMinReached}
        style={[
          styles.btn,
          {
            width: btnSize,
            opacity: isMinReached ? 0.3 : 1,
          },
        ]}
        pressScale={0.88}
        accessibilityLabel="Decrease quantity"
        testID="qty-decrement"
      >
        <Text style={[styles.btnText, { color: colors.accent }]}>−</Text>
      </AnimatedPressable>

      <View style={[styles.countBox, { width: countWidth, borderColor: colors.border }]}>
        <Text style={[typo.body, { color: colors.textPrimary, fontWeight: '600' }]}>
          {quantity}
        </Text>
      </View>

      <AnimatedPressable
        onPress={onIncrement}
        disabled={isMaxReached}
        style={[
          styles.btn,
          {
            width: btnSize,
            opacity: isMaxReached ? 0.3 : 1,
          },
        ]}
        pressScale={0.88}
        accessibilityLabel="Increase quantity"
        testID="qty-increment"
      >
        <Text style={[styles.btnText, { color: colors.accent }]}>+</Text>
      </AnimatedPressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 22,
  },
  countBox: {
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: '100%',
  },
});
