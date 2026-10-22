import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useApp } from '../../context/AppContext';
import { colors, typography, borderRadius, spacing, shadows } from '../../theme/theme';
import { AppHeader, RoleBadge, PrimaryButton, LogoutModal } from '../../components';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { currentUser, users, logout, isActionLoading } = useApp();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Full user profile from users list
  const fullProfile = users.find((u) => u.id === currentUser?.id);

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Employee Profile"
        subtitle="Account & System Information"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Avatar Card */}
        <View style={styles.card}>
          <View style={styles.avatarLarge}>
            <Ionicons name="person" size={44} color={colors.accent} />
          </View>
          <Text style={styles.profileName}>{currentUser?.name}</Text>
          <Text style={styles.profileEmail}>{currentUser?.email}</Text>
          <View style={styles.roleWrapper}>
            {currentUser?.role ? <RoleBadge role={currentUser.role} size="medium" /> : null}
          </View>
        </View>

        {/* Account Details */}
        <Text style={styles.sectionTitle}>Employee Information</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Employee ID</Text>
            <Text style={styles.infoValue}>{currentUser?.id}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Department</Text>
            <Text style={styles.infoValue}>
              {fullProfile?.department || currentUser?.department || 'Operations'}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact Number</Text>
            <Text style={styles.infoValue}>{fullProfile?.phone || '+91 98400 00000'}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Region / Zone</Text>
            <Text style={styles.infoValue}>Tamil Nadu, India</Text>
          </View>
        </View>

        {/* Security & Architecture Disclosures */}
        <Text style={styles.sectionTitle}>System & Security Architecture</Text>
        <View style={styles.card}>
          <View style={styles.noticeRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.statusCompleted} />
            <View style={styles.noticeTextContainer}>
              <Text style={styles.noticeTitle}>Local Persistence Active</Text>
              <Text style={styles.noticeDesc}>
                Attendance records and active sessions are persisted locally via AsyncStorage with JSON schema integrity validation.
              </Text>
            </View>
          </View>

          <View style={[styles.noticeRow, { marginTop: spacing.md }]}>
            <Ionicons name="information-circle-outline" size={20} color={colors.accent} />
            <View style={styles.noticeTextContainer}>
              <Text style={styles.noticeTitle}>Architectural Security Note</Text>
              <Text style={styles.noticeDesc}>
                Frontend role validation controls navigation and local dataset selectors. Production deployments enforce permission boundaries at the API gateway layer.
              </Text>
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <PrimaryButton
          testID="profile-sign-out-button"
          title="Sign Out of Application"
          onPress={() => setShowLogoutModal(true)}
          variant="danger"
          icon={<Ionicons name="log-out-outline" size={20} color={colors.textInverse} />}
          style={styles.signOutButton}
        />

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        visible={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
        isLoading={isActionLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  avatarLarge: {
    width: 76,
    height: 76,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  profileName: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  profileEmail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  roleWrapper: {
    alignSelf: 'center',
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
  },
  infoLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.bodyMedium,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceVariant,
    marginVertical: spacing.xs,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noticeTextContainer: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  noticeTitle: {
    ...typography.bodyMedium,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  noticeDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  signOutButton: {
    marginTop: spacing.sm,
  },
});
