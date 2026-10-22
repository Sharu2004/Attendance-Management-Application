import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../theme/theme';

interface SummaryCardProps {
  label: string;
  value: number | string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  accentColor?: string;
  style?: ViewStyle;
  testID?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  value,
  iconName,
  iconColor = colors.accent,
  accentColor = colors.accent,
  style,
  testID,
}) => {
  return (
    <View
      testID={testID}
      style={[
        styles.card,
        { borderTopColor: accentColor, borderTopWidth: 3 },
        style,
      ]}
    >
      <View style={styles.topRow}>
        <Text style={styles.label} numberOfLines={2}>
          {label}
        </Text>
        {iconName ? (
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: `${accentColor}15` },
            ]}
          >
            <Ionicons name={iconName} size={20} color={iconColor} />
          </View>
        ) : null}
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    ...shadows.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
    fontWeight: '500',
    marginRight: spacing.xs,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    ...typography.h1,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
});
