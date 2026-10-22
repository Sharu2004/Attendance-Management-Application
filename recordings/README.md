# Screen Recording Demonstration

This directory is reserved for the screen recording demonstration video of the **Attendance Management Application**.

---

## 📹 Video Requirements & Demonstration Scope

The screen recording should be a **3 to 5-minute video** demonstrating the core features across the 3 user roles:

1. **Authentication & Quick-Fill Demo Accounts**:
   - Logging in via the 3 demo chips: **Admin** (`admin@test.com`), **Senior Staff** (`senior@test.com`), and **Staff** (`staff@test.com`).
   - Password show/hide toggle and validation.

2. **Staff Workflow (Direct Employee)**:
   - Initial state: "Not Checked In" with em-dash timestamps (`—`).
   - Tapping **Check In Now**: Real-time status update to "Checked In" with active timestamp.
   - Prevention of duplicate check-in (button dynamically morphs into **Check Out Now**).
   - Tapping **Check Out Now**: Status transitions to "Completed" with completion banner.
   - Opening **Personal History**: Viewing chronological past attendance logs.

3. **Senior Staff Workflow (Team Supervisor)**:
   - Supervisor dashboard with **Staff Team Overview** KPIs.
   - Accessing **Staff Attendance** table.
   - Demonstrating **Role Separation**: Only Staff members appear; Admins and other Senior Staff are strictly excluded.
   - Search by employee name (e.g., `"Karthik"`) and date preset filters (*Yesterday*, *Past 7 Days*).

4. **Admin Workflow (Organization-Wide)**:
   - Organization-wide analytics (Total 12 Employees, 9 Staff, 2 Senior Staff, Check-in counts).
   - Accessing **All Attendance** with role tabs (*All*, *Admin*, *Senior Staff*, *Staff*).
   - Accessing **Manage Users**: 12 Indian/Tamil employee directory with drilldown into full individual history.
   - Verifying passwords are fully excluded from listings.

5. **Offline Persistence & Safe Session Restoration**:
   - Reloading/restarting the app and observing Arjun Kumar's session and completed check-in persist cleanly from `AsyncStorage`.

---

## 📁 How to Upload Your Recording

1. Record your screen on an Android device, Android emulator, or iOS simulator (1080p portrait recommended).
2. Save the video file as `attendance_demo.mp4` (or `.mov` / `.webm`).
3. Place the file inside this directory:
   ```
   recordings/
   ├── README.md
   └── attendance_demo.mp4
   ```
4. *Note on Large Files*: If your video exceeds GitHub's 100 MB file limit, upload it to Google Drive / YouTube (unlisted) and add the share link below:

```markdown
### 🔗 Video Link (Cloud / YouTube)
- **Video URL**: [Add your Google Drive or YouTube link here]
- **Duration**: ~4 minutes
- **Recorded On**: Android Device / Emulator
```

---

> [!TIP]
> A complete, step-by-step cue-by-cue script is provided in [`docs/Screen_Recording_Checklist.md`](../docs/Screen_Recording_Checklist.md).
