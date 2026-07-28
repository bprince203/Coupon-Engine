/**
 * EmptyView — Displayed when a list has no items.
 * Provides visual feedback with icon, title, subtitle, and optional action.
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { PrimaryButton } from './PrimaryButton';

interface EmptyViewProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionTitle?: string;
  onAction?: () => void;
  testID?: string;
}

export function EmptyView({
  icon = 'ticket-outline',
  title,
  subtitle,
  actionTitle,
  onAction,
  testID,
}: EmptyViewProps) {
  const { colors, typography: typo, spacing } = useTheme();

  return (
    <View style={styles.container} testID={testID}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: colors.surfaceElevated },
        ]}
      >
        <Ionicons name={icon} size={48} color={colors.textTertiary} />
      </View>
      <Text
        style={[
          typo.h4,
          styles.title,
          { color: colors.textPrimary, marginTop: spacing.lg },
        ]}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[
            typo.body,
            styles.subtitle,
            { color: colors.textSecondary, marginTop: spacing.sm },
          ]}
        >
          {subtitle}
        </Text>
      ) : null}
      {actionTitle && onAction ? (
        <PrimaryButton
          title={actionTitle}
          onPress={onAction}
          variant="outline"
          size="sm"
          style={{ marginTop: spacing.lg }}
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
  subtitle: {
    textAlign: 'center',
    maxWidth: 280,
  },
});
