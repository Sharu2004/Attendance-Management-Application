import { UserRole, AuthUser, User, EnrichedAttendanceRecord } from '../types';

/**
 * ARCHITECTURAL NOTICE:
 * Client-side permission checks in this mobile application govern view rendering,
 * component visibility, and local data filtering.
 * In production multi-tenant or enterprise architectures, authorization MUST be
 * strictly enforced on the server-side via authenticated API gateways and token scopes.
 */

export const Permissions = {
  // Navigation / Screen Access
  canAccessAdminDashboard: (role: UserRole): boolean => role === 'admin',
  canAccessSeniorDashboard: (role: UserRole): boolean => role === 'senior_staff',
  canAccessStaffDashboard: (role: UserRole): boolean => role === 'staff',

  canAccessUserManagement: (role: UserRole): boolean => role === 'admin',
  canAccessTeamAttendance: (role: UserRole): boolean => role === 'admin' || role === 'senior_staff',

  // Personal actions available to all authenticated employees
  canPerformPersonalAttendance: (role: UserRole): boolean =>
    role === 'admin' || role === 'senior_staff' || role === 'staff',

  canViewOwnAttendanceHistory: (role: UserRole): boolean =>
    role === 'admin' || role === 'senior_staff' || role === 'staff',

  /**
   * Determines if the current user can view another specific employee's attendance history.
   * - Admin can view ANY user's history.
   * - Senior Staff can view STAFF members' history, or their own.
   * - Staff can ONLY view their own history.
   */
  canViewUserHistory: (
    currentUser: AuthUser,
    targetUserRole: UserRole,
    targetUserId: string
  ): boolean => {
    if (currentUser.id === targetUserId) {
      return true; // Users can always view their own history
    }
    if (currentUser.role === 'admin') {
      return true; // Admin has universal access
    }
    if (currentUser.role === 'senior_staff') {
      // Senior Staff can only view Staff, never Admin or other Senior Staff
      return targetUserRole === 'staff';
    }
    return false; // Staff can never view others
  },

  /**
   * Core data selector / filter applying role-based authorization to attendance records.
   * - Admin: Returns records for all roles.
   * - Senior Staff: STUBBORNLY RESTRICTED to Staff records only. Admins and other Senior Staff are stripped out.
   * - Staff: Restricted to the authenticated user's own records only.
   */
  filterVisibleAttendanceRecords: (
    records: EnrichedAttendanceRecord[],
    currentUser: AuthUser
  ): EnrichedAttendanceRecord[] => {
    if (currentUser.role === 'admin') {
      return records;
    }

    if (currentUser.role === 'senior_staff') {
      // Return records where the employee is a Staff member
      return records.filter((r) => r.userRole === 'staff');
    }

    if (currentUser.role === 'staff') {
      // Return records strictly belonging to this staff member
      return records.filter((r) => r.userId === currentUser.id);
    }

    return [];
  },

  /**
   * Filter visible employees in user listings.
   * Only Admin can see user management; Senior staff only sees Staff for team views.
   */
  filterVisibleEmployees: (
    users: User[],
    currentUser: AuthUser
  ): User[] => {
    if (currentUser.role === 'admin') {
      return users;
    }
    if (currentUser.role === 'senior_staff') {
      return users.filter((u) => u.role === 'staff');
    }
    return users.filter((u) => u.id === currentUser.id);
  },
};
