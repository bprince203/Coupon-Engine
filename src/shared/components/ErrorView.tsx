/**
 * ErrorView — Displayed when an API call or operation fails.
 * Provides error message and retry button.
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { PrimaryButton } from './PrimaryButton';

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
  testID?: string;
}

export function ErrorView({
  message = 'Something went wrong. Please try again.',
  onRetry,
  testID,
}: ErrorViewProps) {
  const { colors, typography: typo, spacing } = useTheme();

  return (
    <View style={styles.container} testID={testID}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: colors.errorBackground },
        ]}
      >
        <Ionicons name="cloud-offline-outline" size={48} color={colors.error} />
      </View>
      <Text
        style={[
          typo.h4,
          styles.title,
          { color: colors.textPrimary, marginTop: spacing.lg },
        ]}
      >
        Oops!
      </Text>
      <Text
        style={[
          typo.body,
          styles.message,
          { color: colors.textSecondary, marginTop: spacing.sm },
        ]}
      >
        {message}
      </Text>
      {onRetry ? (
        <PrimaryButton
          title="Try Again"
          onPress={onRetry}
          variant="filled"
          size="sm"
          style={{ marginTop: spacing.xl }}
          accessibilityLabel="Retry"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    maxWidth: 280,
  },
});
