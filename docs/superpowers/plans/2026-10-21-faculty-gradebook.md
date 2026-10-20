# Faculty Gradebook & Continuous Assessment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a modern, robust Faculty Gradebook and Continuous Assessment subsystem with class performance telemetry, dynamic assessment columns with strict maximum validation, official letter grades (A+ through F), and direct navigation from course pages.

**Architecture:** Layered Express/Mongoose backend under `backend/src/modules/grades/` returning enriched gradebook envelopes with course `gradeSchema` and class telemetry metrics. React/Mantine frontend with data tables, telemetry cards, and student gradebook editing modals.

**Tech Stack:** Node.js, Express, Mongoose, React 18, Vite, Mantine UI v6, Tabler Icons, TanStack Query v5, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-21-faculty-gradebook-design.md`

## Global Constraints
- Every grade update MUST enforce `0 <= value <= maxAllowed` based on the course's `gradeSchema`.
- Total and percentage scores must be automatically recalculated on every grade update.
- Student display names MUST use the unified `name` field with fallback to `firstName`/`lastName`.
- Client build (`npm run build`) must compile cleanly with zero errors.
- All backend tests (136/136) must remain green.

---

### Task 1: Backend Enriched Gradebook Endpoint & Validation Tests

**Files:**
- Create: `backend/tests/modules/grades-gradebook.test.js`
- Modify: `backend/src/modules/grades/grades.service.js`
- Modify: `backend/src/modules/grades/grades.controller.js`

**Interfaces:**
- Produces: `GET /api/v1/grades/course/:courseId` returning `{ course, gradeSchema, grades, metrics }`
- Produces: `PATCH /api/v1/grades/:id` returning updated `Grade` document

- [x] **Step 1: Write integration tests for enriched gradebook and score validation**

Create `backend/tests/modules/grades-gradebook.test.js`:
```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import User from '../../src/models/User.js';
import Course from '../../src/models/Course.js';
import Grade from '../../src/models/Grade.js';
import Student from '../../src/models/Student.js';
import University from '../../src/models/University.js';
import { createJWT } from '../../src/core/utils/token.utils.js';

describe('Faculty Gradebook & Assessment Service', () => {
  let adminToken;
  let course;
  let student;
  let grade;

  beforeEach(async () => {
    await Grade.deleteMany({});
    await Course.deleteMany({});
    await Student.deleteMany({});
    await User.deleteMany({});
    await University.deleteMany({});

    const university = await University.create({ name: 'جامعة جهبذ' });
    const admin = await User.create({
      name: 'مشرف النظام',
      email: 'admin.grade@test.com',
      password: 'Password123',
      role: 'admin',
      university: university._id,
    });
    adminToken = createJWT({ userId: admin._id, role: 'admin', universityId: university._id });

    student = await Student.create({
      name: 'أحمد محمود العتيبي',
      email: 'ahmed.student@test.com',
      password: 'Password123',
      role: 'student',
      university: university._id,
    });

    course = await Course.create({
      name: 'هياكل البيانات',
      code: 'CS201',
      creditHours: 3,
      university: university._id,
      gradeSchema: {
        total: 100,
        grade: {
          0: { name: 'تكاليف', value: 20 },
          1: { name: 'نصفي', value: 30 },
          2: { name: 'نهائي', value: 50 },
        },
      },
    });

    grade = await Grade.create({
      course: course._id,
      student: student._id,
      grade: {
        0: { name: 'تكاليف', value: 15 },
        1: { name: 'نصفي', value: 25 },
        2: { name: 'نهائي', value: 40 },
      },
      total: 80,
      percent: 80,
    });
  });

  it('GET /api/v1/grades/course/:courseId should return enriched envelope with gradeSchema and metrics', async () => {
    const res = await request(app)
      .get(`/api/v1/grades/course/${course._id}`)
      .set('Cookie', [`token=${adminToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.gradeSchema).toBeDefined();
    expect(res.body.data.metrics.totalStudents).toBe(1);
    expect(res.body.data.metrics.averageScore).toBe(80);
    expect(res.body.data.metrics.passingRate).toBe(100);
    expect(res.body.data.grades.length).toBe(1);
    expect(res.body.data.grades[0].student.name).toBe('أحمد محمود العتيبي');
  });

  it('PATCH /api/v1/grades/:id should reject score exceeding maxValue', async () => {
    const res = await request(app)
      .patch(`/api/v1/grades/${grade._id}`)
      .set('Cookie', [`token=${adminToken}`])
      .send({
        grade: {
          0: { name: 'تكاليف', value: 25 }, // Exceeds max 20
        },
      });

    expect(res.status).toBe(400);
  });

  it('PATCH /api/v1/grades/:id should update valid scores and recalculate total and percent', async () => {
    const res = await request(app)
      .patch(`/api/v1/grades/${grade._id}`)
      .set('Cookie', [`token=${adminToken}`])
      .send({
        grade: {
          0: { name: 'تكاليف', value: 20 },
          1: { name: 'نصفي', value: 30 },
          2: { name: 'نهائي', value: 45 },
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(95);
    expect(res.body.data.percent).toBe(95);
  });
});
```

- [x] **Step 2: Run test to confirm it fails or needs implementation**
  Run: `pnpm test tests/modules/grades-gradebook.test.js`

- [x] **Step 3: Implement enriched service logic in `backend/src/modules/grades/grades.service.js` and `grades.controller.js`**

- [x] **Step 4: Run test to verify it passes**
  Run: `pnpm test tests/modules/grades-gradebook.test.js`
  Expected: PASS (all 3 tests pass)

- [x] **Step 5: Commit Task 1**
  ```bash
  git add backend/src/modules/grades/ backend/tests/modules/grades-gradebook.test.js
  git commit -m "feat(grades): enrich course gradebook endpoint with gradeSchema and telemetry metrics"
  ```

---

### Task 2: Course Info Gradebook Navigation Button

**Files:**
- Modify: `client/src/pages/admin/CourseInfo.jsx:180-200`

**Interfaces:**
- Produces: Navigation button to `/courses/:courseId/grades` with `IconCertificate`

- [x] **Step 1: Update `CourseInfo.jsx`**
  - Add `IconCertificate` to Tabler icons import.
  - In the action buttons row, add:
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

- [x] **Step 2: Verify client build**
  Run: `npm run build` in `client`
  Expected: PASS

- [x] **Step 3: Commit Task 2**
  ```bash
  git add client/src/pages/admin/CourseInfo.jsx
  git commit -m "feat(client): add Gradebook navigation button in CourseInfo"
  ```

---

### Task 3: Modern Faculty Gradebook Table & Telemetry Cards

**Files:**
- Modify: `client/src/pages/admin/StudentGrades.jsx`

**Interfaces:**
- Consumes: `GET /api/v1/grades/course/:courseId` (or `/grades/:courseId`), `PATCH /api/v1/grades/:id`
- Produces: Interactive gradebook with telemetry cards, dynamic assessment columns, and edit modal with score bounds checking.

- [x] **Step 1: Rewrite `client/src/pages/admin/StudentGrades.jsx`**
  - Parse enriched response `{ course, gradeSchema, grades, metrics }` or legacy fallback.
  - Telemetry cards row: Total Students, Class Average, Top Score, Passing Rate.
  - Search filter input for student name or email.
  - Data table:
    - Student avatar, unified name (`student.name`), email.
    - Assessment columns for each item in `gradeSchema` with max values (e.g. `تكاليف (من 20)`).
    - Total score pill / progress bar.
    - Letter grade badge (`A+`, `A`, `B+`, `B`, `C+`, `C`, `D`, `F`).
    - Edit button opening edit modal.
  - Edit Modal:
    - Number inputs for each grade item clamped to `[0, maxValue]`.
    - Real-time preview of new total and letter grade.
    - Save mutation with success notification and query invalidation.

- [x] **Step 2: Verify client build**
  Run: `npm run build` in `client`
  Expected: PASS

- [x] **Step 3: Commit Task 3**
  ```bash
  git add client/src/pages/admin/StudentGrades.jsx
  git commit -m "feat(client): modernize StudentGrades with telemetry cards, schema bounds, and edit modal"
  ```

---

### Task 4: Modernized Student Grades View

**Files:**
- Modify: `client/src/pages/student/Grades.jsx`

**Interfaces:**
- Consumes: `GET /api/v1/grades/student/:studentId`
- Produces: Clean student gradebook organized by semester with letter badges and GPA link.

- [x] **Step 1: Update `client/src/pages/student/Grades.jsx`**
  - Modern Mantine cards per semester.
  - Display course code, name, credit hours, breakdown scores, total, and official letter grade badges.
  - Semester footer with total credit hours and term average.
  - Link to `/transcript`.

- [x] **Step 2: Verify client build**
  Run: `npm run build` in `client`
  Expected: PASS

- [x] **Step 3: Commit Task 4**
  ```bash
  git add client/src/pages/student/Grades.jsx
  git commit -m "feat(client): modernize student Grades view with semester cards and letter badges"
  ```

---

### Task 5: End-to-End Verification

**Files:**
- Full backend suite
- Full frontend build

- [x] **Step 1: Run full backend test suite**
  Run: `pnpm test` in `backend`
  Expected: PASS (136+ tests passing - 139 passed)

- [x] **Step 2: Run client production build**
  Run: `npm run build` in `client`
  Expected: PASS

- [x] **Step 3: Commit and finalize report**
