# Design Specification: Student Self-Service Course Enrollment & Add/Drop Portal

- **Document Version:** 1.0.0
- **Date:** 2026-10-21
- **Status:** Approved Baseline Specification
- **System Area:** Student Academic Portal & Registration Lifecycle (SIS & LMS)
- **Target Audience:** Frontend Engineers, Backend Engineers, QA Testers

---

## 1. Executive Summary & Problem Statement

In the **Gahbaz** academic platform, course allocation is primarily major-driven and automated upon semester launch. However, during the operational term startup, students require a self-service **Add/Drop Portal** to:
1. Adjust their course workload between institutional limits (**Minimum 12 credits, Maximum 19 credits**).
2. Register for elective courses or retakes, provided all academic prerequisites are satisfied.
3. Drop courses safely with clear visibility of the impact on their registered credit hours.
4. Preview course descriptions, assigned professors, and syllabus outlines before deciding to enroll.

### Current Deficiencies:
- **Navigation Disconnect:** The student navigation bar (`AppNavbar.jsx`) lacks direct links to "بوابة الحذف والإضافة" (`/enrollment`) and "السجل الأكاديمي" (`/transcript`).
- **Search & Discovery Gap:** The current `CourseRegistration.jsx` lists courses without search by course code/name and lacks an "Eligible Only" toggle filter.
- **Accidental Drop Risk:** Clicking "حذف المقرر" immediately dispatches the mutation without a confirmation dialog explaining the credit hour drop impact.
- **Missing Course Details Preview:** Students cannot inspect syllabus content, learning objectives, or instructor information before registering.

---

## 2. User Experience & Component Architecture

### 2.1 Navigation Integration (`AppNavbar.jsx`)
In the student section of `client/src/layouts/AppNavbar.jsx`, add two dedicated navigation items:
1. **بوابة الحذف والإضافة (`/enrollment`)**:
   - Icon: `IconArrowsExchange` / `IconCalendarTime`
   - Active indicator when on `/enrollment`.
2. **السجل الأكاديمي (`/transcript`)**:
   - Icon: `IconReportAnalytics` / `IconCertificate`
   - Active indicator when on `/transcript`.

```javascript
{isStudent && (
  <>
    <Divider my="xs" color={isDark ? 'dark.5' : 'gray.2'} />
    <Box mb="xs">
      <Text size="xs" weight={700} color={isDark ? 'gray.5' : 'dimmed'} px="xs" mb={6}>
        الأكاديميا والتسجيل
      </Text>
      <NavLink label="مقرراتي الدراسية" icon={<IconBook size={19} />} to="/courses" ... />
      <NavLink label="بوابة الحذف والإضافة" icon={<IconArrowsExchange size={19} />} to="/enrollment" ... />
      <NavLink label="سجل الدرجات" icon={<IconCertificate size={19} />} to="/grades" ... />
      <NavLink label="السجل الأكاديمي" icon={<IconReportAnalytics size={19} />} to="/transcript" ... />
    </Box>
  </>
)}
```

---

### 2.2 Semester Credit Hours & Status Gauge

At the top of `CourseRegistration.jsx`:
- **Semester Information Card:**
  - Active semester name (`semester.name`).
  - Add/Drop deadline indicator with countdown or status badge:
    - If `isAddDropOpen`: Green badge "فترة التسجيل والحذف نشطة" with date.
    - If closed: Gray badge "فترة الحذف والإضافة مغلقة".
- **Dynamic Credit Hours Gauge:**
  - Displays registered hours out of institutional maximum: `currentCreditHours / 19`.
  - Color-coded progress bar:
    - `< 12`: Orange with warning banner ("تنبيه: يجب تسجيل ما لا يقل عن 12 ساعة معتمدة لتثبيت الفصل").
    - `12 - 19`: Teal / Brand with success banner.
    - `> 19`: Red with alert (exceeds maximum allowed load).
  - Informational pill displaying: `الحد الأدنى: 12 ساعة | الحد الأقصى: 19 ساعة`.

---

### 2.3 Available Courses Tab (`available`)

- **Interactive Filter Toolbar:**
  - Search input: matches course title or course code (e.g., `CS101`, `حاسب`).
  - Switch/Toggle: "المؤهل لها فقط" (`eligibleOnly`), filtering out courses with unfulfilled prerequisites or exceeding credit limits.
  - Credit hours filter: All, 2 Hours, 3 Hours, 4+ Hours.
- **Enhanced Course Cards:**
  - Modern Mantine card styling with subtle elevation and dark/light mode borders.
  - Badges: Credit hours (`3 ساعات معتمدة`), Department/College, Eligibility dot (`مؤهل للتسجيل` in teal / `متطلب غير مكتمل` in red).
  - Instructor avatars and names.
  - Prerequisite Warning Box: clearly specifies which prerequisite courses must be completed and passed before registration is permitted.
  - Action Buttons:
    - `تفاصيل المقرر`: Opens the Course Preview Drawer.
    - `تسجيل في المقرر`: Dispatches `POST /api/v1/enrollment/register`. Disabled if not eligible or if Add/Drop window is closed, with tooltip explanation.

---

### 2.4 Course Details Preview Drawer

A responsive Mantine `Drawer` (or `Modal`) sliding from the right:
- Course name, code, credit hours, and cover image (if available).
- Instructor profile: avatar, full name, and academic title.
- Course Description & Summary.
- "ماذا ستتعلم في هذا المقرر" (`willLearn` bullet points).
- Syllabus preview: list of course sections and lesson topics.
- Direct "تسجيل الآن في هذا المقرر" CTA button at the bottom of the drawer if eligible.

---

### 2.5 Enrolled Courses Tab (`enrolled`) & Drop Confirmation Modal

- Displays all currently registered courses for the active term.
- Course code, title, credit hours, instructor, and schedule/sections count.
- Action: "حذف المقرر (Drop)" button:
  - Disabled if `isAddDropOpen === false`.
  - Disabled if dropping the course would cause `currentCreditHours - course.creditHours < 12` with explanatory tooltip ("لا يمكن الحذف لأن إجمالي ساعاتك ستصبح أقل من الحد الأدنى 12 ساعة").
- **Drop Confirmation Modal (`ConfirmDropModal`):**
  - Warns the student clearly:
    - "هل أنت متأكد من رغبتك في حذف المقرر [اسم المقرر]؟"
    - "إجمالي الساعات الحالي: **{currentCreditHours}** ساعة."
    - "إجمالي الساعات بعد الحذف: **{currentCreditHours - courseCredits}** ساعة."
    - Reminder: "سيتم إزالة المقرر من جدولك وقناة المحادثات الأكاديمية فوراً."
  - Buttons: "تأكيد الحذف" (Red button with loading indicator) and "إلغاء".

---

## 3. Backend Contracts & Business Rules

All endpoints reside under `/api/v1/enrollment` and are protected by `authGuard` and `requireRoles("student", "admin", "super-admin")`.

| Method | Endpoint | Description | Business Rules & Invariants |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/enrollment/available-courses` | Fetches active semester courses for student | Evaluates prerequisites (`Grade.percent >= 60`), calculates current credits, returns eligibility flags. |
| `POST` | `/api/v1/enrollment/register` | Registers student in a course | Enforces `isAddDropOpen`, checks prerequisites, validates `newCredits <= 19`, creates `Grade`, updates course student roster, synchronizes chat room. |
| `POST` | `/api/v1/enrollment/drop` | Drops a registered course | Enforces `isAddDropOpen`, validates `remainingCredits >= 12`, removes from course students and grades, updates chat room roster. |
| `GET` | `/api/v1/enrollment/my-courses` | Lists enrolled courses | Scoped to student and active semester. |

---

## 4. Verification & Testing Plan

1. **Backend Integration Tests:**
   - Execute: `pnpm test tests/modules/enrollment.test.js`
   - Verify all 7 tests pass:
     - Course discovery with prerequisite checking.
     - Successful registration with credit recalculation.
     - Rejection when exceeding 19 credit hours.
     - Rejection when prerequisites are missing.
     - Successful drop with credit recalculation.
     - Rejection when dropping drops hours below 12.
     - Rejection when Add/Drop window is closed.
2. **Frontend Build & UI Smoke Testing:**
   - Execute: `npm run build` in `client` to ensure zero compilation or JSX errors.
   - Verify navigation links in `AppNavbar.jsx` route cleanly to `/enrollment` and `/transcript`.
   - Verify search, filtering, drawer preview, and drop confirmation modal behavior.
