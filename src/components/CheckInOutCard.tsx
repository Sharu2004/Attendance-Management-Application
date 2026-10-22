import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AttendanceRecord } from '../types';
import { colors, typography, borderRadius, spacing, shadows } from '../theme/theme';
import { formatDisplayDate, formatDisplayTime, getTodayISODate } from '../utils/dateUtils';
import { AttendanceStatusBadge } from './AttendanceStatusBadge';
import { PrimaryButton } from './PrimaryButton';

interface CheckInOutCardProps {
  todayRecord: AttendanceRecord | null;
  onCheckIn: () => Promise<{ success: boolean; message: string }>;
  onCheckOut: () => Promise<{ success: boolean; message: string }>;
  isLoading?: boolean;
}

export const CheckInOutCard: React.FC<CheckInOutCardProps> = ({
  todayRecord,
  onCheckIn,
  onCheckOut,
  isLoading = false,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const status = todayRecord ? todayRecord.status : 'not_checked_in';
  const todayDateStr = getTodayISODate();

  const handleAction = async (action: 'in' | 'out') => {
    if (submitting || isLoading) return;
    setSubmitting(true);
    setFeedback(null);

    try {
      const result = action === 'in' ? await onCheckIn() : await onCheckOut();
      if (result.success) {
        setFeedback({ type: 'success', text: result.message });
        // Auto clear feedback after 4 seconds
        setTimeout(() => setFeedback(null), 4000);
      } else {
        setFeedback({ type: 'error', text: result.message });
      }
    } catch {
      setFeedback({ type: 'error', text: 'An unexpected network/storage error occurred.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerLabel}>{"Today's Status"}</Text>
          <Text style={styles.dateLabel}>{formatDisplayDate(todayDateStr)}</Text>
        </View>
        <AttendanceStatusBadge status={status} size="medium" />
      </View>

      {/* Timestamps Row */}
      <View style={styles.timestampContainer}>
        <View style={styles.timeBox}>
          <Text style={styles.timeLabel}>Check-In Time</Text>
          <View style={styles.timeValueRow}>
            <Ionicons
              name="log-in"
              size={18}
              color={todayRecord?.checkInTime ? colors.statusOngoing : colors.textMuted}
            />
            <Text style={styles.timeValueText}>
              {formatDisplayTime(todayRecord?.checkInTime)}
            </Text>
          </View>
        </View>

        <View style={styles.timeDivider} />

        <View style={styles.timeBox}>
          <Text style={styles.timeLabel}>Check-Out Time</Text>
          <View style={styles.timeValueRow}>
            <Ionicons
              name="log-out"
              size={18}
              color={todayRecord?.checkOutTime ? colors.statusCompleted : colors.textMuted}
            />
            <Text style={styles.timeValueText}>
              {formatDisplayTime(todayRecord?.checkOutTime)}
            </Text>
          </View>
        </View>
      </View>

      {/* User Feedback Alert */}
      {feedback && (
        <View
          style={[
            styles.feedbackBanner,
            feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError,
          ]}
        >
          <Ionicons
            name={feedback.type === 'success' ? 'checkmark-circle' : 'alert-circle'}
            size={18}
            color={feedback.type === 'success' ? colors.statusCompleted : colors.error}
          />
          <Text
            style={[
              styles.feedbackText,
              { color: feedback.type === 'success' ? colors.statusCompleted : colors.error },
            ]}
          >
            {feedback.text}
          </Text>
        </View>
      )}

      {/* Dynamic Action Area */}
      <View style={styles.actionContainer}>
        {status === 'not_checked_in' && (
          <PrimaryButton
            testID="check-in-button"
            title="Check In Now"
            onPress={() => handleAction('in')}
            isLoading={submitting || isLoading}
            variant="primary"
            icon={<Ionicons name="finger-print" size={20} color={colors.textInverse} />}
          />
        )}

        {status === 'checked_in' && (
          <PrimaryButton
            testID="check-out-button"
            title="Check Out Now"
            onPress={() => handleAction('out')}
            isLoading={submitting || isLoading}
            variant="success"
            icon={<Ionicons name="log-out-outline" size={20} color={colors.textInverse} />}
          />
        )}

        {status === 'checked_out' && (
          <View style={styles.completedNotice}>
            <Ionicons name="checkmark-done-circle" size={24} color={colors.statusCompleted} />
            <Text style={styles.completedNoticeText}>
              Attendance completed for today. Great work!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    ...shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  dateLabel: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: 2,
  },
  timestampContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  timeBox: {
    flex: 1,
  },
  timeDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.surfaceBorder,
    marginHorizontal: spacing.md,
  },
  timeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  timeValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeValueText: {
    ...typography.bodyLarge,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 6,
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  feedbackSuccess: {
    backgroundColor: colors.statusCompletedBg,
    borderWidth: 1,
    borderColor: colors.statusCompletedBorder,
  },
  feedbackError: {
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: colors.errorBorder,
  },
  feedbackText: {
    ...typography.bodySmall,
    fontWeight: '500',
    marginLeft: spacing.xs,
    flex: 1,
  },
  actionContainer: {
    marginTop: spacing.xs,
  },
  completedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.statusCompletedBg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.statusCompletedBorder,
  },
  completedNoticeText: {
    ...typography.bodyMedium,
    color: colors.statusCompleted,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});
