import { Permissions } from '../../src/utils/permissions';
import { AuthUser, EnrichedAttendanceRecord } from '../../src/types';
import { DUMMY_USERS } from '../../src/data/dummyUsers';

describe('Role-Based Permissions & Authorization Logic', () => {
  const adminUser: AuthUser = {
    id: 'USR001',
    name: 'Ram Kumar',
    email: 'admin@test.com',
    role: 'admin',
  };

  const seniorUser1: AuthUser = {
    id: 'USR002',
    name: 'Nivin Pauly',
    email: 'senior@test.com',
    role: 'senior_staff',
  };

  const staffUser: AuthUser = {
    id: 'USR003',
    name: 'Arjun Kumar',
    email: 'staff@test.com',
    role: 'staff',
  };

  const sampleRecords: EnrichedAttendanceRecord[] = [
    {
      id: 'REC_ADMIN',
      userId: 'USR001',
      date: '2026-10-22',
      checkInTime: '2026-10-22T09:00:00Z',
      checkOutTime: '2026-10-22T17:00:00Z',
      status: 'checked_out',
      userName: 'Ram Kumar',
      userRole: 'admin',
      userEmail: 'admin@test.com',
    },
    {
      id: 'REC_SENIOR_1',
      userId: 'USR002',
      date: '2026-10-22',
      checkInTime: '2026-10-22T09:15:00Z',
      checkOutTime: null,
      status: 'checked_in',
      userName: 'Nivin Pauly',
      userRole: 'senior_staff',
      userEmail: 'senior@test.com',
    },
    {
      id: 'REC_SENIOR_2',
      userId: 'USR004',
      date: '2026-10-22',
      checkInTime: '2026-10-22T08:45:00Z',
      checkOutTime: '2026-10-22T17:30:00Z',
      status: 'checked_out',
      userName: 'Priya Lakshmi',
      userRole: 'senior_staff',
      userEmail: 'priya@test.com',
    },
    {
      id: 'REC_STAFF_1',
      userId: 'USR003',
      date: '2026-10-22',
      checkInTime: '2026-10-22T09:00:00Z',
      checkOutTime: null,
      status: 'checked_in',
      userName: 'Arjun Kumar',
      userRole: 'staff',
      userEmail: 'staff@test.com',
    },
    {
      id: 'REC_STAFF_2',
      userId: 'USR005',
      date: '2026-10-22',
      checkInTime: '2026-10-22T09:30:00Z',
      checkOutTime: '2026-10-22T18:00:00Z',
      status: 'checked_out',
      userName: 'Karthik Raj',
      userRole: 'staff',
      userEmail: 'karthik@test.com',
    },
  ];

  test('Admin access to all attendance records', () => {
    const visible = Permissions.filterVisibleAttendanceRecords(sampleRecords, adminUser);
    expect(visible.length).toBe(sampleRecords.length);
  });

  test('Senior Staff access to Staff attendance ONLY (Admin and other Senior Staff stripped out)', () => {
    const visible = Permissions.filterVisibleAttendanceRecords(sampleRecords, seniorUser1);

    // All returned records MUST have userRole === 'staff'
    expect(visible.length).toBe(2);
    expect(visible.every((r) => r.userRole === 'staff')).toBe(true);

    // Verified: Admin and other Senior Staff are NOT in visible records
    expect(visible.some((r) => r.userRole === 'admin')).toBe(false);
    expect(visible.some((r) => r.userRole === 'senior_staff')).toBe(false);
  });

  test('Staff access to personal records ONLY', () => {
    const visible = Permissions.filterVisibleAttendanceRecords(sampleRecords, staffUser);

    expect(visible.length).toBe(1);
    expect(visible[0].userId).toBe(staffUser.id);
  });

  test('Restricted screen and navigation permissions', () => {
    // Admin dashboard access
    expect(Permissions.canAccessAdminDashboard('admin')).toBe(true);
    expect(Permissions.canAccessAdminDashboard('senior_staff')).toBe(false);
    expect(Permissions.canAccessAdminDashboard('staff')).toBe(false);

    // Senior dashboard access
    expect(Permissions.canAccessSeniorDashboard('senior_staff')).toBe(true);
    expect(Permissions.canAccessSeniorDashboard('admin')).toBe(false);
    expect(Permissions.canAccessSeniorDashboard('staff')).toBe(false);

    // Staff dashboard access
    expect(Permissions.canAccessStaffDashboard('staff')).toBe(true);
    expect(Permissions.canAccessStaffDashboard('admin')).toBe(false);
    expect(Permissions.canAccessStaffDashboard('senior_staff')).toBe(false);

    // User management access (Admin only)
    expect(Permissions.canAccessUserManagement('admin')).toBe(true);
    expect(Permissions.canAccessUserManagement('senior_staff')).toBe(false);
    expect(Permissions.canAccessUserManagement('staff')).toBe(false);

    // Team attendance access (Admin and Senior Staff only)
    expect(Permissions.canAccessTeamAttendance('admin')).toBe(true);
    expect(Permissions.canAccessTeamAttendance('senior_staff')).toBe(true);
    expect(Permissions.canAccessTeamAttendance('staff')).toBe(false);
  });

  test('canViewUserHistory cross-role rules', () => {
    // Admin can view any user
    expect(Permissions.canViewUserHistory(adminUser, 'admin', 'USR001')).toBe(true);
    expect(Permissions.canViewUserHistory(adminUser, 'senior_staff', 'USR002')).toBe(true);
    expect(Permissions.canViewUserHistory(adminUser, 'staff', 'USR003')).toBe(true);

    // Senior staff can view staff or own history
    expect(Permissions.canViewUserHistory(seniorUser1, 'staff', 'USR003')).toBe(true);
    expect(Permissions.canViewUserHistory(seniorUser1, 'senior_staff', 'USR002')).toBe(true); // Self
    expect(Permissions.canViewUserHistory(seniorUser1, 'senior_staff', 'USR004')).toBe(false); // Other senior
    expect(Permissions.canViewUserHistory(seniorUser1, 'admin', 'USR001')).toBe(false); // Admin

    // Staff can only view own history
    expect(Permissions.canViewUserHistory(staffUser, 'staff', 'USR003')).toBe(true); // Self
    expect(Permissions.canViewUserHistory(staffUser, 'staff', 'USR005')).toBe(false); // Other staff
    expect(Permissions.canViewUserHistory(staffUser, 'admin', 'USR001')).toBe(false);
  });

  test('filterVisibleEmployees filters correctly', () => {
    const adminEmployees = Permissions.filterVisibleEmployees(DUMMY_USERS, adminUser);
    expect(adminEmployees.length).toBe(DUMMY_USERS.length);

    const seniorEmployees = Permissions.filterVisibleEmployees(DUMMY_USERS, seniorUser1);
    expect(seniorEmployees.every((u) => u.role === 'staff')).toBe(true);

    const staffEmployees = Permissions.filterVisibleEmployees(DUMMY_USERS, staffUser);
    expect(staffEmployees.length).toBe(1);
    expect(staffEmployees[0].id).toBe(staffUser.id);
  });
});
