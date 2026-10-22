import { AttendanceRecord } from '../types';
import { getRelativeDateISO, createISOTimestamp } from '../utils/dateUtils';

/**
 * Generates initial dynamic seed attendance records.
 * Uses relative dates so that the dashboard always displays active
 * records for "Today", "Yesterday", and recent historical dates regardless
 * of when the application is launched.
 *
 * Notice:
 * - Arjun Kumar (Staff demo account USR003) is intentionally NOT checked in today,
 *   enabling immediate demonstration and testing of the Check-In and Check-Out flow.
 * - Other employees have varied states: completed, checked_in, and not_checked_in.
 */
export const generateSeedAttendanceRecords = (): AttendanceRecord[] => {
  const today = getRelativeDateISO(0);
  const yesterday = getRelativeDateISO(-1);
  const twoDaysAgo = getRelativeDateISO(-2);
  const threeDaysAgo = getRelativeDateISO(-3);

  const records: AttendanceRecord[] = [
    // --- TODAY'S RECORDS (Relative day 0) ---
    // USR001 (Ram Kumar - Admin): Completed
    {
      id: `ATT_${today}_USR001`,
      userId: 'USR001',
      date: today,
      checkInTime: createISOTimestamp(today, 9, 0),
      checkOutTime: createISOTimestamp(today, 17, 45),
      status: 'checked_out',
    },
    // USR002 (Nivin Pauly - Senior Staff): Currently checked in
    {
      id: `ATT_${today}_USR002`,
      userId: 'USR002',
      date: today,
      checkInTime: createISOTimestamp(today, 9, 15),
      checkOutTime: null,
      status: 'checked_in',
    },
    // USR004 (Priya Lakshmi - Senior Staff): Completed
    {
      id: `ATT_${today}_USR004`,
      userId: 'USR004',
      date: today,
      checkInTime: createISOTimestamp(today, 8, 45),
      checkOutTime: createISOTimestamp(today, 17, 30),
      status: 'checked_out',
    },
    // Note: USR003 (Arjun Kumar - Staff Demo) is NOT added for today so he starts as 'not_checked_in'
    
    // USR005 (Karthik Raj - Staff): Currently checked in
    {
      id: `ATT_${today}_USR005`,
      userId: 'USR005',
      date: today,
      checkInTime: createISOTimestamp(today, 9, 25),
      checkOutTime: null,
      status: 'checked_in',
    },
    // USR006 (Divya Shree - Staff): Completed
    {
      id: `ATT_${today}_USR006`,
      userId: 'USR006',
      date: today,
      checkInTime: createISOTimestamp(today, 9, 5),
      checkOutTime: createISOTimestamp(today, 18, 0),
      status: 'checked_out',
    },
    // USR007 (Vijay Kumar - Staff): Currently checked in
    {
      id: `ATT_${today}_USR007`,
      userId: 'USR007',
      date: today,
      checkInTime: createISOTimestamp(today, 9, 50),
      checkOutTime: null,
      status: 'checked_in',
    },
    // USR008 (Meena Devi - Staff): Completed
    {
      id: `ATT_${today}_USR008`,
      userId: 'USR008',
      date: today,
      checkInTime: createISOTimestamp(today, 8, 55),
      checkOutTime: createISOTimestamp(today, 17, 10),
      status: 'checked_out',
    },
    // USR010 (Anitha Rani - Staff): Completed
    {
      id: `ATT_${today}_USR010`,
      userId: 'USR010',
      date: today,
      checkInTime: createISOTimestamp(today, 9, 10),
      checkOutTime: createISOTimestamp(today, 18, 5),
      status: 'checked_out',
    },
    // USR012 (Kavitha M - Staff): Currently checked in
    {
      id: `ATT_${today}_USR012`,
      userId: 'USR012',
      date: today,
      checkInTime: createISOTimestamp(today, 9, 40),
      checkOutTime: null,
      status: 'checked_in',
    },

    // --- YESTERDAY'S RECORDS (Relative day -1) ---
    {
      id: `ATT_${yesterday}_USR001`,
      userId: 'USR001',
      date: yesterday,
      checkInTime: createISOTimestamp(yesterday, 8, 55),
      checkOutTime: createISOTimestamp(yesterday, 18, 10),
      status: 'checked_out',
    },
    {
      id: `ATT_${yesterday}_USR002`,
      userId: 'USR002',
      date: yesterday,
      checkInTime: createISOTimestamp(yesterday, 9, 10),
      checkOutTime: createISOTimestamp(yesterday, 17, 50),
      status: 'checked_out',
    },
    {
      id: `ATT_${yesterday}_USR003`,
      userId: 'USR003',
      date: yesterday,
      checkInTime: createISOTimestamp(yesterday, 9, 0),
      checkOutTime: createISOTimestamp(yesterday, 17, 30),
      status: 'checked_out',
    },
    {
      id: `ATT_${yesterday}_USR004`,
      userId: 'USR004',
      date: yesterday,
      checkInTime: createISOTimestamp(yesterday, 8, 40),
      checkOutTime: createISOTimestamp(yesterday, 17, 15),
      status: 'checked_out',
    },
    {
      id: `ATT_${yesterday}_USR005`,
      userId: 'USR005',
      date: yesterday,
      checkInTime: createISOTimestamp(yesterday, 9, 30),
      checkOutTime: createISOTimestamp(yesterday, 18, 0),
      status: 'checked_out',
    },
    {
      id: `ATT_${yesterday}_USR006`,
      userId: 'USR006',
      date: yesterday,
      checkInTime: createISOTimestamp(yesterday, 9, 15),
      checkOutTime: createISOTimestamp(yesterday, 17, 45),
      status: 'checked_out',
    },
    {
      id: `ATT_${yesterday}_USR007`,
      userId: 'USR007',
      date: yesterday,
      checkInTime: createISOTimestamp(yesterday, 9, 45),
      checkOutTime: createISOTimestamp(yesterday, 18, 15),
      status: 'checked_out',
    },
    {
      id: `ATT_${yesterday}_USR008`,
      userId: 'USR008',
      date: yesterday,
      checkInTime: createISOTimestamp(yesterday, 8, 50),
      checkOutTime: createISOTimestamp(yesterday, 17, 0),
      status: 'checked_out',
    },
    {
      id: `ATT_${yesterday}_USR009`,
      userId: 'USR009',
      date: yesterday,
      checkInTime: createISOTimestamp(yesterday, 9, 5),
      checkOutTime: createISOTimestamp(yesterday, 17, 35),
      status: 'checked_out',
    },
    {
      id: `ATT_${yesterday}_USR010`,
      userId: 'USR010',
      date: yesterday,
      checkInTime: createISOTimestamp(yesterday, 9, 20),
      checkOutTime: createISOTimestamp(yesterday, 18, 10),
      status: 'checked_out',
    },
    {
      id: `ATT_${yesterday}_USR011`,
      userId: 'USR011',
      date: yesterday,
      checkInTime: createISOTimestamp(yesterday, 9, 35),
      checkOutTime: createISOTimestamp(yesterday, 17, 55),
      status: 'checked_out',
    },
    {
      id: `ATT_${yesterday}_USR012`,
      userId: 'USR012',
      date: yesterday,
      checkInTime: createISOTimestamp(yesterday, 9, 25),
      checkOutTime: createISOTimestamp(yesterday, 17, 40),
      status: 'checked_out',
    },

    // --- TWO DAYS AGO (Relative day -2) ---
    {
      id: `ATT_${twoDaysAgo}_USR001`,
      userId: 'USR001',
      date: twoDaysAgo,
      checkInTime: createISOTimestamp(twoDaysAgo, 9, 5),
      checkOutTime: createISOTimestamp(twoDaysAgo, 18, 0),
      status: 'checked_out',
    },
    {
      id: `ATT_${twoDaysAgo}_USR002`,
      userId: 'USR002',
      date: twoDaysAgo,
      checkInTime: createISOTimestamp(twoDaysAgo, 9, 20),
      checkOutTime: createISOTimestamp(twoDaysAgo, 17, 40),
      status: 'checked_out',
    },
    {
      id: `ATT_${twoDaysAgo}_USR003`,
      userId: 'USR003',
      date: twoDaysAgo,
      checkInTime: createISOTimestamp(twoDaysAgo, 9, 10),
      checkOutTime: createISOTimestamp(twoDaysAgo, 17, 20),
      status: 'checked_out',
    },
    {
      id: `ATT_${twoDaysAgo}_USR005`,
      userId: 'USR005',
      date: twoDaysAgo,
      checkInTime: createISOTimestamp(twoDaysAgo, 9, 30),
      checkOutTime: createISOTimestamp(twoDaysAgo, 18, 5),
      status: 'checked_out',
    },

    // --- THREE DAYS AGO (Relative day -3) ---
    {
      id: `ATT_${threeDaysAgo}_USR003`,
      userId: 'USR003',
      date: threeDaysAgo,
      checkInTime: createISOTimestamp(threeDaysAgo, 8, 50),
      checkOutTime: createISOTimestamp(threeDaysAgo, 17, 15),
      status: 'checked_out',
    },
    {
      id: `ATT_${threeDaysAgo}_USR006`,
      userId: 'USR006',
      date: threeDaysAgo,
      checkInTime: createISOTimestamp(threeDaysAgo, 9, 0),
      checkOutTime: createISOTimestamp(threeDaysAgo, 17, 30),
      status: 'checked_out',
    },
  ];

  return records;
};
