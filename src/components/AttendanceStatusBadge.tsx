import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AttendanceStatus } from '../types';
import { colors, borderRadius } from '../theme/theme';

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
  size?: 'small' | 'medium';
}

export const AttendanceStatusBadge: React.FC<AttendanceStatusBadgeProps> = ({
  status,
  size = 'small',
}) => {
  const getConfig = () => {
    switch (status) {
      case 'checked_out':
        return {
          label: 'Completed',
          bgColor: colors.statusCompletedBg,
          textColor: colors.statusCompleted,
          borderColor: colors.statusCompletedBorder,
          dotColor: colors.statusCompleted,
        };
      case 'checked_in':
        return {
          label: 'Checked In',
          bgColor: colors.statusOngoingBg,
          textColor: colors.statusOngoing,
          borderColor: colors.statusOngoingBorder,
          dotColor: colors.statusOngoing,
        };
      case 'not_checked_in':
      default:
        return {
          label: 'Not Checked In',
          bgColor: colors.statusNotCheckedInBg,
          textColor: colors.textSecondary,
          borderColor: colors.statusNotCheckedInBorder,
          dotColor: colors.statusNotCheckedIn,
        };
    }
  };

  const config = getConfig();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          paddingVertical: isSmall ? 3 : 5,
          paddingHorizontal: isSmall ? 8 : 12,
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          {
            backgroundColor: config.dotColor,
            width: isSmall ? 6 : 8,
            height: isSmall ? 6 : 8,
          },
        ]}
      />
      <Text
        style={[
          styles.text,
          {
            color: config.textColor,
            fontSize: isSmall ? 11 : 13,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    borderRadius: borderRadius.full,
    marginRight: 6,
  },
  text: {
    fontWeight: '600',
  },
});
