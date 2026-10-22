import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getSession,
  saveSession,
  clearSession,
  getAttendanceRecords,
  saveAttendanceRecords,
  initializeAppData,
} from '../../src/services/storageService';
import { AuthUser, AttendanceRecord } from '../../src/types';

describe('Storage Service Persistence & Session Management', () => {
  const testUser: AuthUser = {
    id: 'USR001',
    name: 'Ram Kumar',
    email: 'admin@test.com',
    role: 'admin',
    department: 'Executive Administration',
  };

  test('Session persistence and restoration', async () => {
    await saveSession(testUser);
    const restored = await getSession();

    expect(restored).not.toBeNull();
    expect(restored?.id).toBe(testUser.id);
    expect(restored?.email).toBe(testUser.email);
    expect(restored?.role).toBe(testUser.role);
    // Verified: No password in session
    expect((restored as any).password).toBeUndefined();
  });

  test('Logout clears session completely', async () => {
    await saveSession(testUser);
    let session = await getSession();
    expect(session).not.toBeNull();

    await clearSession();
    session = await getSession();
    expect(session).toBeNull();
  });

  test('Corrupt or malformed session data is safely handled and removed', async () => {
    await AsyncStorage.setItem(
      '@attendance_app_session_v1',
      JSON.stringify({ invalid: 'corrupted payload without required fields' })
    );

    const session = await getSession();
    expect(session).toBeNull();
  });

  test('Attendance records persistence and retrieval', async () => {
    const testRecords: AttendanceRecord[] = [
      {
        id: 'REC_1',
        userId: 'USR003',
        date: '2026-10-22',
        checkInTime: '2026-10-22T09:00:00Z',
        checkOutTime: '2026-10-22T17:00:00Z',
        status: 'checked_out',
      },
    ];

    await saveAttendanceRecords(testRecords);
    const loaded = await getAttendanceRecords();

    expect(loaded.length).toBe(1);
    expect(loaded[0].id).toBe('REC_1');
    expect(loaded[0].userId).toBe('USR003');
  });

  test('initializeAppData seeds data when storage is empty, and does NOT overwrite on repeated calls', async () => {
    // 1. Initial call: empty storage -> seeds data
    const initialRecords = await initializeAppData();
    expect(initialRecords.length).toBeGreaterThan(0);

    // 2. Add a custom user modification
    const customRecord: AttendanceRecord = {
      id: 'CUSTOM_TEST_REC',
      userId: 'USR001',
      date: '2026-10-22',
      checkInTime: '2026-10-22T08:00:00Z',
      checkOutTime: null,
      status: 'checked_in',
    };
    await saveAttendanceRecords([...initialRecords, customRecord]);

    // 3. Re-run initializeAppData (simulating app restart)
    const secondCallRecords = await initializeAppData();
    // Must NOT overwrite with seed data; user modification must be preserved!
    const foundCustom = secondCallRecords.find((r) => r.id === 'CUSTOM_TEST_REC');
    expect(foundCustom).toBeDefined();
    expect(secondCallRecords.length).toBe(initialRecords.length + 1);
  });
});
