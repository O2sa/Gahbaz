# Design Specification: Faculty Gradebook & Continuous Assessment Subsystem

- **Document Version:** 1.0.0
- **Date:** 2026-10-21
- **Status:** Approved Baseline Specification
- **System Area:** Academic Performance & Faculty Gradebook Engine (SIS & LMS)
- **Target Audience:** Backend Engineers, Frontend Engineers, Academic Administrators

---

## 1. Executive Summary & Objectives

In the **Gahbaz** academic platform, course instructors and administrators are responsible for recording and managing continuous assessment scores throughout each operational term. The assessment structure is determined by the course's `gradeSchema` (derived from the catalog `Subject`), typically divided into:
- **Coursework / Assignments (`تكاليف`)**: Maximum 20 points
- **Midterm Exam (`نصفي`)**: Maximum 30 points
- **Final Exam (`نهائي`)**: Maximum 50 points
- **Total (`المجموع`)**: 100 points maximum

### Current Gaps:
1. **Entry Point Missing:** [CourseInfo.jsx](file:///c:/Users/msii/Documents/Gahbaz/client/src/pages/admin/CourseInfo.jsx) does not offer a direct button or navigation link to open the course gradebook (`/courses/:courseId/grades`).
2. **Schema Metadata Disconnect:** When requesting grades for a course, the frontend is not provided with the course's official `gradeSchema` (maximum allowable points per column), preventing client-side clamping and validation.
3. **Legacy Table Vulnerabilities:** [StudentGrades.jsx](file:///c:/Users/msii/Documents/Gahbaz/client/src/pages/admin/StudentGrades.jsx) attempts to read legacy `firstName`/`lastName`, directly accesses `item.avatar` on the grade document rather than `student.avatar`, and crashes when no student records or grades exist.
4. **Lack of Performance Telemetry:** Teachers lack class-wide analytics (class average, pass/fail ratio, highest score, grade distribution).
5. **Student Grade Card Modernization:** The student grade view in [Grades.jsx](file:///c:/Users/msii/Documents/Gahbaz/client/src/pages/student/Grades.jsx) needs official letter grades (`A+`, `A`, `B+`, `B`, `C+`, `C`, `D`, `F`) and clean visual styling.

---

## 2. Standard Institutional Grading Scale

Grades evaluate to standard letter grades based on the calculated percentage score:

| Percentage Range | Letter Grade | Academic Status | Badge Color |
| :--- | :--- | :--- | :--- |
| **95% – 100%** | **A+** (ممتاز مرتفع) | اجتياز بتفوق | `teal` (filled) |
| **90% – 94%** | **A** (ممتاز) | اجتياز بتفوق | `teal` (filled) |
| **85% – 89%** | **B+** (جيد جداً مرتفع) | اجتياز | `blue` (light) |
| **80% – 84%** | **B** (جيد جداً) | اجتياز | `blue` (light) |
| **75% – 79%** | **C+** (جيد مرتفع) | اجتياز | `cyan` (light) |
| **70% – 74%** | **C** (جيد) | اجتياز | `cyan` (light) |
| **65% – 69%** | **D+** (مقبول مرتفع) | اجتياز | `yellow` (light) |
| **60% – 64%** | **D** (مقبول) | اجتياز | `orange` (light) |
| **< 60%** | **F** (راسب) | رسوب | `red` (filled) |

---

## 3. Backend Architecture & API Enhancements

### 3.1 Course Gradebook Endpoint (`GET /api/v1/grades/course/:courseId`)
- Must return an enriched envelope containing:
  - `course`: Course basic info (`_id`, `name`, `code`, `creditHours`, `semester`).
  - `gradeSchema`: Definition of assessment items with their maximum allowable points (e.g. `{ 0: { name: "تكاليف", value: 20 }, 1: { name: "نصفي", value: 30 }, 2: { name: "نهائي", value: 50 } }`, `total: 100`).
  - `grades`: List of student grade records, populated with `student` (`name`, `email`, `avatar`, `phone`).
  - `metrics`:
    - `totalStudents`: Enrolled count.
    - `averageScore`: Mean total score across all students.
    - `passingCount`: Count of students with total >= 60.
    - `failingCount`: Count of students with total < 60.
    - `passingRate`: Percentage of students passing.

### 3.2 Update Grade Endpoint (`PATCH /api/v1/grades/:id`)
- Accepts `{ grade: { "0": { value: 18 }, "1": { value: 27 }, ... } }` or `{ 0: { value: 18 }, ... }`.
- Validates that each item value satisfies `0 <= value <= maxAllowed`.
- Recalculates `total` and `percent`.
- Returns the updated `Grade` document.

---

## 4. Frontend Component Design

### 4.1 Course Info Gradebook Entry Point ([CourseInfo.jsx](file:///c:/Users/msii/Documents/Gahbaz/client/src/pages/admin/CourseInfo.jsx))
In the action button group:
- Add a primary/secondary button:
  ```jsx
  <Button
    component={Link}
    to={`/courses/${courseData._id || courseData.id}/grades`}
    variant="light"
    color="teal"
    size="md"
    radius="md"
    leftIcon={<IconCertificate size={18} />}
  >
    دفتر درجات الطلاب (Gradebook)
  </Button>
  ```

### 4.2 Faculty Gradebook Dashboard ([StudentGrades.jsx](file:///c:/Users/msii/Documents/Gahbaz/client/src/pages/admin/StudentGrades.jsx))
- **Header:** Course title, code, semester, credit hours, and breadcrumbs (`الرئيسية > المقررات > [اسم المقرر] > دفتر الدرجات`).
- **Telemetry Cards Row (4 Cards):**
  1. إجمالي الطلاب المسجلين (`IconUsers`).
  2. متوسط درجات المقرر (`IconChartBar`).
  3. أعلى درجة تم رصدها (`IconTrophy`).
  4. نسبة النجاح في المقرر (`IconPercentage`).
- **Interactive Student Gradebook Table:**
  - Search filter: Filter students by name or email.
  - Columns:
    - **الطالب:** Avatar + Unified Name (`student.name`) + Email.
    - **أعمدة البنود:** Dynamically rendered from `gradeSchema` (e.g. `أعمال السنة /20`, `الامتحان النصفي /30`, `الامتحان النهائي /50`).
    - **المجموع النهائي (Total):** Numeric score out of 100 with progress bar or color badge.
    - **التقدير (Letter Grade):** Badge (`A+`, `B`, `F`, etc.).
    - **إجراءات (Actions):** Edit icon opening an intuitive editing modal with input validation preventing scores > maxValue.
- **Bulk Save & Export:**
  - Single student edit modal with validation and instant TanStack Query invalidation.

### 4.3 Student Grades Page ([Grades.jsx](file:///c:/Users/msii/Documents/Gahbaz/client/src/pages/student/Grades.jsx))
- Organized by Semester accordion/cards.
- Each course displays: Course Name, Code, Credit Hours, Breakdown items (`تكاليف`, `نصفي`, `نهائي`), Total, and Letter Grade Badge.
- Summary at bottom of semester: Total Credit Hours, Term Average Score.
- Direct CTA: "عرض السجل الأكاديمي والمعدل التراكمي" linking to `/transcript`.

---

## 5. Verification & Testing Standards

1. **Unit & Integration Tests (`backend/tests/modules/grades-gradebook.test.js`):**
   - Test retrieving course grades with `gradeSchema` and telemetry metrics.
   - Test updating a grade item within allowed bounds.
   - Test rejection when a grade item exceeds maximum allowed points (e.g., 25 on a 20-point coursework).
   - Test automatic total and percent recalculation.
2. **Frontend Build & UI Smoke Testing:**
   - Run `npm run build` in `client` with 0 errors.
   - Verify seamless navigation from `/courses/:id` to `/courses/:id/grades`.
