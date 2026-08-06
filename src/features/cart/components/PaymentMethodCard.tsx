/**
 * PaymentMethodCard — Clean radio-style payment method row.
 * Used for UPI apps, Cards, and other payment methods.
 */

import React, { memo, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { AnimatedPressable } from '../../../shared/components/AnimatedPressable';

interface PaymentMethodCardProps {
  id: string;
  name: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBg?: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  renderIcon?: () => React.ReactNode;
}

export const PaymentMethodCard = memo(function PaymentMethodCard({
  id,
  name,
  subtitle,
  icon,
  iconColor,
  iconBg,
  isSelected,
  onSelect,
  renderIcon,
}: PaymentMethodCardProps) {
  const { colors, typography: typo } = useTheme();
  const handlePress = useCallback(() => onSelect(id), [id, onSelect]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
      pressScale={0.98}
      accessibilityLabel={`${name}${isSelected ? ', selected' : ''}`}
      testID={`payment-method-${id}`}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: iconBg ?? colors.surfaceElevated },
        ]}
      >
        {renderIcon ? (
          renderIcon()
        ) : (
          <Ionicons name={icon} size={20} color={iconColor ?? colors.textSecondary} />
        )}
      </View>

      {/* Text */}
      <View style={styles.textWrap}>
        <Text
          style={[
            typo.body,
            { color: colors.textPrimary, fontWeight: isSelected ? '600' : '400' },
          ]}
        >
          {name}
        </Text>
        {subtitle && (
          <Text style={[typo.caption, { color: colors.textTertiary, marginTop: 1 }]}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Radio */}
      <View
        style={[
          styles.radio,
          { borderColor: isSelected ? colors.accent : colors.textTertiary },
        ]}
      >
        {isSelected && (
          <View style={[styles.radioFill, { backgroundColor: colors.accent }]} />
        )}
      </View>
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textWrap: {
    flex: 1,
    marginLeft: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  radioFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
