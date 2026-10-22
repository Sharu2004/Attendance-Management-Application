# Technical Notes & Architectural Decisions

## 1. Executive Technical Summary

The Attendance Management Application was designed to satisfy demanding requirements for reliability, usability, and role separation without external server dependencies. This document details key engineering tradeoffs, design patterns, state management justifications, and security boundaries implemented in the codebase.

---

## 2. State Management: React Context API vs. External State Stores

### Decision
We utilized the built-in **React Context API** coupled with customized React hooks (`useApp`) rather than introducing heavyweight external state management libraries such as Redux Toolkit, MobX, or Zustand.

### Justification
1. **Application Scope & Bounded Context**: The state surface consists of:
   - Authenticated user session (`currentUser: AuthUser | null`)
   - Predefined employee directory (`users: User[]`)
   - Local attendance ledger (`attendanceRecords: AttendanceRecord[]`)
   - Derived sorted and enriched views (`enrichedRecords: EnrichedAttendanceRecord[]`)
   - Operation flags (`isLoading`, `isActionLoading`, `error`)
2. **Zero Dependency Overhead**: Avoids hundreds of kilobytes of external boilerplate, selector memoization wrappers, and external devtools dependencies.
3. **Optimized Render Characteristics**: By collocating state within `AppContext.tsx` and exposing computed getters (`todayUserRecord`, `enrichedRecords`) wrapped in `useMemo`, child screens only re-render when the underlying attendance records or active user changes.
4. **Predictable Unidirectional Data Flow**: State updates flow strictly through async action dispatchers (`handleCheckIn`, `handleCheckOut`, `login`, `logout`), ensuring that local storage writes resolve before component state transitions.

---

## 3. Local Persistence & AsyncStorage Strategy

### Storage Keys Schema
```typescript
const STORAGE_KEYS = {
  SESSION: '@attendance_app_session_v1',
  ATTENDANCE_RECORDS: '@attendance_app_records_v1',
  IS_INITIALIZED: '@attendance_app_initialized_v1',
};
```

### Data Validation & Schema Protection
Raw JSON parsed from AsyncStorage can become corrupted if storage operations are interrupted or if previous schema versions clash. To prevent app crashes:
- Type predicates (`isValidAuthUser`, `isValidAttendanceRecord`) validate every restored entity before hydrating React state.
- Malformed session payloads are purged automatically, falling back gracefully to the Login state.
- Corrupted individual attendance records are filtered out while preserving valid sibling records.

### Idempotent Seed Initialization
A critical pitfall in local demo apps is overwriting user actions on every app restart. Our implementation utilizes an `@attendance_app_initialized_v1` flag:
1. On initial startup, if the initialization flag is absent or records are empty, dynamic seed records are generated using dates relative to today (`getRelativeDateISO(0)`).
2. On subsequent startups, `initializeAppData()` detects the flag and leaves existing storage records untouched. User check-ins and checkouts persist permanently across restarts until explicitly cleared.

---

## 4. Attendance Business Logic & Concurrency Protections

### Business Invariants
1. **One Record Per User Per Calendar Day**:
   - The primary composite identity of an attendance event is `(userId, date)` where `date` is formatted in ISO `YYYY-MM-DD`.
   - Before any check-in or checkout is committed, the store is queried for an existing record matching `(userId, todayDate)`.
2. **Deterministic State Transitions**:
   ```
   [Not Checked In] ──(Check-In)──> [Checked In] ──(Check-Out)──> [Checked Out (Completed)]
   ```
   - Duplicate check-ins are rejected if the user is already `checked_in` or `checked_out`.
   - Checkouts are rejected if no check-in record exists for today.
   - Duplicate checkouts are rejected if `status === 'checked_out'` or `checkOutTime !== null`.
3. **Timestamp Monotonicity**:
   - The checkout timestamp is strictly validated against the recorded check-in timestamp:
     `new Date(checkOutTimestamp).getTime() >= new Date(checkInTimestamp).getTime()`
   - Timestamps cannot be manually entered; they are derived automatically from the system clock or mock time service.
4. **Concurrency Guard (Rapid Tap Prevention)**:
   - Fast, repeated tapping on mobile screens can initiate concurrent async execution threads before state updates re-render the button disabled state.
   - In `attendanceService.ts`, a module-scoped concurrency set `pendingOperations` tracks active operation keys (e.g., `checkin_USR003`). Subsequent calls with the same key are immediately rejected until the active promise completes.

---

## 5. Mockable Clock Design Pattern

To achieve 100% deterministic unit testing of time-sensitive operations (e.g., morning check-in at 09:00 followed by evening checkout at 17:30, and retroactive day simulation), we introduced an injectable time utility (`src/utils/dateUtils.ts`):
- `setMockDate(date: Date | string | null)`: Overrides the internal system clock.
- `resetMockDate()`: Restores native system time.
- `getTodayISODate()` and `getCurrentISOTimestamp()` route through `getNowDate()`.

In Jest test suites, time can be advanced deterministically:
```typescript
setMockDate('2026-10-22T09:00:00Z');
await performCheckIn(user);

setMockDate('2026-10-22T17:30:00Z');
await performCheckOut(user);
```

---

## 6. Role-Based Access Control (RBAC) & Navigation Architecture

### Protected Stack Architecture
React Navigation renders screens conditionally based on `currentUser`:
- **Unauthenticated (`currentUser === null`)**: Renders only `<Stack.Screen name="Login" component={LoginScreen} />`.
- **Admin**: Mounts `AdminDashboard`, `TeamAttendance`, `UserManagement`, `PersonalHistory`, `Profile`.
- **Senior Staff**: Mounts `SeniorDashboard`, `TeamAttendance`, `PersonalHistory`, `Profile`. (Excludes `UserManagement` and `AdminDashboard`).
- **Staff**: Mounts `StaffDashboard`, `PersonalHistory`, `Profile`. (Excludes `TeamAttendance`, `UserManagement`, `SeniorDashboard`, and `AdminDashboard`).

### Clean Navigation Reset upon Logout
When `logout()` is dispatched:
1. `clearSession()` removes the stored session from AsyncStorage.
2. `setCurrentUser(null)` resets React state.
3. React Navigation automatically dismounts all authenticated screens and mounts the `Login` screen.
4. The entire navigation history stack is cleared, preventing any back-button navigation into previously viewed protected screens.

### Data-Layer Filtering
UI button hiding alone is insufficient for RBAC. In `src/utils/permissions.ts`:
- `filterVisibleAttendanceRecords()` inspects `currentUser.role`. If `currentUser.role === 'senior_staff'`, all records where `userRole !== 'staff'` are strictly stripped prior to rendering, searching, or filtering.

---

## 7. Security Considerations & Disclosures

1. **Client-Side RBAC vs. Server-Side Enforcement**:
   - In this standalone mobile implementation, access rules are enforced client-side for evaluation.
   - For production enterprise multi-tenant deployments, authorization must be validated server-side at the API gateway layer using cryptographically signed JSON Web Tokens (JWT) and database row-level security (RLS).
2. **Password Security**:
   - Predefined passwords in `dummyUsers.ts` are intended strictly for evaluation.
   - Active session storage (`@attendance_app_session_v1`) intentionally omits passwords.
   - Plaintext passwords are never displayed in User Management or Profile screens.
