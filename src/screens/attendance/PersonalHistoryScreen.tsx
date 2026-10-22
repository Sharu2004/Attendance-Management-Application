import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useApp } from '../../context/AppContext';
import { colors, typography, borderRadius, spacing } from '../../theme/theme';
import {
  AppHeader,
  AttendanceRecordCard,
  EmptyState,
  RoleBadge,
} from '../../components';
import { Permissions } from '../../utils/permissions';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'PersonalHistory'>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'PersonalHistory'>;

export const PersonalHistoryScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<ScreenRouteProp>();
  const { currentUser, enrichedRecords, users, refreshAttendanceData } = useApp();

  const [refreshing, setRefreshing] = useState(false);

  // Target user ID is either passed via route or defaults to current logged in user
  const targetUserId = route.params?.targetUserId || currentUser?.id || '';
  const targetUser = users.find((u) => u.id === targetUserId);
  const isOwnHistory = currentUser?.id === targetUserId;

  // Authorization check
  const canView = useMemo(() => {
    if (!currentUser || !targetUser) return false;
    return Permissions.canViewUserHistory(currentUser, targetUser.role, targetUserId);
  }, [currentUser, targetUser, targetUserId]);

  // Filter history records for this specific user, sorted latest first
  const userHistoryRecords = useMemo(() => {
    if (!canView) return [];
    return enrichedRecords.filter((r) => r.userId === targetUserId);
  }, [enrichedRecords, targetUserId, canView]);

  // Aggregate metrics
  const completedCount = userHistoryRecords.filter((r) => r.status === 'checked_out').length;
  const ongoingCount = userHistoryRecords.filter((r) => r.status === 'checked_in').length;

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAttendanceData();
    setRefreshing(false);
  };

  if (!canView) {
    return (
      <View style={styles.container}>
        <AppHeader title="Access Restricted" showBack onBack={() => navigation.goBack()} />
        <EmptyState
          iconName="lock-closed"
          title="Unauthorized Access"
          description="You are not authorized to view this employee's personal attendance records."
          actionTitle="Return"
          onActionPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title={isOwnHistory ? 'My Attendance History' : `${targetUser?.name}'s History`}
        subtitle={`${userHistoryRecords.length} Total Logs Recorded`}
        showBack
        onBack={() => navigation.goBack()}
      />

      {/* Employee Context Card */}
      <View style={styles.userBanner}>
        <View style={styles.userBannerInfo}>
          <Text style={styles.bannerName}>{targetUser?.name}</Text>
          <Text style={styles.bannerEmail}>{targetUser?.email}</Text>
          <View style={styles.badgeRow}>
            {targetUser?.role ? <RoleBadge role={targetUser.role} /> : null}
            {targetUser?.department ? (
              <Text style={styles.departmentText}>• {targetUser.department}</Text>
            ) : null}
          </View>
        </View>

        {/* Mini stats */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statPillValue}>{completedCount}</Text>
            <Text style={styles.statPillLabel}>Completed</Text>
          </View>
          <View style={[styles.statPill, { marginLeft: spacing.xs }]}>
            <Text style={[styles.statPillValue, { color: colors.statusOngoing }]}>
              {ongoingCount}
            </Text>
            <Text style={styles.statPillLabel}>Active</Text>
          </View>
        </View>
      </View>

      {/* History List */}
      <FlatList
        data={userHistoryRecords}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            iconName="calendar-clear-outline"
            title="No Attendance History Found"
            description="There are no past check-in or check-out logs recorded for this employee."
          />
        }
        renderItem={({ item }) => (
          <AttendanceRecordCard
            record={item}
            showEmployeeDetails={false}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  userBanner: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userBannerInfo: {
    flex: 1,
  },
  bannerName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  bannerEmail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  departmentText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statPill: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.md,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  statPillValue: {
    ...typography.h3,
    fontSize: 15,
    color: colors.statusCompleted,
  },
  statPillLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
  },
  listContent: {
    padding: spacing.lg,
  },
});
