import {
  performCheckIn,
  performCheckOut,
  calculateAdminDashboardStats,
  calculateSeniorDashboardStats,
} from '../../src/services/attendanceService';
import { getAttendanceRecords } from '../../src/services/storageService';
import {
  setMockDate,
  resetMockDate,
  createISOTimestamp,
} from '../../src/utils/dateUtils';
import { AuthUser, AttendanceRecord } from '../../src/types';
import { DUMMY_USERS } from '../../src/data/dummyUsers';

describe('Attendance Service Business Rules', () => {
  const adminUser: AuthUser = {
    id: 'USR001',
    name: 'Ram Kumar',
    email: 'admin@test.com',
    role: 'admin',
  };

  const staffUser1: AuthUser = {
    id: 'USR003',
    name: 'Arjun Kumar',
    email: 'staff@test.com',
    role: 'staff',
  };

  const staffUser2: AuthUser = {
    id: 'USR005',
    name: 'Karthik Raj',
    email: 'karthik@test.com',
    role: 'staff',
  };

  beforeEach(() => {
    resetMockDate();
  });

  afterEach(() => {
    resetMockDate();
  });

  test('Check-in creation generates a valid record with timestamp and checked_in status', async () => {
    setMockDate('2026-10-22T09:00:00Z');

    const result = await performCheckIn(staffUser1, []);
    expect(result.success).toBe(true);
    expect(result.record).toBeDefined();
    expect(result.record?.userId).toBe(staffUser1.id);
    expect(result.record?.date).toBe('2026-10-22');
    expect(result.record?.status).toBe('checked_in');
    expect(result.record?.checkInTime).toBe('2026-10-22T09:00:00.000Z');
    expect(result.record?.checkOutTime).toBeNull();
  });

  test('Duplicate check-in prevention: rejects check-in if user already checked in today', async () => {
    setMockDate('2026-10-22T09:00:00Z');

    const firstResult = await performCheckIn(staffUser1, []);
    expect(firstResult.success).toBe(true);

    // Attempt second check-in on same day
    const records = await getAttendanceRecords();
    const secondResult = await performCheckIn(staffUser1, records);
    expect(secondResult.success).toBe(false);
    expect(secondResult.message).toContain('already checked in');
  });

  test('Successful checkout updates checkOutTime and status to checked_out', async () => {
    setMockDate('2026-10-22T09:00:00Z');
    await performCheckIn(staffUser1, []);

    // Fast-forward to 17:30
    setMockDate('2026-10-22T17:30:00Z');
    const records = await getAttendanceRecords();
    const checkoutResult = await performCheckOut(staffUser1, records);

    expect(checkoutResult.success).toBe(true);
    expect(checkoutResult.record?.status).toBe('checked_out');
    expect(checkoutResult.record?.checkOutTime).toBe('2026-10-22T17:30:00.000Z');
    expect(checkoutResult.record?.checkInTime).toBe('2026-10-22T09:00:00.000Z');
  });

  test('Checkout before check-in prevention: rejects checkout if record does not exist', async () => {
    setMockDate('2026-10-22T12:00:00Z');

    const checkoutResult = await performCheckOut(staffUser1, []);
    expect(checkoutResult.success).toBe(false);
    expect(checkoutResult.message).toContain('No check-in record found');
  });

  test('Duplicate checkout prevention: rejects subsequent checkout attempts', async () => {
    setMockDate('2026-10-22T09:00:00Z');
    await performCheckIn(staffUser1, []);

    setMockDate('2026-10-22T17:00:00Z');
    let records = await getAttendanceRecords();
    const firstCheckout = await performCheckOut(staffUser1, records);
    expect(firstCheckout.success).toBe(true);

    // Attempt duplicate checkout
    setMockDate('2026-10-22T17:05:00Z');
    records = await getAttendanceRecords();
    const duplicateCheckout = await performCheckOut(staffUser1, records);
    expect(duplicateCheckout.success).toBe(false);
    expect(duplicateCheckout.message).toContain('already checked out');
  });

  test('Checkout-before-check-in timestamp rejection: rejects if checkout timestamp is earlier than check-in', async () => {
    setMockDate('2026-10-22T10:00:00Z');
    await performCheckIn(staffUser1, []);

    // Travel backwards in time to 08:00
    setMockDate('2026-10-22T08:00:00Z');
    const records = await getAttendanceRecords();
    const result = await performCheckOut(staffUser1, records);

    expect(result.success).toBe(false);
    expect(result.message).toContain('cannot be earlier than check-in');
  });

  test('One-record-per-user-per-day enforcement', async () => {
    setMockDate('2026-10-22T09:00:00Z');
    await performCheckIn(staffUser1, []);

    setMockDate('2026-10-22T17:00:00Z');
    let records = await getAttendanceRecords();
    await performCheckOut(staffUser1, records);

    // After checkout is complete, user cannot check in again on the same day
    records = await getAttendanceRecords();
    const reCheckIn = await performCheckIn(staffUser1, records);
    expect(reCheckIn.success).toBe(false);
    expect(reCheckIn.message).toContain('already completed');

    // Only 1 record exists for staffUser1 on 2026-10-22
    const finalRecords = await getAttendanceRecords();
    const userRecordsToday = finalRecords.filter(
      (r) => r.userId === staffUser1.id && r.date === '2026-10-22'
    );
    expect(userRecordsToday.length).toBe(1);
  });

  test('Independent attendance for different users', async () => {
    setMockDate('2026-10-22T09:00:00Z');

    // User 1 checks in
    const res1 = await performCheckIn(staffUser1, []);
    expect(res1.success).toBe(true);

    // User 2 checks in independently
    let records = await getAttendanceRecords();
    const res2 = await performCheckIn(staffUser2, records);
    expect(res2.success).toBe(true);

    // User 1 checks out; User 2 remains checked in
    setMockDate('2026-10-22T17:00:00Z');
    records = await getAttendanceRecords();
    const res1Out = await performCheckOut(staffUser1, records);
    expect(res1Out.success).toBe(true);

    records = await getAttendanceRecords();
    const user2Record = records.find((r) => r.userId === staffUser2.id);
    expect(user2Record?.status).toBe('checked_in');
    expect(user2Record?.checkOutTime).toBeNull();
  });

  test('Attendance persistence: data is saved and restored accurately via AsyncStorage', async () => {
    setMockDate('2026-10-22T09:15:00Z');
    await performCheckIn(adminUser, []);

    const loaded = await getAttendanceRecords();
    expect(loaded.length).toBe(1);
    expect(loaded[0].userId).toBe(adminUser.id);
    expect(loaded[0].status).toBe('checked_in');
  });

  test('Admin dashboard statistics calculation', () => {
    const today = '2026-10-22';
    const mockRecords: AttendanceRecord[] = [
      {
        id: '1',
        userId: 'USR001',
        date: today,
        checkInTime: createISOTimestamp(today, 9, 0),
        checkOutTime: createISOTimestamp(today, 17, 0),
        status: 'checked_out',
      },
      {
        id: '2',
        userId: 'USR003',
        date: today,
        checkInTime: createISOTimestamp(today, 9, 30),
        checkOutTime: null,
        status: 'checked_in',
      },
    ];

    const stats = calculateAdminDashboardStats(DUMMY_USERS, mockRecords, today);
    expect(stats.totalEmployees).toBe(DUMMY_USERS.length);
    expect(stats.checkedInToday).toBe(2);
    expect(stats.notCheckedInToday).toBe(DUMMY_USERS.length - 2);
  });

  test('Senior staff dashboard statistics strictly counts staff only', () => {
    const today = '2026-10-22';
    const mockRecords: AttendanceRecord[] = [
      {
        id: '1',
        userId: 'USR001', // Admin
        date: today,
        checkInTime: createISOTimestamp(today, 9, 0),
        checkOutTime: null,
        status: 'checked_in',
      },
      {
        id: '2',
        userId: 'USR003', // Staff
        date: today,
        checkInTime: createISOTimestamp(today, 9, 15),
        checkOutTime: null,
        status: 'checked_in',
      },
    ];

    const stats = calculateSeniorDashboardStats(DUMMY_USERS, mockRecords, today);
    const staffCount = DUMMY_USERS.filter((u) => u.role === 'staff').length;

    expect(stats.totalStaff).toBe(staffCount);
    expect(stats.checkedInStaffToday).toBe(1); // Only USR003, USR001 is excluded!
    expect(stats.notCheckedInStaffToday).toBe(staffCount - 1);
  });
});
