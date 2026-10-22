import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser, AttendanceRecord } from '../types';
import { generateSeedAttendanceRecords } from '../data/seedAttendance';

const STORAGE_KEYS = {
  SESSION: '@attendance_app_session_v1',
  ATTENDANCE_RECORDS: '@attendance_app_records_v1',
  IS_INITIALIZED: '@attendance_app_initialized_v1',
};

/**
 * Validates whether an object matches the AuthUser shape.
 */
const isValidAuthUser = (user: unknown): user is AuthUser => {
  if (!user || typeof user !== 'object') return false;
  const u = user as Record<string, unknown>;
  return (
    typeof u.id === 'string' &&
    typeof u.name === 'string' &&
    typeof u.email === 'string' &&
    (u.role === 'admin' || u.role === 'senior_staff' || u.role === 'staff')
  );
};

/**
 * Validates whether an item matches the AttendanceRecord shape.
 */
const isValidAttendanceRecord = (record: unknown): record is AttendanceRecord => {
  if (!record || typeof record !== 'object') return false;
  const r = record as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.userId === 'string' &&
    typeof r.date === 'string' &&
    (r.checkInTime === null || typeof r.checkInTime === 'string') &&
    (r.checkOutTime === null || typeof r.checkOutTime === 'string') &&
    (r.status === 'not_checked_in' || r.status === 'checked_in' || r.status === 'checked_out')
  );
};

/**
 * Retrieves the currently persisted user session.
 * Safely handles missing or corrupt storage data.
 */
export const getSession = async (): Promise<AuthUser | null> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);
    if (!json) return null;
    const parsed = JSON.parse(json);
    if (isValidAuthUser(parsed)) {
      return parsed;
    }
    // If corrupt, clean it up safely
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
    return null;
  } catch (error) {
    console.error('Failed to read user session from AsyncStorage:', error);
    return null;
  }
};

/**
 * Persists active user session (password is NEVER included).
 */
export const saveSession = async (user: AuthUser): Promise<void> => {
  try {
    const json = JSON.stringify(user);
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION, json);
  } catch (error) {
    console.error('Failed to save session to AsyncStorage:', error);
    throw new Error('Could not persist session. Storage operation failed.');
  }
};

/**
 * Clears current user session on logout.
 */
export const clearSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
  } catch (error) {
    console.error('Failed to clear session from AsyncStorage:', error);
    throw new Error('Could not clear session storage.');
  }
};

/**
 * Retrieves all attendance records from local storage.
 * Filters out corrupt or invalid entries.
 */
export const getAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.ATTENDANCE_RECORDS);
    if (!json) return [];
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidAttendanceRecord);
  } catch (error) {
    console.error('Failed to read attendance records from AsyncStorage:', error);
    return [];
  }
};

/**
 * Persists attendance records to local storage.
 * Awaits completion before returning.
 */
export const saveAttendanceRecords = async (
  records: AttendanceRecord[]
): Promise<void> => {
  try {
    const json = JSON.stringify(records);
    await AsyncStorage.setItem(STORAGE_KEYS.ATTENDANCE_RECORDS, json);
  } catch (error) {
    console.error('Failed to persist attendance records to AsyncStorage:', error);
    throw new Error('Failed to save attendance records to storage.');
  }
};

/**
 * Initializes application data upon startup.
 * Seeds initial attendance records ONLY if the store has not been initialized
 * or is completely empty. Never overwrites existing user modifications.
 */
export const initializeAppData = async (): Promise<AttendanceRecord[]> => {
  try {
    const initializedFlag = await AsyncStorage.getItem(STORAGE_KEYS.IS_INITIALIZED);
    const existingRecords = await getAttendanceRecords();

    if (initializedFlag === 'true' && existingRecords.length > 0) {
      // Data already present; do not overwrite
      return existingRecords;
    }

    // Seed dynamic attendance data
    const initialSeed = generateSeedAttendanceRecords();
    await saveAttendanceRecords(initialSeed);
    await AsyncStorage.setItem(STORAGE_KEYS.IS_INITIALIZED, 'true');
    return initialSeed;
  } catch (error) {
    console.error('Initialization failed in storage service:', error);
    // Return empty array or fallback seed in memory
    return generateSeedAttendanceRecords();
  }
};

/**
 * Utility to clear all app data (useful in testing or debug reset).
 */
export const clearAllAppData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.SESSION,
      STORAGE_KEYS.ATTENDANCE_RECORDS,
      STORAGE_KEYS.IS_INITIALIZED,
    ]);
  } catch (error) {
    console.error('Failed to reset app storage:', error);
  }
};
