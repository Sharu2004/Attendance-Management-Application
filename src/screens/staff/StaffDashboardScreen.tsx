import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useApp } from '../../context/AppContext';
import { colors, typography, borderRadius, spacing, shadows } from '../../theme/theme';
import {
  AppHeader,
  CheckInOutCard,
  AttendanceRecordCard,
  LogoutModal,
  RoleBadge,
} from '../../components';
import { getTodayISODate, formatDisplayDate } from '../../utils/dateUtils';

type StaffNavProp = NativeStackNavigationProp<RootStackParamList, 'StaffDashboard'>;

export const StaffDashboardScreen: React.FC = () => {
  const navigation = useNavigation<StaffNavProp>();
  const {
    currentUser,
    enrichedRecords,
    todayUserRecord,
    handleCheckIn,
    handleCheckOut,
    refreshAttendanceData,
    logout,
    isActionLoading,
  } = useApp();

  const [refreshing, setRefreshing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const todayDate = getTodayISODate();

  // Get current user's past records (latest 3)
  const myRecentRecords = enrichedRecords
    .filter((r) => r.userId === currentUser?.id)
    .slice(0, 3);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAttendanceData();
    setRefreshing(false);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Employee Portal"
        subtitle={formatDisplayDate(todayDate)}
        rightAction={
          <View style={styles.headerIcons}>
            <TouchableOpacity
              testID="staff-profile-button"
              onPress={() => navigation.navigate('Profile')}
              style={styles.headerIconButton}
            >
              <Ionicons name="person-circle-outline" size={26} color={colors.textInverse} />
            </TouchableOpacity>
            <TouchableOpacity
              testID="staff-logout-button"
              onPress={() => setShowLogoutModal(true)}
              style={styles.headerIconButton}
            >
              <Ionicons name="log-out-outline" size={24} color={colors.textInverse} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.accentTeal]}
          />
        }
      >
        {/* Employee Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={28} color={colors.accentTeal} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.employeeName}>{currentUser?.name || 'Employee'}</Text>
            <Text style={styles.employeeEmail}>{currentUser?.email}</Text>
            <View style={styles.roleBadgeRow}>
              <RoleBadge role={currentUser?.role || 'staff'} />
              {currentUser?.department ? (
                <Text style={styles.departmentLabel}>
                  • {currentUser.department}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Primary Attendance Action Card */}
        <Text style={styles.sectionTitle}>Daily Attendance Action</Text>
        <CheckInOutCard
          todayRecord={todayUserRecord}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          isLoading={isActionLoading}
        />

        {/* Quick Shortcut to Personal Attendance History */}
        <TouchableOpacity
          testID="staff-history-shortcut"
          style={styles.historyShortcutCard}
          onPress={() =>
            navigation.navigate('PersonalHistory', {
              targetUserId: currentUser?.id,
              targetUserName: currentUser?.name,
            })
          }
        >
          <View style={styles.shortcutIconCircle}>
            <Ionicons name="time-outline" size={24} color={colors.accent} />
          </View>
          <View style={styles.shortcutTextGroup}>
            <Text style={styles.shortcutTitle}>View My Complete Attendance Log</Text>
            <Text style={styles.shortcutSub}>
              Inspect timestamps, status badges, and past attendance logs
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Recent Personal Logs */}
        <View style={styles.recentHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Logs</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PersonalHistory', {
                targetUserId: currentUser?.id,
                targetUserName: currentUser?.name,
              })
            }
          >
            <Text style={styles.viewAllText}>View All History</Text>
          </TouchableOpacity>
        </View>

        {myRecentRecords.map((record) => (
          <AttendanceRecordCard
            key={record.id}
            record={record}
            showEmployeeDetails={false}
          />
        ))}

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
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerIconButton: {
    padding: spacing.xs,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: borderRadius.full,
    backgroundColor: colors.roleStaffBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 1.5,
    borderColor: '#99F6E4',
  },
  profileInfo: {
    flex: 1,
  },
  employeeName: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  employeeEmail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  roleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  departmentLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  historyShortcutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    ...shadows.card,
  },
  shortcutIconCircle: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  shortcutTextGroup: {
    flex: 1,
  },
  shortcutTitle: {
    ...typography.h3,
    fontSize: 14,
    color: colors.textPrimary,
  },
  shortcutSub: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  recentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  viewAllText: {
    ...typography.bodySmall,
    color: colors.accent,
    fontWeight: '600',
  },
});
