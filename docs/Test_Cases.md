# Quality Assurance & Test Case Specification

## 1. Test Suite Summary

- **Total Test Suites**: 5
- **Total Test Cases Executed**: 35
- **Total Passed**: 35 (100%)
- **Total Failed**: 0
- **Test Framework**: Jest with `jest-expo` preset and `@react-native-async-storage/async-storage` mock
- **Execution Command**: `npm test` or `npm run test:ci`

---

## 2. Test Case Traceability Matrix

| Test ID | Module / Category | Test Objective | Execution Method | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-AUTH-01** | Authentication | Admin demo login (`admin@test.com` / `Admin@123`) | Unit / Service | Session created with role `admin`, navigates to Admin console. | **PASS** |
| **TC-AUTH-02** | Authentication | Senior Staff login (`senior@test.com` / `Senior@123`) | Unit / Service | Session created with role `senior_staff`, opens Senior portal. | **PASS** |
| **TC-AUTH-03** | Authentication | Staff demo login (`staff@test.com` / `Staff@123`) | Unit / Service | Session created with role `staff`, opens Staff portal. | **PASS** |
| **TC-AUTH-04** | Authentication | Empty email and password validation | Unit / Service | Returns `'Please enter both email and password.'` | **PASS** |
| **TC-AUTH-05** | Authentication | Empty email validation | Unit / Service | Returns `'Email address cannot be empty.'` | **PASS** |
| **TC-AUTH-06** | Authentication | Empty password validation | Unit / Service | Returns `'Password cannot be empty.'` | **PASS** |
| **TC-AUTH-07** | Authentication | Invalid email syntax validation | Unit / Service | Returns `'Please enter a valid email address format.'` | **PASS** |
| **TC-AUTH-08** | Authentication | Non-existent email credentials rejection | Unit / Service | Returns `'User not found with this email address.'` | **PASS** |
| **TC-AUTH-09** | Authentication | Wrong password credentials rejection | Unit / Service | Returns `'Incorrect password. Please verify your credentials.'` | **PASS** |
| **TC-SESS-01** | Session Management | Session persistence & storage restoration | AsyncStorage | Restored object matches `AuthUser` schema and omits password. | **PASS** |
| **TC-SESS-02** | Session Management | Clean session removal upon logout | AsyncStorage | Session key is removed; `getSession()` returns `null`. | **PASS** |
| **TC-SESS-03** | Session Management | Malformed or corrupted session recovery | AsyncStorage | Corrupt JSON is purged without throwing unhandled exceptions. | **PASS** |
| **TC-ATT-01** | Attendance Service | Check-in creation with timestamp and status | Mock Clock | Creates record with `checked_in`, `checkInTime`, and null `checkOutTime`. | **PASS** |
| **TC-ATT-02** | Attendance Service | Duplicate check-in rejection on same day | Mock Clock | Subsequent check-in rejected with informative error. | **PASS** |
| **TC-ATT-03** | Attendance Service | Successful checkout state transition | Mock Clock | Updates status to `checked_out` and populates `checkOutTime`. | **PASS** |
| **TC-ATT-04** | Attendance Service | Checkout before check-in prevention | Mock Clock | Rejects checkout if no existing record for current date. | **PASS** |
| **TC-ATT-05** | Attendance Service | Duplicate checkout prevention | Mock Clock | Rejects second checkout attempt after status is `checked_out`. | **PASS** |
| **TC-ATT-06** | Attendance Service | Checkout timestamp prior to check-in rejection | Mock Clock | Rejects checkout if clock indicates time preceding check-in. | **PASS** |
| **TC-ATT-07** | Attendance Service | One-record-per-user-per-day enforcement | Mock Clock | Record count for user on target date never exceeds 1. | **PASS** |
| **TC-ATT-08** | Attendance Service | Independent attendance across multiple users | Multi-user | User A checkout does not affect User B ongoing check-in. | **PASS** |
| **TC-ATT-09** | Attendance Service | Attendance data persistence in AsyncStorage | AsyncStorage | Records persist across service invocations. | **PASS** |
| **TC-DATA-01** | Data Storage | Seed data initialization on empty storage | AsyncStorage | Initial relative seed records are generated on clean install. | **PASS** |
| **TC-DATA-02** | Data Storage | Seed idempotency (never overwriting user edits) | AsyncStorage | Existing records and user edits are preserved across app restarts. | **PASS** |
| **TC-RBAC-01** | Access Control | Admin universal attendance record visibility | Permissions | Returns records across Admin, Senior Staff, and Staff. | **PASS** |
| **TC-RBAC-02** | Access Control | Senior Staff isolation to Staff records only | Permissions | All returned records strictly have `userRole === 'staff'`. | **PASS** |
| **TC-RBAC-03** | Access Control | Staff isolation to own records only | Permissions | Returns records matching only the authenticated staff user ID. | **PASS** |
| **TC-RBAC-04** | Navigation Access | Screen navigation authorization guards | Permissions | Admin only for Admin/User screens; Senior only for Senior screen. | **PASS** |
| **TC-RBAC-05** | Access Control | Cross-role attendance history viewing matrix | Permissions | Senior Staff can view Staff histories but not Admin histories. | **PASS** |
| **TC-RBAC-06** | Access Control | Employee directory role filter | Permissions | Senior Staff can only list Staff employees in team view. | **PASS** |
| **TC-SRCH-01** | Filtering & Search | Case-insensitive employee name search | UI Logic | Matches `'kumar'`, `'KUMAR'`, `'kArThIk'` reliably. | **PASS** |
| **TC-SRCH-02** | Filtering & Search | Date preset filtering (Today, Yesterday, Week) | UI Logic | Correctly partitions records matching relative date ranges. | **PASS** |
| **TC-SRCH-03** | Filtering & Search | Combined filters (Name + Date + Role) | UI Logic | Intersects multiple filter conditions simultaneously. | **PASS** |
| **TC-SRCH-04** | Filtering & Search | Latest-first chronological sorting | UI Logic | Sorts by date descending, then checkInTime descending. | **PASS** |
| **TC-SRCH-05** | UI Formatting | Incomplete attendance formatting (em dash) | Date Utils | `checkOutTime === null` formats gracefully as `'—'`. | **PASS** |
| **TC-STAT-01** | Dashboard Analytics | Admin dashboard KPI calculations | Stats Service | Correctly aggregates total users, staff count, checked-in count. | **PASS** |
| **TC-STAT-02** | Dashboard Analytics | Senior Staff dashboard KPI calculations | Stats Service | Aggregates only Staff members; excludes Senior and Admin users. | **PASS** |

---

## 3. Actual Test Runner Output

```
> attendance@1.0.0 test
> jest

PASS tests/utils/permissions.test.ts
PASS tests/services/storageService.test.ts
PASS tests/auth/login.test.ts
PASS tests/services/attendanceService.test.ts
PASS tests/screens/filtering.test.ts

Test Suites: 5 passed, 5 total
Tests:       35 passed, 35 total
Snapshots:   0 total
Time:        2.029 s
Ran all test suites.
```
