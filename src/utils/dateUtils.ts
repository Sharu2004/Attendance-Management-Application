// Date and Time utility with mockable clock for deterministic testing

let mockDate: Date | null = null;

/**
 * Set a mock date/time for deterministic testing.
 */
export const setMockDate = (date: Date | string | null): void => {
  if (date === null) {
    mockDate = null;
  } else if (typeof date === 'string') {
    mockDate = new Date(date);
  } else {
    mockDate = new Date(date);
  }
};

/**
 * Reset mock date to use real system time.
 */
export const resetMockDate = (): void => {
  mockDate = null;
};

/**
 * Get the current Date object (mocked or real).
 */
export const getNowDate = (): Date => {
  if (mockDate !== null) {
    return new Date(mockDate.getTime());
  }
  return new Date();
};

/**
 * Returns the current calendar date in local ISO YYYY-MM-DD format.
 */
export const getTodayISODate = (): string => {
  const d = getNowDate();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns the current ISO-8601 timestamp string.
 */
export const getCurrentISOTimestamp = (): string => {
  return getNowDate().toISOString();
};

/**
 * Generates an ISO calendar date with a day offset relative to today.
 * E.g., offsetDays = -1 returns yesterday's date.
 */
export const getRelativeDateISO = (offsetDays: number): string => {
  const d = getNowDate();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Creates an ISO timestamp for a specific calendar date and hour/minute.
 */
export const createISOTimestamp = (
  dateISO: string,
  hours: number,
  minutes: number
): string => {
  const [year, month, day] = dateISO.split('-').map(Number);
  const d = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return d.toISOString();
};

/**
 * Formats an ISO date string (YYYY-MM-DD) into a readable string.
 * Example: "Thu, 22 Oct 2026"
 */
export const formatDisplayDate = (isoDate: string | null | undefined): string => {
  if (!isoDate) return '—';
  try {
    const [year, month, day] = isoDate.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoDate;
  }
};

/**
 * Formats an ISO timestamp into a readable 12-hour local time string.
 * Example: "09:30 AM"
 */
export const formatDisplayTime = (
  isoTimestamp: string | null | undefined
): string => {
  if (!isoTimestamp) return '—';
  try {
    const d = new Date(isoTimestamp);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '—';
  }
};

/**
 * Formats date and time together.
 */
export const formatDisplayDateTime = (
  isoTimestamp: string | null | undefined
): string => {
  if (!isoTimestamp) return '—';
  try {
    const d = new Date(isoTimestamp);
    if (isNaN(d.getTime())) return '—';
    return `${d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })}, ${d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })}`;
  } catch {
    return '—';
  }
};
