// Core Data Models and TypeScript Type Definitions

export type UserRole = 'admin' | 'senior_staff' | 'staff';

export type AttendanceStatus = 'not_checked_in' | 'checked_in' | 'checked_out';

/**
 * Predefined User Entity (stored in users database / constants).
 * Contains credentials for authentication validation.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
  phone?: string;
}

/**
 * Active Authenticated User Session.
 * Explicitly excludes password for security.
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

/**
 * Attendance Record Entity.
 * Associated with users via stable userId foreign keys.
 * Calendar date is in ISO YYYY-MM-DD format.
 * Check-in and Check-out are ISO-8601 timestamps.
 */
export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  checkInTime: string | null; // ISO 8601 string
  checkOutTime: string | null; // ISO 8601 string
  status: AttendanceStatus;
}

/**
 * Enriched attendance record including user details for display.
 */
export interface EnrichedAttendanceRecord extends AttendanceRecord {
  userName: string;
  userRole: UserRole;
  userDepartment?: string;
  userEmail: string;
}

/**
 * Attendance action results returned by the attendance service.
 */
export interface AttendanceActionResult {
  success: boolean;
  message: string;
  record?: AttendanceRecord;
}

/**
 * Daily statistics for dashboards.
 */
export interface DashboardStats {
  totalEmployees: number;
  totalStaff: number;
  totalSeniorStaff: number;
  checkedInToday: number;
  notCheckedInToday: number;
}

/**
 * Filter options for attendance screens.
 */
export interface AttendanceFilterOptions {
  searchQuery?: string;
  datePreset?: 'all' | 'today' | 'yesterday' | 'week' | 'custom';
  customDate?: string; // YYYY-MM-DD
  role?: UserRole | 'all';
}

/**
 * Navigation Param Lists
 */
export type RootStackParamList = {
  Login: undefined;
  AdminDashboard: undefined;
  SeniorDashboard: undefined;
  StaffDashboard: undefined;
  TeamAttendance: { roleRestricted?: boolean; filterUserId?: string };
  UserManagement: undefined;
  PersonalHistory: { targetUserId?: string; targetUserName?: string };
  Profile: undefined;
};
