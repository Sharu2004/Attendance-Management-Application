import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, UserRole } from '../../types';
import { useApp } from '../../context/AppContext';
import { colors, typography, borderRadius, spacing } from '../../theme/theme';
import {
  AppHeader,
  SearchBar,
  DateFilter,
  DatePreset,
  AttendanceRecordCard,
  EmptyState,
} from '../../components';
import { Permissions } from '../../utils/permissions';
import { getTodayISODate, getRelativeDateISO } from '../../utils/dateUtils';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'TeamAttendance'>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'TeamAttendance'>;

export const TeamAttendanceScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<ScreenRouteProp>();
  const { currentUser, enrichedRecords, refreshAttendanceData } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [customDate, setCustomDate] = useState<string | undefined>(undefined);
  const [selectedRole, setSelectedRole] = useState<'all' | UserRole>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Check authorization
  const canAccess = currentUser
    ? Permissions.canAccessTeamAttendance(currentUser.role)
    : false;

  const isAdmin = currentUser?.role === 'admin';

  // 1. Authoritative Role-Based Filtering
  // Senior Staff can NEVER see Admin or other Senior Staff attendance records.
  const authorizedRecords = useMemo(() => {
    if (!currentUser || !canAccess) return [];
    return Permissions.filterVisibleAttendanceRecords(enrichedRecords, currentUser);
  }, [currentUser, canAccess, enrichedRecords]);

  // 2. Search, Date, and Role Filtering
  const filterUserId = route.params?.filterUserId;
  const filteredRecords = useMemo(() => {
    const today = getTodayISODate();
    const yesterday = getRelativeDateISO(-1);
    const sevenDaysAgo = getRelativeDateISO(-7);

    return authorizedRecords.filter((record) => {
      // Optional role filter (applicable to Admin)
      if (isAdmin && selectedRole !== 'all' && record.userRole !== selectedRole) {
        return false;
      }

      // Specific user filter if passed via route params
      if (filterUserId && record.userId !== filterUserId) {
        return false;
      }

      // Date filtering
      if (datePreset === 'today' && record.date !== today) {
        return false;
      }
      if (datePreset === 'yesterday' && record.date !== yesterday) {
        return false;
      }
      if (datePreset === 'week' && (record.date < sevenDaysAgo || record.date > today)) {
        return false;
      }
      if (datePreset === 'custom' && customDate && record.date !== customDate) {
        return false;
      }

      // Name & Email Search (Case-insensitive)
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatches = record.userName.toLowerCase().includes(query);
        const emailMatches = record.userEmail.toLowerCase().includes(query);
        return nameMatches || emailMatches;
      }

      return true;
    });
  }, [
    authorizedRecords,
    isAdmin,
    selectedRole,
    datePreset,
    customDate,
    searchQuery,
    filterUserId,
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAttendanceData();
    setRefreshing(false);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDatePreset('all');
    setCustomDate(undefined);
    setSelectedRole('all');
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    datePreset !== 'all' ||
    selectedRole !== 'all';

  if (!canAccess) {
    return (
      <View style={styles.container}>
        <AppHeader title="Access Denied" showBack onBack={() => navigation.goBack()} />
        <EmptyState
          iconName="lock-closed"
          title="Restricted Module"
          description="You do not possess the required supervisor permissions to view team attendance."
          actionTitle="Go Back"
          onActionPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  const rolePills: { id: 'all' | UserRole; label: string }[] = [
    { id: 'all', label: 'All Roles' },
    { id: 'admin', label: 'Admin' },
    { id: 'senior_staff', label: 'Senior Staff' },
    { id: 'staff', label: 'Staff' },
  ];

  return (
    <View style={styles.container}>
      <AppHeader
        title={isAdmin ? 'All Attendance Records' : 'Staff Attendance'}
        subtitle={
          isAdmin
            ? `Showing ${filteredRecords.length} records across organization`
            : `Showing ${filteredRecords.length} staff attendance records`
        }
        showBack
        onBack={() => navigation.goBack()}
      />

      {/* Filter and Search Controls */}
      <View style={styles.filterSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Filter by employee name..."
          onClear={() => setSearchQuery('')}
        />

        <DateFilter
          selectedPreset={datePreset}
          customDate={customDate}
          onSelectPreset={(preset, date) => {
            setDatePreset(preset);
            if (date) setCustomDate(date);
          }}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Role Filter Tabs (Admin Only) */}
        {isAdmin && (
          <View style={styles.roleTabsRow}>
            {rolePills.map((p) => {
              const isSelected = selectedRole === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setSelectedRole(p.id)}
                  style={[styles.roleTab, isSelected && styles.selectedRoleTab]}
                >
                  <Text
                    style={[
                      styles.roleTabText,
                      isSelected && styles.selectedRoleTabText,
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Records List */}
      <FlatList
        data={filteredRecords}
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
            iconName="search-outline"
            title="No Attendance Records Found"
            description="No records match your selected date range, search query, or role filters."
            actionTitle={hasActiveFilters ? 'Reset Filters' : undefined}
            onActionPress={handleClearFilters}
          />
        }
        renderItem={({ item }) => (
          <AttendanceRecordCard
            record={item}
            showEmployeeDetails={true}
            onPress={() => {
              if (
                currentUser &&
                Permissions.canViewUserHistory(currentUser, item.userRole, item.userId)
              ) {
                navigation.navigate('PersonalHistory', {
                  targetUserId: item.userId,
                  targetUserName: item.userName,
                });
              }
            }}
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
  filterSection: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  roleTabsRow: {
    flexDirection: 'row',
    marginTop: spacing.xs,
    gap: 6,
  },
  roleTab: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceVariant,
  },
  selectedRoleTab: {
    backgroundColor: colors.accent,
  },
  roleTabText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  selectedRoleTabText: {
    color: colors.textInverse,
  },
  listContent: {
    padding: spacing.lg,
  },
});
