/**
 * SearchInput — Animated search bar with icon, clear button, and debounced callback.
 */

import React, { useCallback } from 'react';
import { StyleSheet, View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTheme } from '../../theme';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  testID?: string;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search coupons...',
  testID,
}: SearchInputProps) {
  const { colors, typography: typo, borderRadius: br, spacing, iconSizes } = useTheme();

  const handleClear = useCallback(() => {
    onChangeText('');
  }, [onChangeText]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceElevated,
          borderRadius: br.md,
          borderColor: colors.border,
          paddingHorizontal: spacing.md,
        },
      ]}
    >
      <Ionicons
        name="search-outline"
        size={iconSizes.sm}
        color={colors.textTertiary}
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        style={[
          typo.body,
          styles.input,
          { color: colors.textPrimary },
        ]}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Search coupons"
        testID={testID}
      />
      {value.length > 0 && (
        <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(150)}>
          <Pressable
            onPress={handleClear}
            hitSlop={8}
            accessibilityLabel="Clear search"
          >
            <Ionicons
              name="close-circle"
              size={iconSizes.sm}
              color={colors.textTertiary}
            />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    padding: 0,
  },
});
