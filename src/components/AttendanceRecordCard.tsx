import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EnrichedAttendanceRecord } from '../types';
import { colors, typography, borderRadius, spacing, shadows } from '../theme/theme';
import { formatDisplayDate, formatDisplayTime } from '../utils/dateUtils';
import { AttendanceStatusBadge } from './AttendanceStatusBadge';
import { RoleBadge } from './RoleBadge';

interface AttendanceRecordCardProps {
  record: EnrichedAttendanceRecord;
  showEmployeeDetails?: boolean;
  onPress?: () => void;
}

export const AttendanceRecordCard: React.FC<AttendanceRecordCardProps> = ({
  record,
  showEmployeeDetails = true,
  onPress,
}) => {
  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      activeOpacity={0.75}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        {showEmployeeDetails ? (
          <View style={styles.nameBlock}>
            <Text style={styles.employeeName} numberOfLines={1}>
              {record.userName}
            </Text>
            <View style={styles.badgeRow}>
              <RoleBadge role={record.userRole} />
              {record.userDepartment ? (
                <Text style={styles.departmentText} numberOfLines={1}>
                  • {record.userDepartment}
                </Text>
              ) : null}
            </View>
          </View>
        ) : (
          <View style={styles.dateBlock}>
            <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.dateText}>{formatDisplayDate(record.date)}</Text>
          </View>
        )}

        <AttendanceStatusBadge status={record.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsRow}>
        {showEmployeeDetails && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{formatDisplayDate(record.date)}</Text>
          </View>
        )}

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Check-In</Text>
          <View style={styles.timeWithIcon}>
            <Ionicons name="log-in-outline" size={14} color={colors.statusOngoing} />
            <Text style={styles.detailValue}>
              {formatDisplayTime(record.checkInTime)}
            </Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Check-Out</Text>
          <View style={styles.timeWithIcon}>
            <Ionicons name="log-out-outline" size={14} color={colors.statusCompleted} />
            <Text style={styles.detailValue}>
              {formatDisplayTime(record.checkOutTime)}
            </Text>
          </View>
        </View>
      </View>

      {onPress && (
        <View style={styles.tapHintRow}>
          <Text style={styles.tapHintText}>Tap to view history</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.accent} />
        </View>
      )}
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    ...shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameBlock: {
    flex: 1,
    marginRight: spacing.sm,
  },
  employeeName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  departmentText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  dateBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    ...typography.h3,
    color: colors.textPrimary,
    marginLeft: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceVariant,
    marginVertical: spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  timeWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailValue: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '500',
    marginLeft: 4,
  },
  tapHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
  },
  tapHintText: {
    ...typography.caption,
    color: colors.accent,
    marginRight: 2,
    fontWeight: '600',
  },
});
