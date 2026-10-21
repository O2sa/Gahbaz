# Student Self-Service Course Enrollment & Add/Drop Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build a comprehensive, modern student self-service Add/Drop portal with live credit limits (12–19 hrs), prerequisite validation, search/filtering, course syllabus preview drawer, drop confirmation modal, and direct sidebar navigation.

**Architecture:** Frontend React/Mantine UI architecture with TanStack Query v5 consuming `/api/v1/enrollment` endpoints, modularized enrollment dialogs (`CoursePreviewDrawer`, `ConfirmDropModal`), and unified student navigation in `AppNavbar.jsx`.

**Tech Stack:** React 18, Vite, Mantine UI v6, Tabler Icons, TanStack Query v5, Express, Mongoose, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-21-student-enrollment-portal-design.md`

## Global Constraints
- Registration credit limits strictly enforced: Minimum 12 credit hours, Maximum 19 credit hours.
- Prerequisite check requires `percent >= 60` or completed grade in prerequisite subjects.
- Add/Drop mutations must be disallowed when `isAddDropOpen === false`.
- Arabic RTL interface with clean Dark/Light theme adaptability.
- All backend unit/integration tests must remain 100% green (136/136 tests passing).

---

### Task 1: Student Navigation Bar Integration

**Files:**
- Modify: `client/src/layouts/AppNavbar.jsx:260-290`

**Interfaces:**
- Consumes: `IconArrowsExchange`, `IconReportAnalytics` from `@tabler/icons-react`
- Produces: Sidebar links to `/enrollment` ("بوابة الحذف والإضافة") and `/transcript` ("السجل الأكاديمي") for users with `role === "student"`

- [x] **Step 1: Update `client/src/layouts/AppNavbar.jsx`**
  - Add icons import: `IconArrowsExchange`, `IconReportAnalytics`.
  - In the `{isStudent && (...)}` block, add navigation links for:
    - `بوابة الحذف والإضافة` pointing to `/enrollment`.
    - `السجل الأكاديمي` pointing to `/transcript`.
    - Rename section header to `الأكاديميا والتسجيل`.

- [x] **Step 2: Test client build**
  Run: `npm run build` in `client`
  Expected: PASS

- [x] **Step 3: Commit**
  ```bash
  git add client/src/layouts/AppNavbar.jsx
  git commit -m "feat(client): add enrollment and transcript links to student sidebar"
  ```

---

### Task 2: Course Details Preview Drawer Component

**Files:**
- Create: `client/src/components/enrollment/CoursePreviewDrawer.jsx`
- Modify: `client/src/components/enrollment/index.js` (if needed)

**Interfaces:**
- Consumes: Mantine `Drawer`, `Badge`, `Avatar`, `Button`, `Timeline`, `Paper`, Tabler Icons
- Produces: `<CoursePreviewDrawer opened={Boolean(previewCourse)} onClose={...} course={previewCourse} onRegister={...} isAddDropOpen={...} canAddCredits={...} />`

- [x] **Step 1: Create `client/src/components/enrollment/CoursePreviewDrawer.jsx`**
  - Displays course name, code, credit hours badge, college/department.
  - Displays instructors with avatars and names.
  - Displays description text and `willLearn` checklist items.
  - Displays prerequisite requirements and current student eligibility status.
  - Action button: "تسجيل في هذا المقرر" with disabled state if ineligible.

- [x] **Step 2: Verify client build**
  Run: `npm run build` in `client`
  Expected: PASS

- [x] **Step 3: Commit**
  ```bash
  git add client/src/components/enrollment/CoursePreviewDrawer.jsx
  git commit -m "feat(client): create CoursePreviewDrawer for syllabus and instructor inspection"
  ```

---

### Task 3: Drop Course Confirmation Modal Component

**Files:**
- Create: `client/src/components/enrollment/ConfirmDropModal.jsx`

**Interfaces:**
- Consumes: Mantine `Modal`, `Alert`, `Button`, `Group`, `Stack`, `Text`, `Badge`
- Produces: `<ConfirmDropModal opened={Boolean(dropCourseTarget)} onClose={...} onConfirm={...} course={dropCourseTarget} currentCredits={...} minCredits={12} isLoading={...} />`

- [x] **Step 1: Create `client/src/components/enrollment/ConfirmDropModal.jsx`**
  - Clear Arabic title: "تأكيد حذف المقرر الدراسي".
  - Shows warning: "هل أنت متأكد من رغبتك في حذف مقرر [{course.name}] من جدولك الدراسي لهذا الفصل؟".
  - Visual breakdown:
    - الساعات المسجلة حالياً: `currentCredits` ساعة.
    - الساعات بعد الحذف: `currentCredits - courseCredits` ساعة.
    - الحد الأدنى المسموح: `12` ساعة معتمدة.
  - Warning banner if remaining hours approach 12 hours.
  - Red confirm button "تأكيد الحذف" with loading spinner and "إلغاء" button.

- [x] **Step 2: Verify client build**
  Run: `npm run build` in `client`
  Expected: PASS

- [x] **Step 3: Commit**
  ```bash
  git add client/src/components/enrollment/ConfirmDropModal.jsx
  git commit -m "feat(client): create ConfirmDropModal with credit calculations and safeguards"
  ```

---

### Task 4: Modernize & Enhance Course Registration Page

**Files:**
- Modify: `client/src/pages/student/CourseRegistration.jsx`

**Interfaces:**
- Consumes: `CoursePreviewDrawer`, `ConfirmDropModal`, TanStack Query hooks for `/enrollment/available-courses`, `/enrollment/register`, `/enrollment/drop`
- Produces: High-grade interactive registration dashboard with search, "Eligible Only" switch, credit gauge, and modals.

- [x] **Step 1: Update `client/src/pages/student/CourseRegistration.jsx`**
  - Add search input for course name and code.
  - Add switch for `eligibleOnly` ("المؤهل لها فقط").
  - Add state for `previewCourse` and `dropTarget`.
  - Connect `CoursePreviewDrawer` and `ConfirmDropModal`.
  - Apply sleek modern Mantine styling with dark mode support.
  - Display instructor names and prerequisite warning cards.
  - Ensure notifications trigger accurately on register/drop success or error.

- [x] **Step 2: Verify client build**
  Run: `npm run build` in `client`
  Expected: PASS

- [x] **Step 3: Commit**
  ```bash
  git add client/src/pages/student/CourseRegistration.jsx
  git commit -m "feat(client): modernize CourseRegistration page with search, filters, drawer, and drop safeguards"
  ```

---

### Task 5: End-to-End Verification

**Files:**
- Backend test: `backend/tests/modules/enrollment.test.js`
- Full backend suite
- Frontend production build

- [x] **Step 1: Run enrollment integration tests**
  Run: `pnpm test tests/modules/enrollment.test.js` in `backend`
  Expected: PASS (all 7 tests pass)

- [x] **Step 2: Run full backend test suite**
  Run: `pnpm test` in `backend`
  Expected: PASS (136 tests passing)

- [x] **Step 3: Run client production build**
  Run: `npm run build` in `client`
  Expected: PASS

- [x] **Step 4: Commit and finalize report**
  ```bash
  git add -A
  git commit -m "chore: complete student enrollment portal end-to-end verification"
  ```
