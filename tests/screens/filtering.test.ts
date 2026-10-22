import { enrichAndSortAttendanceRecords } from '../../src/services/attendanceService';
import { EnrichedAttendanceRecord, AttendanceRecord } from '../../src/types';
import { formatDisplayTime, getRelativeDateISO } from '../../src/utils/dateUtils';
import { DUMMY_USERS } from '../../src/data/dummyUsers';

describe('Search, Filtering, and History Formatting Logic', () => {
  const today = getRelativeDateISO(0);
  const yesterday = getRelativeDateISO(-1);
  const fiveDaysAgo = getRelativeDateISO(-5);
  const tenDaysAgo = getRelativeDateISO(-10);

  const sampleRawRecords: AttendanceRecord[] = [
    {
      id: 'REC_1',
      userId: 'USR001', // Ram Kumar
      date: tenDaysAgo,
      checkInTime: `${tenDaysAgo}T09:00:00Z`,
      checkOutTime: `${tenDaysAgo}T17:00:00Z`,
      status: 'checked_out',
    },
    {
      id: 'REC_2',
      userId: 'USR003', // Arjun Kumar
      date: yesterday,
      checkInTime: `${yesterday}T09:15:00Z`,
      checkOutTime: `${yesterday}T17:30:00Z`,
      status: 'checked_out',
    },
    {
      id: 'REC_3',
      userId: 'USR005', // Karthik Raj
      date: today,
      checkInTime: `${today}T10:00:00Z`,
      checkOutTime: null, // Incomplete attendance (checked in, not yet checked out)
      status: 'checked_in',
    },
    {
      id: 'REC_4',
      userId: 'USR006', // Divya Shree
      date: today,
      checkInTime: `${today}T08:30:00Z`,
      checkOutTime: `${today}T16:45:00Z`,
      status: 'checked_out',
    },
    {
      id: 'REC_5',
      userId: 'USR007', // Vijay Kumar
      date: fiveDaysAgo,
      checkInTime: `${fiveDaysAgo}T09:20:00Z`,
      checkOutTime: `${fiveDaysAgo}T17:50:00Z`,
      status: 'checked_out',
    },
  ];

  const enrichedRecords = enrichAndSortAttendanceRecords(sampleRawRecords, DUMMY_USERS);

  test('Latest-first history sorting: orders records by date descending and time descending', () => {
    // Top records should be from today
    expect(enrichedRecords[0].date).toBe(today);
    expect(enrichedRecords[1].date).toBe(today);
    // REC_3 has checkInTime 10:00, REC_4 has 08:30 -> REC_3 must come before REC_4
    expect(enrichedRecords[0].id).toBe('REC_3');
    expect(enrichedRecords[1].id).toBe('REC_4');

    // Bottom record must be from tenDaysAgo
    expect(enrichedRecords[enrichedRecords.length - 1].date).toBe(tenDaysAgo);
  });

  test('Employee-name search: performs case-insensitive matching', () => {
    const filterByName = (records: EnrichedAttendanceRecord[], query: string) => {
      const q = query.toLowerCase().trim();
      return records.filter((r) => r.userName.toLowerCase().includes(q));
    };

    // Lowercase match
    const result1 = filterByName(enrichedRecords, 'kumar');
    expect(result1.length).toBe(3); // Ram Kumar, Arjun Kumar, Vijay Kumar

    // Mixed case match
    const result2 = filterByName(enrichedRecords, 'kArThIK');
    expect(result2.length).toBe(1);
    expect(result2[0].userName).toBe('Karthik Raj');

    // No match
    const result3 = filterByName(enrichedRecords, 'NonExistentName');
    expect(result3.length).toBe(0);
  });

  test('Date filtering: today, yesterday, and week ranges', () => {
    // Today filter
    const todayRecords = enrichedRecords.filter((r) => r.date === today);
    expect(todayRecords.length).toBe(2);

    // Yesterday filter
    const yesterdayRecords = enrichedRecords.filter((r) => r.date === yesterday);
    expect(yesterdayRecords.length).toBe(1);
    expect(yesterdayRecords[0].userName).toBe('Arjun Kumar');

    // Past 7 Days filter
    const sevenDaysAgo = getRelativeDateISO(-7);
    const pastWeekRecords = enrichedRecords.filter(
      (r) => r.date >= sevenDaysAgo && r.date <= today
    );
    expect(pastWeekRecords.length).toBe(4); // today (2) + yesterday (1) + fiveDaysAgo (1)
  });

  test('Combined filters: search query + date filter + role filter', () => {
    const combinedFilter = (
      records: EnrichedAttendanceRecord[],
      query: string,
      targetDate: string,
      role: string
    ) => {
      return records.filter((r) => {
        const matchesQuery = r.userName.toLowerCase().includes(query.toLowerCase());
        const matchesDate = r.date === targetDate;
        const matchesRole = role === 'all' || r.userRole === role;
        return matchesQuery && matchesDate && matchesRole;
      });
    };

    // Match 'Kumar' on 'today' with role 'staff'
    // Today records are Karthik Raj (staff) and Divya Shree (staff) -> no Kumar today!
    const resEmpty = combinedFilter(enrichedRecords, 'kumar', today, 'staff');
    expect(resEmpty.length).toBe(0);

    // Match 'Arjun' on 'yesterday' with role 'staff'
    const resFound = combinedFilter(enrichedRecords, 'arjun', yesterday, 'staff');
    expect(resFound.length).toBe(1);
    expect(resFound[0].userName).toBe('Arjun Kumar');
  });

  test('Incomplete attendance handling: null timestamps display gracefully as em dash', () => {
    const incompleteRecord = enrichedRecords.find((r) => r.id === 'REC_3')!;
    expect(incompleteRecord.checkOutTime).toBeNull();
    expect(incompleteRecord.status).toBe('checked_in');

    const formattedCheckOut = formatDisplayTime(incompleteRecord.checkOutTime);
    expect(formattedCheckOut).toBe('—');
  });

  test('Empty history returns an empty array cleanly', () => {
    const emptyHistory = enrichAndSortAttendanceRecords([], DUMMY_USERS);
    expect(emptyHistory).toEqual([]);
  });
});
