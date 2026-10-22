import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, UserRole } from '../../types';
import { useApp } from '../../context/AppContext';
import { colors, typography, borderRadius, spacing, shadows } from '../../theme/theme';
import { AppHeader, SearchBar, RoleBadge, EmptyState } from '../../components';
import { Permissions } from '../../utils/permissions';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'UserManagement'>;

export const UserManagementScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { currentUser, users } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | UserRole>('all');

  // Verify Admin authorization
  const isAdmin = currentUser ? Permissions.canAccessUserManagement(currentUser.role) : false;

  const filteredUsers = useMemo(() => {
    if (!isAdmin) return [];

    return users.filter((u) => {
      // Role filter
      if (selectedRole !== 'all' && u.role !== selectedRole) {
        return false;
      }
      // Name & email search
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = u.name.toLowerCase().includes(query);
        const emailMatch = u.email.toLowerCase().includes(query);
        const idMatch = u.id.toLowerCase().includes(query);
        return nameMatch || emailMatch || idMatch;
      }
      return true;
    });
  }, [users, searchQuery, selectedRole, isAdmin]);

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <AppHeader title="Access Denied" showBack onBack={() => navigation.goBack()} />
        <EmptyState
          iconName="lock-closed"
          title="Admin Access Required"
          description="User management is restricted to administrative personnel only."
          actionTitle="Return to Dashboard"
          onActionPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  const rolePills: { id: 'all' | UserRole; label: string }[] = [
    { id: 'all', label: `All (${users.length})` },
    { id: 'admin', label: `Admins (${users.filter((u) => u.role === 'admin').length})` },
    { id: 'senior_staff', label: `Senior (${users.filter((u) => u.role === 'senior_staff').length})` },
    { id: 'staff', label: `Staff (${users.filter((u) => u.role === 'staff').length})` },
  ];

  return (
    <View style={styles.container}>
      <AppHeader
        title="User Management"
        subtitle="Employee Directory & Role Matrix"
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name, email, or ID..."
        />

        {/* Role Filter Chips */}
        <View style={styles.roleFilterRow}>
          {rolePills.map((p) => {
            const isSelected = selectedRole === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                onPress={() => setSelectedRole(p.id)}
                style={[
                  styles.roleChip,
                  isSelected && styles.selectedRoleChip,
                ]}
              >
                <Text
                  style={[
                    styles.roleChipText,
                    isSelected && styles.selectedRoleChipText,
                  ]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            iconName="people-outline"
            title="No Employees Found"
            description="No employees matched your current search criteria or role filter."
            actionTitle="Reset Filters"
            onActionPress={() => {
              setSearchQuery('');
              setSelectedRole('all');
            }}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            testID={`user-item-${item.id}`}
            activeOpacity={0.7}
            style={styles.userCard}
            onPress={() =>
              navigation.navigate('PersonalHistory', {
                targetUserId: item.id,
                targetUserName: item.name,
              })
            }
          >
            <View style={styles.cardHeader}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
              </View>
              <RoleBadge role={item.role} size="medium" />
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.metaItem}>
                <Ionicons name="card-outline" size={14} color={colors.textMuted} />
                <Text style={styles.metaText}>{item.id}</Text>
              </View>
              {item.department ? (
                <View style={styles.metaItem}>
                  <Ionicons name="business-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.metaText}>{item.department}</Text>
                </View>
              ) : null}
              {item.phone ? (
                <View style={styles.metaItem}>
                  <Ionicons name="call-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.metaText}>{item.phone}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.viewHistoryRow}>
              <Text style={styles.viewHistoryText}>View attendance history</Text>
              <Ionicons name="chevron-forward" size={14} color={colors.accent} />
            </View>
          </TouchableOpacity>
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
  searchSection: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  roleFilterRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: 6,
    flexWrap: 'wrap',
  },
  roleChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  selectedRoleChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleChipText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  selectedRoleChipText: {
    color: colors.textInverse,
  },
  listContent: {
    padding: spacing.lg,
  },
  userCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  userName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  userEmail: {
    ...typography.bodySmall,
    color: colors.accent,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  viewHistoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.xs + 2,
  },
  viewHistoryText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
    marginRight: 2,
  },
});
