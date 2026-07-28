/**
 * FilterTabs — Horizontal scrollable filter tabs for coupon types.
 * Animated active indicator with Reanimated.
 */

import React, { useCallback } from 'react';
import { StyleSheet, ScrollView, Text, Pressable, View } from 'react-native';
import { useTheme } from '../../../theme';
import { FILTER_OPTIONS } from '../constants';
import { CouponFilterType } from '../types';

interface FilterTabsProps {
  activeFilter: CouponFilterType;
  onFilterChange: (filter: CouponFilterType) => void;
  testID?: string;
}

export function FilterTabs({ activeFilter, onFilterChange, testID }: FilterTabsProps) {
  const { colors, typography: typo, borderRadius: br, spacing } = useTheme();

  const renderTab = useCallback(
    (option: (typeof FILTER_OPTIONS)[number]) => {
      const isActive = activeFilter === option.key;

      return (
        <Pressable
          key={option.key}
          onPress={() => onFilterChange(option.key as CouponFilterType)}
          style={[
            styles.tab,
            {
              backgroundColor: isActive ? colors.accent : colors.surfaceElevated,
              borderRadius: br.full,
              paddingHorizontal: spacing.base,
              paddingVertical: spacing.sm,
              marginRight: spacing.sm,
              borderWidth: isActive ? 0 : 1,
              borderColor: colors.border,
            },
          ]}
          accessibilityRole="tab"
          accessibilityState={{ selected: isActive }}
          accessibilityLabel={`Filter: ${option.label}`}
        >
          <Text
            style={[
              typo.buttonSmall,
              {
                color: isActive ? colors.textInverse : colors.textSecondary,
              },
            ]}
          >
            {option.label}
          </Text>
        </Pressable>
      );
    },
    [activeFilter, onFilterChange, colors, typo, br, spacing],
  );

  return (
    <View testID={testID}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTER_OPTIONS.map(renderTab)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 4,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
