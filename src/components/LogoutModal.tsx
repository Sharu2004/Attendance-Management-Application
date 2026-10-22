import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../theme/theme';
import { PrimaryButton } from './PrimaryButton';

interface LogoutModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="log-out-outline" size={32} color={colors.error} />
          </View>

          <Text style={styles.title}>Confirm Logout</Text>
          <Text style={styles.description}>
            Are you sure you want to end your current session and return to the login screen?
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onCancel}
              style={styles.cancelButton}
              disabled={isLoading}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <PrimaryButton
              testID="confirm-logout-button"
              title="Sign Out"
              onPress={onConfirm}
              variant="danger"
              isLoading={isLoading}
              style={styles.confirmButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.modal,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: colors.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  cancelText: {
    ...typography.button,
    color: colors.textSecondary,
  },
  confirmButton: {
    flex: 1,
    height: 44,
  },
});
