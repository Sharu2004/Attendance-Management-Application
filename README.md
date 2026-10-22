# Attendance Management Application (React Native & Expo)

An enterprise-grade, offline-first Mobile Attendance Management Application built with **React Native**, **Expo SDK 58**, **TypeScript**, and **AsyncStorage**. Designed specifically for workforce tracking with role-based dashboards, robust attendance verification, deterministic time simulation, and strict role permissions.

---

## 1. Project Overview

The Attendance Management Application provides end-to-end employee attendance lifecycle management with zero external backend dependencies. It incorporates a role-based access control (RBAC) model supporting three distinct tiers:
- **Admin**: Full organization oversight, team analytics, user directory, universal attendance history, and personal check-in/out.
- **Senior Staff**: Team supervisor portal restricted strictly to managing and viewing **Staff** members, attendance filtering, and personal check-in/out.
- **Staff**: Direct employee attendance portal with one-tap check-in, real-time status transitions, checkout verification, and personal logs.

All employee data uses authentic Indian and Tamil names (e.g., Ram Kumar, Nivin Pauly, Arjun Kumar, Priya Lakshmi) with dynamic relative dates, guaranteeing that newly launched instances showcase immediate, realistic activity.

---

## 2. Key Features

- **Role-Based Portals & Dashboards**:
  - Independent UX workflows for Admin, Senior Staff, and Staff.
  - Dynamically calculated KPIs (Total Employees, Staff Count, Senior Count, Checked In Today, Pending Check-In).
  - Senior Staff statistics and logs are strictly isolated to Staff members (never leaking Admin or Senior Staff records).
- **Attendance Verification & Business Rules**:
  - **One record per employee per calendar day** rule strictly enforced.
  - Automatic ISO-8601 timestamp generation (no manual tampering).
  - Duplicate check-in prevention.
  - Checkout validation requiring prior check-in.
  - Validation against checkout timestamps preceding check-in times.
  - Concurrency locks protecting against rapid double-taps.
  - Injectable mock clock supporting deterministic testing.
- **Team Attendance & Advanced Filtering**:
  - Case-insensitive employee name and email search.
  - Date filter presets (*All Dates*, *Today*, *Yesterday*, *Past 7 Days*) and an interactive *Custom Date* picker.
  - Role filter tabs for Admin (*All*, *Admin*, *Senior Staff*, *Staff*).
  - Reset filters button returning the active view to baseline.
  - Latest-first chronological sorting (date descending, timestamp descending).
- **Employee Directory (Admin Only)**:
  - Searchable employee directory listing name, email, role badge, employee ID, and department.
  - Drill-down navigation to any employee's full attendance history.
  - Passwords excluded from listings and active state.
- **Offline Persistence & Safe Session Restoration**:
  - Powered by `@react-native-async-storage/async-storage`.
  - Automatic seed initialization that runs only once on clean installs without overwriting user data on subsequent app launches.
  - Corrupt storage recovery and validation.
- **Design & UI/UX**:
  - Deep Navy primary (`#0F2744`), Teal accents (`#0D9488`), Crisp White surfaces (`#FFFFFF`).
  - Color-coded badges: Green (`#10B981`) for completed attendance, Amber (`#F59E0B`) for ongoing sessions, Slate (`#94A3B8`) for pending check-in.
  - Safe-area compliance and keyboard-avoiding inputs.

---

## 3. Technology Stack & Justification

| Technology | Version | Purpose & Rationale |
| :--- | :--- | :--- |
| **Expo SDK** | `~58.0.17` | Standardized cross-platform tooling, managed native runtimes, fast builds. |
| **React Native** | `0.88.0` | Mobile framework delivering native 60fps performance across iOS and Android. |
| **React** | `19.3.0` | Modern UI rendering engine with strict hooks lifecycle and concurrent guarantees. |
| **TypeScript** | `~6.0.3` | End-to-end static typing for models, navigation params, and service contracts. |
| **React Navigation** | `^7.5.1` | Native stack navigation with unconditional role-based protected stacks. |
| **AsyncStorage** | `2.2.0` | Asynchronous, unencrypted key-value storage for offline local persistence. |
| **Jest** | `^30.5.2` | Fast unit and integration test runner with deterministic mocking. |
| **Expo Doctor** | `1.21.5` | Automated dependency, peer requirement, and configuration validator. |

---

## 4. Architecture and Folder Structure

```
attendance-management-app/
├── App.tsx                    # Root entry point, SafeAreaProvider, and Context Provider
├── app.json                   # Expo application metadata and configuration
├── package.json               # Dependencies and executable scripts
├── tsconfig.json              # Strict TypeScript compiler options with Jest types
├── jest.config.js             # Jest test configuration using jest-expo preset
├── README.md                  # Comprehensive project documentation
├── src/
│   ├── components/            # Reusable UI component library
│   │   ├── AppHeader.tsx            # Standard deep-navy header with back and actions
│   │   ├── PrimaryButton.tsx        # Variant-driven button with loading and disabled states
│   │   ├── SummaryCard.tsx          # Metric KPI card with custom accent borders
│   │   ├── AttendanceStatusBadge.tsx# Color-coded attendance status badge
│   │   ├── AttendanceRecordCard.tsx # Detailed attendance card with employee info
│   │   ├── CheckInOutCard.tsx       # Live personal check-in/out interactive widget
│   │   ├── SearchBar.tsx            # Clean text input with clear button
│   │   ├── DateFilter.tsx           # Preset date pills + custom date modal
│   │   ├── EmptyState.tsx           # Informative placeholder for empty queries
│   │   ├── LoadingView.tsx          # Full-screen loading spinner
│   │   ├── LogoutModal.tsx          # Modal confirmation dialog for sign-out
│   │   ├── RoleBadge.tsx            # Color-coded role pill (Admin, Senior, Staff)
│   │   └── index.ts                 # Central component export barrel
│   ├── context/
│   │   └── AppContext.tsx     # React Context state management, session, and operations
│   ├── data/
│   │   ├── dummyUsers.ts      # 12 predefined Indian/Tamil employee records
│   │   └── seedAttendance.ts  # Relative dynamic date seed generator
│   ├── navigation/
│   │   └── AppNavigator.tsx   # Protected role-based navigation stacks
│   ├── screens/
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx      # Sign-in form with demo account quick-fill
│   │   ├── admin/
│   │   │   ├── AdminDashboardScreen.tsx # Organization KPIs and recent logs
│   │   │   └── UserManagementScreen.tsx # Employee directory with role filter
│   │   ├── senior/
│   │   │   └── SeniorDashboardScreen.tsx# Staff-only team supervisor portal
│   │   ├── staff/
│   │   │   └── StaffDashboardScreen.tsx # Direct employee personal portal
│   │   ├── attendance/
│   │   │   ├── TeamAttendanceScreen.tsx # Reusable team attendance record table
│   │   │   └── PersonalHistoryScreen.tsx# Detailed chronological attendance log
│   │   └── common/
│   │       └── ProfileScreen.tsx    # User details and sign-out
│   ├── services/
│   │   ├── attendanceService.ts # Business rules, validations, check-in/out, stats
│   │   └── storageService.ts    # AsyncStorage persistence, validation, seed guard
│   ├── theme/
│   │   └── theme.ts           # Color tokens, typography, shadows, spacing
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces (User, Attendance, Roles)
│   └── utils/
│       ├── dateUtils.ts       # ISO date utilities and mockable clock helper
│       └── permissions.ts     # Role authorization rules and data selectors
├── tests/
│   ├── setup.ts               # AsyncStorage mock setup
│   ├── auth/
│   │   └── login.test.ts      # Authentication, demo accounts, validation tests
│   ├── screens/
│   │   └── filtering.test.ts  # Name search, date ranges, sorting, empty states
│   ├── services/
│   │   ├── attendanceService.test.ts # Check-in, checkout, duplicate prevention
│   │   └── storageService.test.ts    # Persistence, session recovery, seed idempotency
│   └── utils/
│       └── permissions.test.ts# Role restrictions and screen authorization
└── docs/
    ├── Attendance_Management_App_Documentation.pdf # Complete PDF report
    ├── Technical_Notes.md                       # Architectural decisions and tradeoffs
    ├── Test_Cases.md                            # Comprehensive test specification
    └── Screen_Recording_Checklist.md            # Step-by-step video demonstration guide
```

---

## 5. Demonstration Accounts & Credentials

The system comes preloaded with 12 Tamil/Indian employee accounts. The three mandatory demonstration accounts are:

| User ID | Full Name | Role | Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| `USR001` | **Ram Kumar** | Admin | `admin@test.com` | `Admin@123` |
| `USR002` | **Nivin Pauly** | Senior Staff | `senior@test.com` | `Senior@123` |
| `USR003` | **Arjun Kumar** | Staff | `staff@test.com` | `Staff@123` |

### Additional Predefined Employees:
- `USR004` - **Priya Lakshmi** (Senior Staff) - `priya@test.com` / `Priya@123`
- `USR005` - **Karthik Raj** (Staff) - `karthik@test.com` / `Karthik@123`
- `USR006` - **Divya Shree** (Staff) - `divya@test.com` / `Divya@123`
- `USR007` - **Vijay Kumar** (Staff) - `vijay@test.com` / `Vijay@123`
- `USR008` - **Meena Devi** (Staff) - `meena@test.com` / `Meena@123`
- `USR009` - **Suresh Kumar** (Staff) - `suresh@test.com` / `Suresh@123`
- `USR010` - **Anitha Rani** (Staff) - `anitha@test.com` / `Anitha@123`
- `USR011` - **Hari Prasad** (Staff) - `hari@test.com` / `Hari@123`
- `USR012` - **Kavitha M** (Staff) - `kavitha@test.com` / `Kavitha@123`

*Note: The Login screen includes one-tap quick-fill chips for Admin, Senior Staff, and Staff for convenient assessment.*

---

## 6. Installation & Execution Commands

### Prerequisites
- Node.js (version 18.x to 22.x recommended)
- npm (v10+ or v11+)
- Expo Go app on iOS or Android, or an active Android Virtual Device / iOS Simulator

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npx expo start
```
Scan the QR code displayed in the terminal with the **Expo Go** application (Android) or Camera app (iOS).

### 3. Run on Android Emulator
```bash
npx expo start --android
```
*(Requires Android Studio, SDK Platform Tools, and an active emulator).*

### 4. Run on iOS Simulator
```bash
npx expo start --ios
```
*(Requires macOS with Xcode and Command Line Tools installed).*

---

## 7. Verification & Quality Assurance Commands

All quality gates have been executed and verified in this environment:

### Run Automated Tests
```bash
npm test
```
*Executes all 5 test suites across 35 unit/integration test cases.*

### Run CI Test Mode
```bash
npm run test:ci
```

### Run Static Type Check
```bash
npm run typecheck
```
*Verifies 100% strict TypeScript compliance across all components, screens, services, and tests.*

### Run Linter
```bash
npm run lint
```
*Runs ESLint with Expo configuration (zero errors, zero warnings).*

### Run Expo Doctor Diagnostics
```bash
npx expo-doctor
```
*Validates 20/20 checks including peer dependencies, packages, and Expo SDK compatibility.*

---

## 8. Role-by-Role Testing Walkthrough

### Scenario A: Testing the Staff Flow (Arjun Kumar)
1. Launch the application and click the **Staff** chip (`staff@test.com` / `Staff@123`).
2. Press **Log In**. The **Staff Dashboard** opens.
3. Observe the card shows **Not Checked In** (Arjun is intentionally seeded without a check-in for today).
4. Tap **Check In Now**. The status updates immediately to **Checked In** with an active timestamp (e.g., 11:30 AM).
5. Tap **Check In Now** again. Notice the button has transformed to **Check Out Now**; duplicate check-ins cannot occur.
6. Tap **Check Out Now**. Status transitions to **Completed** with both timestamps displayed and a congratulatory badge.
7. Tap **View My Complete Attendance Log** to inspect Arjun's historical records from yesterday, 2 days ago, and 3 days ago.
8. Tap the header sign-out icon, confirm in the modal, and observe the app resets to the Login screen.

### Scenario B: Testing the Senior Staff Flow (Nivin Pauly)
1. Sign in with the **Senior Staff** chip (`senior@test.com` / `Senior@123`).
2. The **Senior Staff Portal** opens.
3. Notice the KPI cards display **Staff Team Overview** (e.g., Total Staff: 9, Staff Checked In, Staff Pending).
4. Tap **Staff Attendance**.
5. Observe that **only Staff records** appear. Ram Kumar (Admin) and Nivin Pauly (Senior Staff) are strictly excluded from the records list.
6. Type `"Karthik"` into the Search Bar. The list filters instantly to Karthik Raj.
7. Click the **Yesterday** filter pill. The records filter instantly to yesterday's logs.
8. Tap **Reset** to clear all active filters.
9. Tap any Staff member card to review their personal history log.
10. Sign out.

### Scenario C: Testing the Admin Flow (Ram Kumar)
1. Sign in with the **Admin** chip (`admin@test.com` / `Admin@123`).
2. The **Admin Console** displays organization-wide metrics: Total Employees (12), Staff Members (9), Senior Staff (2), Checked In Today, and Pending.
3. Tap **All Attendance**. All roles (Admin, Senior Staff, and Staff) are visible.
4. Filter by role tab: tap **Senior Staff** to view Priya and Nivin's records.
5. Return to the dashboard and tap **Manage Users**.
6. Search by name `"Divya"` or filter by **Admins**. Observe that passwords are never shown.
7. Tap an employee in User Management to inspect their individual attendance history.
8. Test Admin personal check-in/out on the dashboard widget.
9. Sign out.

---

## 9. Technical Notes

### A. Folder Structure & Architectural Organization
```
attendance/
├── src/
│   ├── components/            # Reusable UI component library (cards, buttons, badges, modals, filters)
│   ├── context/               # React Context state management (AppContext & useApp hook)
│   ├── data/                  # Predefined employee records (dummyUsers) and dynamic date seed generator
│   ├── navigation/            # Protected role-based navigation stacks (AppNavigator)
│   ├── screens/               # Screen components organized by role and domain:
│   │   ├── auth/              # Login screen with quick-fill demo chips
│   │   ├── admin/             # Admin Dashboard & User Management screens
│   │   ├── senior/            # Senior Staff Dashboard
│   │   ├── staff/             # Staff direct employee Dashboard
│   │   ├── attendance/        # Team Attendance table & Personal History log
│   │   └── common/            # User Profile and sign-out screen
│   ├── services/              # Pure business logic and I/O services:
│   │   ├── attendanceService.ts # Invariants, validations, check-in/out transitions, concurrency locks
│   │   └── storageService.ts    # AsyncStorage persistence, schema type guards, idempotent seed guard
│   ├── theme/                 # Color tokens, typography, shadows, spacing (Deep Navy & Teal)
│   ├── types/                 # TypeScript interfaces (User, AttendanceRecord, Role, AuthState)
│   └── utils/                 # Date utilities, mockable clock, and RBAC permission selectors
├── tests/                     # Jest unit and integration test suites (35 tests across 5 files)
├── docs/                      # Formal documentation, PDF manual, test cases, and video script
└── recordings/                # Dedicated folder for screen recording video demonstrations
```

### B. State Management Approach
- **React Context API + Custom Hook (`useApp`)**:
  - Chosen over heavyweight external state libraries (Redux Toolkit, MobX, Zustand) to avoid unnecessary bundle overhead, complex slice boilerplate, and runtime indirection.
  - State surface is tightly bounded: active user session (`currentUser`), employee directory (`users`), attendance records (`attendanceRecords`), and derived filtered lists (`enrichedRecords`).
  - **Unidirectional Data Flow**: UI components trigger async actions (`handleCheckIn`, `handleCheckOut`, `login`, `logout`), which strictly persist to `AsyncStorage` first before committing state updates to React.
  - **Performance Optimization**: Expensive data enrichment, search filtering, and KPI aggregations are wrapped with `useMemo` hooks, preventing unnecessary re-renders across sibling screens.

### C. Local Data Storage & Persistence
- **Storage Engine**: `@react-native-async-storage/async-storage` for offline-first asynchronous key-value persistence.
- **Key Schema**:
  - `@attendance_app_session_v1`: Persists the active authenticated session for transparent restoration across app reloads.
  - `@attendance_app_records_v1`: Master ledger of all attendance check-in/out records.
  - `@attendance_app_initialized_v1`: Idempotency guard flag ensuring initial seed data is loaded only on first launch and never overwrites user activity on app restarts.
- **Schema Protection & Corruption Recovery**: All restored storage JSON payloads pass through TypeScript runtime type guards (`isValidAuthUser`, `isValidAttendanceRecord`). Corrupt payloads are safely quarantined without crashing the app.

### D. Permission Logic & Role-Based Access Control (RBAC)
- **Three-Tier Role Hierarchy**:
  - `Admin`: Global oversight, all attendance records, complete user directory with contact info.
  - `Senior Staff`: Restricted supervisor portal. Manages and views **Staff** records only; Admin and fellow Senior Staff records are strictly hidden at both the navigation and data layer.
  - `Staff`: Individual employee portal. Limited strictly to personal attendance check-in/out and personal historical logs.
- **Dual-Layer Enforcement**:
  1. **Navigation Guard Layer (`AppNavigator.tsx`)**: React Navigation conditionally mounts only the authorized screen stack for the active user's role. Unauthorized screens do not exist in the active navigation tree.
  2. **Data Selector Layer (`permissions.ts`)**: Data access functions (`getVisibleAttendanceRecords`, `getVisibleUsers`, `canViewTeamAttendance`) programmatically filter records before they reach the UI, preventing accidental data leakage.

---

## 10. Screen Recording Demonstration

A dedicated directory is available for screen recording demonstrations:
- **Location**: [`recordings/`](recordings/)
- **Step-by-Step Recording Script**: [`docs/Screen_Recording_Checklist.md`](docs/Screen_Recording_Checklist.md)
- **Demonstration Scope**:
  1. Cold start & login using quick-fill chips.
  2. Staff check-in and checkout transitions with live timestamps and duplicate prevention.
  3. Personal attendance history drilldown.
  4. Role-based isolation: Senior Staff portal (Staff-only visibility) vs. Admin portal (universal visibility and user management).
  5. Persistence across app reloads.

---

## 11. Security & Architecture Disclosures

1. **Client-Side Authorization Limitation**:
   This application enforces role-based access control at the client layer through navigation guards and data filtering selectors (`src/utils/permissions.ts`). In an enterprise production deployment, authorization must be validated server-side through authenticated API tokens and backend database row-level security.
2. **Credential Storage**:
   Active user sessions exclude passwords entirely. Demonstrations use hardcoded credentials that serve evaluation purposes only.
3. **Storage Reliability**:
   Storage writes are fully awaited before updating React context state, guarding against race conditions and UI synchronization drift.

---

## 12. Deliverables Summary

- **Runnable Source Code**: Complete React Native & Expo application in `src/`.
- **Automated Tests**: 35 unit and integration tests passing in `tests/`.
- **Technical Notes**: In-depth architecture write-up in `docs/Technical_Notes.md` and main `README.md`.
- **Test Cases Specification**: Traceable test matrix in `docs/Test_Cases.md`.
- **Screen Recording Folder & Checklist**: Folder [`recordings/`](recordings/) with checklist script in [`docs/Screen_Recording_Checklist.md`](docs/Screen_Recording_Checklist.md).
- **Complete PDF Report**: Multi-page formal documentation report located at [`docs/Attendance_Management_App_Documentation.pdf`](docs/Attendance_Management_App_Documentation.pdf).
