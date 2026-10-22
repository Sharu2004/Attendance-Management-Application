# Screen Recording Demonstration Checklist (3–5 Minutes)

This checklist provides a structured, step-by-step video script for presenting and recording the Attendance Management Mobile Application on an Android device/emulator or iOS simulator.

---

## Preparation & Prerequisites

- [ ] Ensure the application is running via `npx expo start` and opened in the Expo Go client or simulator.
- [ ] Configure screen recording resolution to 1080p (portrait orientation).
- [ ] Ensure local audio/microphone levels are set for clear voiceover.
- [ ] Target duration: **3 to 5 minutes**.

---

## Demonstration Script & Timeline

### Segment 1: Application Launch & Cold Start (0:00 – 0:30)
- [ ] **Action**: Launch the application from an initial cold start.
- [ ] **Observe**:
  - Deep Navy branded splash background (`#0F2744`).
  - Brief loading spinner displaying `"Initializing attendance system..."`.
  - App opens directly on the **Sign In** screen.
- [ ] **Narrate**:
  - Introduce the application name: **Attendance Management App**.
  - Highlight modern mobile design: Navy primary palette, white card surfaces, Tamil/Indian workforce profile.
  - Point out the 3 demonstration quick-fill account chips at the bottom (**Admin**, **Senior Staff**, **Staff**).

---

### Segment 2: Admin Workflow & Oversight (0:30 – 1:30)
- [ ] **Action**: Tap the **Admin** quick-fill chip (`admin@test.com` / `Admin@123`).
- [ ] **Action**: Toggle the password visibility icon to demonstrate show/hide functionality.
- [ ] **Action**: Tap **Log In**.
- [ ] **Observe Admin Dashboard**:
  - Welcome card greeting: `"Welcome back, Ram Kumar"`.
  - Dynamic KPI Summary Cards:
    - *Total Employees*: `12`
    - *Staff Members*: `9`
    - *Senior Staff*: `2`
    - *Checked In Today*: e.g. `5`
    - *Not Checked In Today*: e.g. `7`
  - Recent Attendance Activity table showing records from multiple roles.
- [ ] **Action**: Tap **All Attendance** (Team Attendance).
- [ ] **Demonstrate Search & Filters**:
  - Point out that records include all roles (Admin, Senior Staff, and Staff).
  - Type `"kumar"` into the Search Bar: observe real-time filtering to Ram Kumar, Arjun Kumar, and Vijay Kumar.
  - Clear the search bar with the `(x)` clear button.
  - Tap the **Yesterday** date filter chip: notice records immediately filter to yesterday's logs.
  - Tap the **Senior Staff** role tab: observe only Nivin Pauly and Priya Lakshmi appear.
  - Tap **Reset**: all filters restore to default.
- [ ] **Action**: Return to Admin Console and tap **Manage Users**.
- [ ] **Observe User Management Screen**:
  - 12 Indian/Tamil employees listed with ID, department, contact number, and color-coded role badges.
  - Verify that no plaintext passwords appear anywhere on the cards.
  - Tap **Divya Shree** to view her complete attendance history drilldown.
- [ ] **Action**: Navigate to Profile, tap **Sign Out**, and confirm in the **Logout Confirmation Modal**.
- [ ] **Observe**: Navigation stack resets completely back to the Login screen.

---

### Segment 3: Senior Staff Workflow & Team Isolation (1:30 – 2:30)
- [ ] **Action**: Tap the **Senior Staff** quick-fill chip (`senior@test.com` / `Senior@123`) and log in.
- [ ] **Observe Senior Staff Dashboard**:
  - Welcome greeting: `"Welcome, Nivin Pauly"`.
  - KPI summary strictly reflects **Staff Team Overview** (never includes Admin or other Senior Staff).
  - Recent activity table displays **Staff Activity** only.
- [ ] **Action**: Tap **Staff Attendance** navigation card.
- [ ] **Observe Role-Based Security**:
  - Verify that Ram Kumar (Admin) and Priya Lakshmi (Senior Staff) **do not appear** in the list.
  - Explain that data selectors strictly prune non-Staff records at the business logic layer.
- [ ] **Demonstrate Search**:
  - Search for `"Karthik"`: Karthik Raj appears with status **Checked In**.
  - Tap Karthik's card to view his personal historical attendance log.
- [ ] **Action**: Test Senior Staff personal attendance widget on the dashboard (or view personal history).
- [ ] **Action**: Tap the header sign-out icon, confirm in the modal, and return to the Login screen.

---

### Segment 4: Staff Workflow, Check-In & Validation (2:30 – 3:45)
- [ ] **Action**: Tap the **Staff** quick-fill chip (`staff@test.com` / `Staff@123`) and log in.
- [ ] **Observe Staff Dashboard**:
  - Greets **Arjun Kumar** (Mobile Engineering).
  - Today's Status card displays **Not Checked In** (grey badge).
  - Both Check-In and Check-Out times show em dash (`—`).
- [ ] **Action**: Tap **Check In Now**.
- [ ] **Observe**:
  - Activity indicator spins briefly.
  - Green success banner appears: `"Check-in recorded successfully!"`.
  - Status badge immediately switches to **Checked In** (Amber badge).
  - Check-in timestamp populates with current local time (e.g. `11:45 AM`).
  - Button dynamically updates to **Check Out Now** (Green variant).
- [ ] **Demonstrate Duplicate Prevention**:
  - Explain that the system prohibits duplicate check-ins for the same calendar date.
- [ ] **Action**: Tap **Check Out Now**.
- [ ] **Observe**:
  - Status updates immediately to **Completed** (Green badge).
  - Check-out timestamp displays current time.
  - A celebratory completion banner displays: `"Attendance completed for today. Great work!"`.
- [ ] **Action**: Tap **View My Complete Attendance Log**.
- [ ] **Observe**:
  - Arjun Kumar's personal history shows today's completed session at the top (latest-first).
  - Past records from yesterday, 2 days ago, and 3 days ago are listed with their respective timestamps.
- [ ] **Demonstrate Restricted Navigation**:
  - Point out that Staff has no buttons or routes for Team Attendance, User Management, or Admin/Senior dashboards.

---

### Segment 5: Persistence Across App Restart & Conclusion (3:45 – 4:30)
- [ ] **Action**: Force-close the application (or reload the bundle in Expo).
- [ ] **Action**: Re-open the application.
- [ ] **Observe**:
  - App restores Arjun Kumar's active session automatically from AsyncStorage without prompting to re-login.
  - The Staff dashboard shows today's status preserved as **Completed** with both timestamps intact.
  - Historical records remain accurately persisted.
- [ ] **Action**: Navigate to Profile and tap **Sign Out of Application**.
- [ ] **Summary & Conclusion**:
  - Summarize that all requirements have been satisfied: 3 roles, Indian/Tamil employee records, dynamic relative dates, strict one-record-per-day validation, search and date filtering, responsive UI, 35 passing automated tests, and offline persistence.
