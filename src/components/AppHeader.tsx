import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme/theme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  showBack?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
  showBack = false,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.contentRow}>
        {showBack && onBack ? (
          <TouchableOpacity
            testID="header-back-button"
            onPress={onBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color={colors.textInverse} />
          </TouchableOpacity>
        ) : null}

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {rightAction ? <View style={styles.rightAction}>{rightAction}</View> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryLight,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    color: colors.textInverse,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.accentLight,
    marginTop: 2,
  },
  rightAction: {
    marginLeft: spacing.md,
  },
});
