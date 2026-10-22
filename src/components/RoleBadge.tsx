import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserRole } from '../types';
import { colors, borderRadius } from '../theme/theme';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'small' | 'medium';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'small' }) => {
  const getBadgeConfig = () => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin',
          bgColor: colors.roleAdminBg,
          textColor: colors.roleAdmin,
          borderColor: '#DDD6FE',
        };
      case 'senior_staff':
        return {
          label: 'Senior Staff',
          bgColor: colors.roleSeniorBg,
          textColor: colors.roleSenior,
          borderColor: '#BAE6FD',
        };
      case 'staff':
      default:
        return {
          label: 'Staff',
          bgColor: colors.roleStaffBg,
          textColor: colors.roleStaff,
          borderColor: '#99F6E4',
        };
    }
  };

  const config = getBadgeConfig();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          paddingVertical: isSmall ? 2 : 4,
          paddingHorizontal: isSmall ? 8 : 12,
        },
      ]}
    >
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
  badge: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
});
