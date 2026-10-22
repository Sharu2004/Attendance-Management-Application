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
  EmptyState,
} from '../../components';
import { calculateSeniorDashboardStats } from '../../services/attendanceService';
import { getTodayISODate, formatDisplayDate } from '../../utils/dateUtils';

type SeniorNavProp = NativeStackNavigationProp<RootStackParamList, 'SeniorDashboard'>;

export const SeniorDashboardScreen: React.FC = () => {
  const navigation = useNavigation<SeniorNavProp>();
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

  // Strict Senior Staff calculations: STAFF ONLY
  const seniorStats = calculateSeniorDashboardStats(users, attendanceRecords, todayDate);

  // Today's Staff attendance records strictly: userRole === 'staff' and date === todayDate
  const todayStaffRecords = enrichedRecords.filter(
    (r) => r.userRole === 'staff' && r.date === todayDate
  );

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
        title="Senior Staff Portal"
        subtitle={formatDisplayDate(todayDate)}
        rightAction={
          <View style={styles.headerIcons}>
            <TouchableOpacity
              testID="senior-profile-button"
              onPress={() => navigation.navigate('Profile')}
              style={styles.headerIconButton}
            >
              <Ionicons name="person-circle-outline" size={26} color={colors.textInverse} />
            </TouchableOpacity>
            <TouchableOpacity
              testID="senior-logout-button"
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
            colors={[colors.accent]}
          />
        }
      >
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTextGroup}>
            <Text style={styles.greeting}>Welcome,</Text>
            <Text style={styles.userName}>{currentUser?.name || 'Senior Staff'}</Text>
            <Text style={styles.roleTag}>Senior Staff Member • Team Supervisor</Text>
          </View>
          <View style={styles.seniorBadgeIcon}>
            <Ionicons name="ribbon" size={30} color={colors.roleSenior} />
          </View>
        </View>

        {/* Quick Nav Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            testID="senior-nav-staff-attendance"
            style={styles.actionCard}
            onPress={() => navigation.navigate('TeamAttendance', { roleRestricted: true })}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="people" size={22} color={colors.roleSenior} />
            </View>
            <Text style={styles.actionCardTitle}>Staff Attendance</Text>
            <Text style={styles.actionCardSub}>Filter and search staff</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="senior-nav-history"
            style={styles.actionCard}
            onPress={() =>
              navigation.navigate('PersonalHistory', {
                targetUserId: currentUser?.id,
                targetUserName: currentUser?.name,
              })
            }
          >
            <View style={[styles.iconCircle, { backgroundColor: '#CCFBF1' }]}>
              <Ionicons name="time" size={22} color={colors.accentTeal} />
            </View>
            <Text style={styles.actionCardTitle}>My History</Text>
            <Text style={styles.actionCardSub}>Personal attendance log</Text>
          </TouchableOpacity>
        </View>

        {/* Senior Staff Personal Attendance */}
        <Text style={styles.sectionTitle}>My Attendance</Text>
        <CheckInOutCard
          todayRecord={todayUserRecord}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          isLoading={isActionLoading}
        />

        {/* Staff Team Overview (Staff Only!) */}
        <Text style={styles.sectionTitle}>Staff Team Overview</Text>
        <View style={styles.statsGrid}>
          <SummaryCard
            label="Total Staff Team"
            value={seniorStats.totalStaff}
            iconName="briefcase-outline"
            accentColor={colors.roleStaff}
            style={styles.thirdCard}
          />
          <SummaryCard
            label="Staff Checked In"
            value={seniorStats.checkedInStaffToday}
            iconName="checkmark-circle-outline"
            accentColor={colors.statusCompleted}
            style={styles.thirdCard}
          />
          <SummaryCard
            label="Staff Pending"
            value={seniorStats.notCheckedInStaffToday}
            iconName="alert-circle-outline"
            accentColor={colors.statusOngoing}
            style={styles.fullCard}
          />
        </View>

        {/* Today's Staff Attendance Activity */}
        <View style={styles.recentHeaderRow}>
          <Text style={styles.sectionTitle}>{"Today's Staff Activity"}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('TeamAttendance', { roleRestricted: true })}
          >
            <Text style={styles.viewAllText}>View All Staff History</Text>
          </TouchableOpacity>
        </View>

        {todayStaffRecords.length === 0 ? (
          <EmptyState
            iconName="calendar-outline"
            title="No Staff Activity Today"
            description="No staff members have checked in yet for today's session."
          />
        ) : (
          todayStaffRecords.map((record) => (
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
          ))
        )}

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
  userName: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: 2,
  },
  roleTag: {
    ...typography.caption,
    color: colors.roleSenior,
    fontWeight: '600',
    marginTop: 4,
  },
  seniorBadgeIcon: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.full,
    backgroundColor: colors.roleSeniorBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    ...shadows.card,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  actionCardTitle: {
    ...typography.h3,
    fontSize: 14,
    color: colors.textPrimary,
  },
  actionCardSub: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
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
  thirdCard: {
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
