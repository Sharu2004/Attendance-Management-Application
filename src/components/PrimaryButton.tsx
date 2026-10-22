import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { colors, typography, borderRadius, spacing } from '../theme/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'success';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  testID,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          button: { backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.surfaceBorder },
          text: { color: colors.textPrimary },
          indicator: colors.textPrimary,
        };
      case 'danger':
        return {
          button: { backgroundColor: colors.error, borderWidth: 0 },
          text: { color: colors.textInverse },
          indicator: colors.textInverse,
        };
      case 'outline':
        return {
          button: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
          text: { color: colors.primary },
          indicator: colors.primary,
        };
      case 'success':
        return {
          button: { backgroundColor: colors.statusCompleted, borderWidth: 0 },
          text: { color: colors.textInverse },
          indicator: colors.textInverse,
        };
      case 'primary':
      default:
        return {
          button: { backgroundColor: colors.primary, borderWidth: 0 },
          text: { color: colors.textInverse },
          indicator: colors.textInverse,
        };
    }
  };

  const currentVariant = getVariantStyles();
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        currentVariant.button,
        isDisabled && styles.disabledButton,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={currentVariant.indicator} />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.text,
              currentVariant.text,
              isDisabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  text: {
    ...typography.button,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.55,
  },
  disabledText: {
    opacity: 0.85,
  },
});
