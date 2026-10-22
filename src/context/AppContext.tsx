import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  AuthUser,
  AttendanceRecord,
  User,
  EnrichedAttendanceRecord,
  AttendanceActionResult,
} from '../types';
import { DUMMY_USERS } from '../data/dummyUsers';
import {
  getSession,
  saveSession,
  clearSession,
  getAttendanceRecords,
  initializeAppData,
} from '../services/storageService';
import {
  performCheckIn,
  performCheckOut,
  enrichAndSortAttendanceRecords,
} from '../services/attendanceService';
import { getTodayISODate } from '../utils/dateUtils';

interface AppContextType {
  currentUser: AuthUser | null;
  users: User[];
  attendanceRecords: AttendanceRecord[];
  enrichedRecords: EnrichedAttendanceRecord[];
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;
  todayUserRecord: AttendanceRecord | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  handleCheckIn: () => Promise<AttendanceActionResult>;
  handleCheckOut: () => Promise<AttendanceActionResult>;
  refreshAttendanceData: () => Promise<void>;
  clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load session and initialized attendance data on startup
  useEffect(() => {
    let isMounted = true;

    const bootstrapApp = async () => {
      try {
        // 1. Initialize attendance data if empty
        const records = await initializeAppData();
        // 2. Restore persisted session
        const session = await getSession();

        if (isMounted) {
          setAttendanceRecords(records);
          if (session) {
            const exists = DUMMY_USERS.some((u) => u.id === session.id);
            if (exists) {
              setCurrentUser(session);
            } else {
              await clearSession();
              setCurrentUser(null);
            }
          }
        }
      } catch (err) {
        console.error('App bootstrap error:', err);
        if (isMounted) {
          setError('Failed to restore saved data.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    bootstrapApp();

    return () => {
      isMounted = false;
    };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Login with email and password.
   * Matches against DUMMY_USERS.
   */
  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; message?: string }> => {
      setIsActionLoading(true);
      setError(null);

      // Simulate a realistic brief async authentication verification
      await new Promise((res) => setTimeout(res, 300));

      const normalizedEmail = email.trim().toLowerCase();
      const user = DUMMY_USERS.find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );

      if (!user) {
        setIsActionLoading(false);
        const msg = 'User not found with this email address.';
        setError(msg);
        return { success: false, message: msg };
      }

      if (user.password !== password) {
        setIsActionLoading(false);
        const msg = 'Incorrect password. Please verify your credentials.';
        setError(msg);
        return { success: false, message: msg };
      }

      // Password is intentionally excluded from active session
      const authUser: AuthUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      };

      try {
        await saveSession(authUser);
        setCurrentUser(authUser);
        setIsActionLoading(false);
        return { success: true };
      } catch {
        setIsActionLoading(false);
        const msg = 'Failed to persist session.';
        setError(msg);
        return { success: false, message: msg };
      }
    },
    []
  );

  /**
   * Logout user, clear session, reset state.
   */
  const logout = useCallback(async () => {
    setIsActionLoading(true);
    try {
      await clearSession();
      setCurrentUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsActionLoading(false);
    }
  }, []);

  /**
   * Refreshes attendance records from storage.
   */
  const refreshAttendanceData = useCallback(async () => {
    try {
      const records = await getAttendanceRecords();
      setAttendanceRecords(records);
    } catch (err) {
      console.error('Refresh attendance error:', err);
    }
  }, []);

  /**
   * Check in for current user.
   */
  const handleCheckIn = useCallback(async (): Promise<AttendanceActionResult> => {
    if (!currentUser) {
      return { success: false, message: 'No active session.' };
    }

    setIsActionLoading(true);
    try {
      const result = await performCheckIn(currentUser, attendanceRecords);
      if (result.success && result.record) {
        // Update local context state immediately
        setAttendanceRecords((prev) => [...prev, result.record!]);
      }
      return result;
    } finally {
      setIsActionLoading(false);
    }
  }, [currentUser, attendanceRecords]);

  /**
   * Check out for current user.
   */
  const handleCheckOut = useCallback(async (): Promise<AttendanceActionResult> => {
    if (!currentUser) {
      return { success: false, message: 'No active session.' };
    }

    setIsActionLoading(true);
    try {
      const result = await performCheckOut(currentUser, attendanceRecords);
      if (result.success && result.record) {
        // Update local context state immediately
        setAttendanceRecords((prev) =>
          prev.map((r) => (r.id === result.record!.id ? result.record! : r))
        );
      }
      return result;
    } finally {
      setIsActionLoading(false);
    }
  }, [currentUser, attendanceRecords]);

  /**
   * Today's attendance record for the active user.
   */
  const todayUserRecord = useMemo(() => {
    if (!currentUser) return null;
    const today = getTodayISODate();
    return (
      attendanceRecords.find(
        (r) => r.userId === currentUser.id && r.date === today
      ) || null
    );
  }, [currentUser, attendanceRecords]);

  /**
   * Enriched and sorted attendance records for UI consumption.
   */
  const enrichedRecords = useMemo(() => {
    return enrichAndSortAttendanceRecords(attendanceRecords, DUMMY_USERS);
  }, [attendanceRecords]);

  const value = useMemo(
    () => ({
      currentUser,
      users: DUMMY_USERS,
      attendanceRecords,
      enrichedRecords,
      isLoading,
      isActionLoading,
      error,
      todayUserRecord,
      login,
      logout,
      handleCheckIn,
      handleCheckOut,
      refreshAttendanceData,
      clearError,
    }),
    [
      currentUser,
      attendanceRecords,
      enrichedRecords,
      isLoading,
      isActionLoading,
      error,
      todayUserRecord,
      login,
      logout,
      handleCheckIn,
      handleCheckOut,
      refreshAttendanceData,
      clearError,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
