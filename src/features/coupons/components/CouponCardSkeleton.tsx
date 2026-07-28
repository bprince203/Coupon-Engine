/**
 * CouponCardSkeleton — Shimmer loading placeholder matching CouponCard layout.
 * Uses Reanimated for a smooth pulse animation.
 */

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../../theme';

export function CouponCardSkeleton() {
  const { colors, borderRadius: br, spacing } = useTheme();
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const skeletonBar = (width: number | string, height: number, marginTop = 0) => (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: width as number,
          height,
          backgroundColor: colors.skeleton,
          borderRadius: br.xs,
          marginTop,
        },
      ]}
    />
  );

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderRadius: br.lg,
          borderColor: colors.border,
          padding: spacing.base,
          marginBottom: spacing.md,
        },
      ]}
    >
      <View style={styles.topRow}>
        {skeletonBar(100, 14)}
        {skeletonBar(60, 22)}
      </View>
      {skeletonBar('80%' as unknown as number, 12, 12)}
      {skeletonBar('60%' as unknown as number, 12, 8)}
      <View style={[styles.bottomRow, { marginTop: spacing.md }]}>
        {skeletonBar(80, 16)}
        {skeletonBar(70, 24)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
