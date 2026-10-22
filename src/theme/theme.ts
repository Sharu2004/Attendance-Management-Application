// Theme constants for consistent UI styling across the application

export const colors = {
  // Primary brand palette - Deep navy and dark blue
  primary: '#0F2744',
  primaryDark: '#0A1A2F',
  primaryLight: '#1B3B65',
  
  // Secondary & Accents - Modern teal and blue
  accent: '#0284C7',
  accentTeal: '#0D9488',
  accentLight: '#E0F2FE',
  
  // Surfaces and backgrounds
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceVariant: '#F1F5F9',
  surfaceBorder: '#E2E8F0',
  surfaceBorderDark: '#CBD5E1',
  
  // Text colors
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
  
  // Status colors specified in requirements
  statusCompleted: '#10B981',       // Green for completed attendance
  statusCompletedBg: '#ECFDF5',
  statusCompletedBorder: '#A7F3D0',
  
  statusOngoing: '#F59E0B',         // Amber for ongoing attendance session
  statusOngoingBg: '#FFFBEB',
  statusOngoingBorder: '#FDE68A',
  
  statusNotCheckedIn: '#94A3B8',    // Slate/Grey for not checked in
  statusNotCheckedInBg: '#F1F5F9',
  statusNotCheckedInBorder: '#CBD5E1',
  
  // Error and destructive
  error: '#EF4444',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
  
  // Role badges
  roleAdmin: '#7C3AED',
  roleAdminBg: '#F5F3FF',
  roleSenior: '#0284C7',
  roleSeniorBg: '#F0F9FF',
  roleStaff: '#0D9488',
  roleStaffBg: '#F0FDFA',
  
  // Neutral overlays
  overlay: 'rgba(15, 23, 42, 0.5)',
  shadow: '#0F172A',
};

export const typography = {
  h1: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32, letterSpacing: -0.3 },
  h2: { fontSize: 20, fontWeight: '700' as const, lineHeight: 28, letterSpacing: -0.2 },
  h3: { fontSize: 17, fontWeight: '600' as const, lineHeight: 24 },
  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  caption: { fontSize: 11, fontWeight: '500' as const, lineHeight: 14 },
  button: { fontSize: 15, fontWeight: '600' as const, letterSpacing: 0.2 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
};

export const shadows = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  modal: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  button: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
};
