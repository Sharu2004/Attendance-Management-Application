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
  SummaryCard,
  AttendanceRecordCard,
  CheckInOutCard,
  LogoutModal,
} from '../../components';
import { calculateAdminDashboardStats } from '../../services/attendanceService';
import { getTodayISODate, formatDisplayDate } from '../../utils/dateUtils';

type AdminNavProp = NativeStackNavigationProp<RootStackParamList, 'AdminDashboard'>;

export const AdminDashboardScreen: React.FC = () => {
  const navigation = useNavigation<AdminNavProp>();
  const {
    currentUser,
    users,
    attendanceRecords,
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
  const stats = calculateAdminDashboardStats(users, attendanceRecords, todayDate);

  // Recent attendance records (take latest 5)
  const recentRecords = enrichedRecords.slice(0, 5);

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
        title="Admin Console"
        subtitle={formatDisplayDate(todayDate)}
        rightAction={
          <View style={styles.headerIcons}>
            <TouchableOpacity
              testID="admin-profile-button"
              onPress={() => navigation.navigate('Profile')}
              style={styles.headerIconButton}
            >
              <Ionicons name="person-circle-outline" size={26} color={colors.textInverse} />
            </TouchableOpacity>
            <TouchableOpacity
              testID="admin-logout-button"
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
            colors={[colors.primary]}
          />
        }
      >
        {/* Welcome Banner */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTextGroup}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.adminName}>{currentUser?.name || 'Administrator'}</Text>
            <Text style={styles.roleTag}>System Administrator • All Access</Text>
          </View>
          <View style={styles.adminIconShield}>
            <Ionicons name="shield-checkmark" size={32} color={colors.accent} />
          </View>
        </View>

        {/* Quick Navigation Action Grid */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            testID="nav-team-attendance"
            style={styles.actionButton}
            onPress={() => navigation.navigate('TeamAttendance', { roleRestricted: false })}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="list" size={22} color={colors.accent} />
            </View>
            <Text style={styles.actionLabel}>All Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="nav-user-management"
            style={styles.actionButton}
            onPress={() => navigation.navigate('UserManagement')}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#EDE9FE' }]}>
              <Ionicons name="people" size={22} color={colors.roleAdmin} />
            </View>
            <Text style={styles.actionLabel}>Manage Users</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="nav-personal-history"
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate('PersonalHistory', {
                targetUserId: currentUser?.id,
                targetUserName: currentUser?.name,
              })
            }
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#CCFBF1' }]}>
              <Ionicons name="time" size={22} color={colors.accentTeal} />
            </View>
            <Text style={styles.actionLabel}>My History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="nav-profile"
            style={styles.actionButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="settings-sharp" size={22} color={colors.textSecondary} />
            </View>
            <Text style={styles.actionLabel}>Profile Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Attendance Statistics Section */}
        <Text style={styles.sectionTitle}>Workforce Overview</Text>
        <View style={styles.statsGrid}>
          <SummaryCard
            label="Total Employees"
            value={stats.totalEmployees}
            iconName="people-outline"
            accentColor={colors.primary}
            style={styles.halfCard}
          />
          <SummaryCard
            label="Staff Members"
            value={stats.totalStaff}
            iconName="briefcase-outline"
            accentColor={colors.roleStaff}
            style={styles.halfCard}
          />
          <SummaryCard
            label="Senior Staff"
            value={stats.totalSeniorStaff}
            iconName="ribbon-outline"
            accentColor={colors.roleSenior}
            style={styles.halfCard}
          />
          <SummaryCard
            label="Checked In Today"
            value={stats.checkedInToday}
            iconName="checkmark-circle-outline"
            accentColor={colors.statusCompleted}
            style={styles.halfCard}
          />
          <SummaryCard
            label="Not Checked In Today"
            value={stats.notCheckedInToday}
            iconName="alert-circle-outline"
            accentColor={colors.statusOngoing}
            style={styles.fullCard}
          />
        </View>

        {/* Personal Attendance Action Widget */}
        <Text style={styles.sectionTitle}>Admin Personal Attendance</Text>
        <CheckInOutCard
          todayRecord={todayUserRecord}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          isLoading={isActionLoading}
        />

        {/* Recent Attendance Activity */}
        <View style={styles.recentHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Attendance Activity</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('TeamAttendance', { roleRestricted: false })}
          >
            <Text style={styles.viewAllText}>View All ({attendanceRecords.length})</Text>
          </TouchableOpacity>
        </View>

        {recentRecords.map((record) => (
          <AttendanceRecordCard
            key={record.id}
            record={record}
            showEmployeeDetails={true}
            onPress={() =>
              navigation.navigate('PersonalHistory', {
                targetUserId: record.userId,
                targetUserName: record.userName,
              })
            }
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
  welcomeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  welcomeTextGroup: {
    flex: 1,
  },
  greeting: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  adminName: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: 2,
  },
  roleTag: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
    marginTop: 4,
  },
  adminIconShield: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: 6,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    ...shadows.card,
  },
  actionIconCircle: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  actionLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  halfCard: {
    width: '48%',
  },
  fullCard: {
    width: '100%',
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
