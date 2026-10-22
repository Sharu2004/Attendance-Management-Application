import {
  AttendanceRecord,
  AttendanceActionResult,
  AuthUser,
  EnrichedAttendanceRecord,
  User,
  DashboardStats,
} from '../types';
import {
  getTodayISODate,
  getCurrentISOTimestamp,
} from '../utils/dateUtils';
import {
  getAttendanceRecords,
  saveAttendanceRecords,
} from './storageService';
import { DUMMY_USERS } from '../data/dummyUsers';

/**
 * Concurrency guard against rapid repeated taps causing race conditions.
 */
const pendingOperations = new Set<string>();

/**
 * Enriches a raw AttendanceRecord with user data for UI presentation.
 */
export const enrichAttendanceRecord = (
  record: AttendanceRecord,
  users: User[] = DUMMY_USERS
): EnrichedAttendanceRecord => {
  const user = users.find((u) => u.id === record.userId);
  return {
    ...record,
    userName: user?.name || 'Unknown Employee',
    userRole: user?.role || 'staff',
    userDepartment: user?.department || 'General',
    userEmail: user?.email || '',
  };
};

/**
 * Enriches a list of attendance records and sorts them latest-first.
 */
export const enrichAndSortAttendanceRecords = (
  records: AttendanceRecord[],
  users: User[] = DUMMY_USERS
): EnrichedAttendanceRecord[] => {
  return records
    .map((r) => enrichAttendanceRecord(r, users))
    .sort((a, b) => {
      // Sort primarily by date descending
      if (b.date !== a.date) {
        return b.date.localeCompare(a.date);
      }
      // If same date, sort by checkInTime descending
      const timeA = a.checkInTime || '';
      const timeB = b.checkInTime || '';
      return timeB.localeCompare(timeA);
    });
};

/**
 * Perform Check-In for the authenticated user.
 */
export const performCheckIn = async (
  currentUser: AuthUser,
  providedRecords?: AttendanceRecord[]
): Promise<AttendanceActionResult> => {
  if (!currentUser || !currentUser.id) {
    return { success: false, message: 'Invalid or missing user session.' };
  }

  // Prevent rapid repeated concurrent submissions
  const operationKey = `checkin_${currentUser.id}`;
  if (pendingOperations.has(operationKey)) {
    return {
      success: false,
      message: 'A check-in operation is already in progress. Please wait.',
    };
  }

  pendingOperations.add(operationKey);

  try {
    const today = getTodayISODate();
    const currentTimestamp = getCurrentISOTimestamp();

    // Fetch latest records from storage or use provided snapshot
    const records = providedRecords ?? (await getAttendanceRecords());

    // Check if user exists in known users list
    const userExists = DUMMY_USERS.some((u) => u.id === currentUser.id);
    if (!userExists) {
      return {
        success: false,
        message: 'Attendance record must reference an existing user.',
      };
    }

    // Check whether a record already exists for this user and today's date
    const existingIndex = records.findIndex(
      (r) => r.userId === currentUser.id && r.date === today
    );

    if (existingIndex !== -1) {
      const existing = records[existingIndex];
      if (existing.status === 'checked_in') {
        return {
          success: false,
          message: 'You have already checked in for today.',
          record: existing,
        };
      }
      if (existing.status === 'checked_out') {
        return {
          success: false,
          message: 'You have already completed your attendance for today.',
          record: existing,
        };
      }
    }

    // Create new attendance record
    const newRecord: AttendanceRecord = {
      id: `ATT_${today}_${currentUser.id}_${Date.now()}`,
      userId: currentUser.id,
      date: today,
      checkInTime: currentTimestamp,
      checkOutTime: null,
      status: 'checked_in',
    };

    const updatedRecords = [...records, newRecord];

    // Persist to local storage before reporting success
    await saveAttendanceRecords(updatedRecords);

    return {
      success: true,
      message: 'Check-in recorded successfully!',
      record: newRecord,
    };
  } catch (error) {
    console.error('Error in performCheckIn:', error);
    return {
      success: false,
      message: 'Storage failure: Could not record check-in.',
    };
  } finally {
    pendingOperations.delete(operationKey);
  }
};

/**
 * Perform Check-Out for the authenticated user.
 */
export const performCheckOut = async (
  currentUser: AuthUser,
  providedRecords?: AttendanceRecord[]
): Promise<AttendanceActionResult> => {
  if (!currentUser || !currentUser.id) {
    return { success: false, message: 'Invalid or missing user session.' };
  }

  const operationKey = `checkout_${currentUser.id}`;
  if (pendingOperations.has(operationKey)) {
    return {
      success: false,
      message: 'A check-out operation is already in progress. Please wait.',
    };
  }

  pendingOperations.add(operationKey);

  try {
    const today = getTodayISODate();
    const currentTimestamp = getCurrentISOTimestamp();

    const records = providedRecords ?? (await getAttendanceRecords());

    // Find the user's record for today
    const recordIndex = records.findIndex(
      (r) => r.userId === currentUser.id && r.date === today
    );

    if (recordIndex === -1) {
      return {
        success: false,
        message: 'No check-in record found for today. You must check in first.',
      };
    }

    const currentRecord = records[recordIndex];

    // Reject checkout if check-in has not occurred
    if (!currentRecord.checkInTime || currentRecord.status === 'not_checked_in') {
      return {
        success: false,
        message: 'Check-in has not occurred for today.',
      };
    }

    // Reject duplicate checkout
    if (currentRecord.status === 'checked_out' || currentRecord.checkOutTime) {
      return {
        success: false,
        message: 'You have already checked out for today.',
        record: currentRecord,
      };
    }

    // Validate that checkout timestamp is not earlier than checkInTime
    const checkInDate = new Date(currentRecord.checkInTime);
    const checkOutDate = new Date(currentTimestamp);

    if (checkOutDate.getTime() < checkInDate.getTime()) {
      return {
        success: false,
        message: 'Checkout timestamp cannot be earlier than check-in time.',
      };
    }

    // Update record
    const updatedRecord: AttendanceRecord = {
      ...currentRecord,
      checkOutTime: currentTimestamp,
      status: 'checked_out',
    };

    const updatedRecords = [...records];
    updatedRecords[recordIndex] = updatedRecord;

    // Persist to local storage before reporting success
    await saveAttendanceRecords(updatedRecords);

    return {
      success: true,
      message: 'Check-out completed successfully! Have a great evening.',
      record: updatedRecord,
    };
  } catch (error) {
    console.error('Error in performCheckOut:', error);
    return {
      success: false,
      message: 'Storage failure: Could not record check-out.',
    };
  } finally {
    pendingOperations.delete(operationKey);
  }
};

/**
 * Calculates Admin Dashboard Statistics.
 * Counts each user once:
 * - A user with checkInTime (checked_in or checked_out) counts as checked in today.
 * - Any user without a checkInTime for today counts as not checked in.
 */
export const calculateAdminDashboardStats = (
  users: User[],
  records: AttendanceRecord[],
  targetDate: string = getTodayISODate()
): DashboardStats => {
  const totalEmployees = users.length;
  const staffUsers = users.filter((u) => u.role === 'staff');
  const seniorUsers = users.filter((u) => u.role === 'senior_staff');

  // Find all userIds who have checked in today (status checked_in OR checked_out)
  const checkedInUserIds = new Set(
    records
      .filter((r) => r.date === targetDate && (r.status === 'checked_in' || r.status === 'checked_out'))
      .map((r) => r.userId)
  );

  const checkedInCount = users.filter((u) => checkedInUserIds.has(u.id)).length;
  const notCheckedInCount = totalEmployees - checkedInCount;

  return {
    totalEmployees,
    totalStaff: staffUsers.length,
    totalSeniorStaff: seniorUsers.length,
    checkedInToday: checkedInCount,
    notCheckedInToday: notCheckedInCount,
  };
};

/**
 * Calculates Senior Staff Dashboard Statistics.
 * STRICTLY restricted to Staff members only. Never includes Admin or Senior Staff.
 */
export const calculateSeniorDashboardStats = (
  users: User[],
  records: AttendanceRecord[],
  targetDate: string = getTodayISODate()
): {
  totalStaff: number;
  checkedInStaffToday: number;
  notCheckedInStaffToday: number;
} => {
  const staffUsers = users.filter((u) => u.role === 'staff');
  const staffIds = new Set(staffUsers.map((u) => u.id));

  // Find staff who checked in today
  const checkedInStaffIds = new Set(
    records
      .filter(
        (r) =>
          r.date === targetDate &&
          staffIds.has(r.userId) &&
          (r.status === 'checked_in' || r.status === 'checked_out')
      )
      .map((r) => r.userId)
  );

  const checkedInStaffCount = staffUsers.filter((u) => checkedInStaffIds.has(u.id)).length;
  const notCheckedInStaffCount = staffUsers.length - checkedInStaffCount;

  return {
    totalStaff: staffUsers.length,
    checkedInStaffToday: checkedInStaffCount,
    notCheckedInStaffToday: notCheckedInStaffCount,
  };
};
