/**
 * ScreenContainer — Wraps every screen with SafeAreaView and consistent styling.
 * Eliminates repetitive boilerplate across all screen files.
 */

import React, { ReactNode } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

interface ScreenContainerProps {
  children: ReactNode;
  /** Whether to include horizontal padding (default: true) */
  padded?: boolean;
  /** Custom background color override */
  backgroundColor?: string;
}

export function ScreenContainer({
  children,
  padded = true,
  backgroundColor,
}: ScreenContainerProps) {
  const { colors, isDark, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor ?? colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingHorizontal: padded ? spacing.base : 0,
        },
      ]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor ?? colors.background}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
