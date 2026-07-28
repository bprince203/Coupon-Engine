/**
 * Layout constants for consistent spacing across the app.
 */

import { Dimensions, Platform, StatusBar } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const LAYOUT = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  screenPadding: 16,
  cardPadding: 16,
  statusBarHeight: Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0,
  tabBarHeight: 60,
  headerHeight: 56,
} as const;
