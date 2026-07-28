/**
 * StatusBadge — Displays Active/Expired status as a colored pill.
 */

import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../theme';
import { CouponStatus } from '../types';

interface StatusBadgeProps {
  status: CouponStatus;
}

export const StatusBadge = memo(function StatusBadge({ status }: StatusBadgeProps) {
  const { colors, typography: typo, borderRadius: br, spacing } = useTheme();

  const isActive = status === 'active';
  const backgroundColor = isActive ? colors.successBackground : colors.errorBackground;
  const textColor = isActive ? colors.success : colors.error;
  const label = isActive ? 'Active' : 'Expired';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          borderRadius: br.full,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xxs,
        },
      ]}
      accessibilityLabel={`Status: ${label}`}
    >
      <View style={[styles.dot, { backgroundColor: textColor }]} />
      <Text style={[typo.caption, { color: textColor }]}>{label}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
});
