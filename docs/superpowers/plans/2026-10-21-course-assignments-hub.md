# Course Assignments & Student Submissions Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a modern, fully-featured Course Assignments and Student Submissions Hub allowing faculty to publish homework with deadlines and attachments, grade student solutions with feedback, and students to submit assignments via Wasabi S3 storage with live progress tracking and countdown timers.

**Architecture:** Unified role-adaptive route `/courses/:courseId/assignments` in React 18 / Mantine UI v6 connected to backend endpoints under `/api/v1/assignments`, backed by Mongoose models `Assignment` and `Submission` with multi-tenant university scoping.

**Tech Stack:** Node.js, Express, Mongoose, Vitest, React 18, Vite, Mantine UI v6, Tabler Icons, TanStack Query v5.

**Spec:** `docs/superpowers/specs/2026-10-21-course-assignments-hub-design.md`

## Global Constraints
- Every student submission must auto-flag `status: 'late'` if submitted after `assignment.dueDate`.
- Every awarded score must be strictly clamped between `0 <= grade <= assignment.maxScore`.
- Student display names MUST use the unified `name` field with fallback to `firstName`/`lastName`.
- File uploads for assignments and submissions must use `uploadMedia` supporting direct Wasabi/S3 uploads with local disk fallback.
- Client build (`npm run build`) must compile cleanly with zero errors.
- All backend tests (139/139) must remain green.

---

### Task 1: Backend Student Population Refinement & Integration Tests

**Files:**
- Modify: `backend/src/modules/assignments/assignments.service.js:76-80`
- Modify: `backend/tests/modules/assignments.test.js`

**Interfaces:**
- Produces: `GET /api/v1/assignments/:id/submissions` returning populated `student` with `name`, `firstName`, `lastName`, `email`, and `avatar`.

- [x] **Step 1: Write integration test for student profile population in submissions**

In `backend/tests/modules/assignments.test.js`, add a test case verifying `name` and `avatar` population:
```javascript
it("GET /api/v1/assignments/:id/submissions should populate student name and avatar", async () => {
  const submission = await Submission.create({
    assignment: assignment._id,
    course: course._id,
    student: student._id,
    university: university._id,
    fileUrl: "https://wasabi.test/solution.pdf",
    notes: "حل الواجب كامل",
  });

  const res = await request(app)
    .get(`/api/v1/assignments/${assignment._id}/submissions`)
    .set("Cookie", [`token=${teacherToken}`]);

  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.data.length).toBeGreaterThan(0);
  expect(res.body.data[0].student.name).toBeDefined();
});
```

- [x] **Step 2: Run test to check current behavior**
  Run: `pnpm test tests/modules/assignments.test.js`

- [x] **Step 3: Update `assignments.service.js` to populate unified `name` and `avatar`**

In `backend/src/modules/assignments/assignments.service.js`:
```javascript
export const getAssignmentSubmissionsService = async (assignmentId, universityId = null) => {
  const filter = { assignment: assignmentId };
  if (universityId) filter.university = universityId;
  return Submission.find(filter)
    .populate("student", "name firstName lastName email avatar")
    .sort({ submittedAt: -1 });
};
```

- [x] **Step 4: Run test to verify it passes**
  Run: `pnpm test tests/modules/assignments.test.js`
  Expected: PASS (all tests pass)

- [x] **Step 5: Commit Task 1**
  ```bash
  git add backend/src/modules/assignments/assignments.service.js backend/tests/modules/assignments.test.js
  git commit -m "feat(assignments): populate unified student name and avatar in submissions"
  ```

---

### Task 2: Navigation & Route Registration

**Files:**
- Modify: `client/src/pages/admin/CourseInfo.jsx:185-207`
- Modify: `client/src/routes.jsx`

**Interfaces:**
- Produces: Navigation button in `CourseInfo.jsx` pointing to `/courses/:courseId/assignments`
- Produces: Application route `/courses/:courseId/assignments` rendered by `CourseAssignments`

- [x] **Step 1: Add Assignments button in `CourseInfo.jsx`**

Import `IconFileText` from `@tabler/icons-react` and add to action buttons in `client/src/pages/admin/CourseInfo.jsx`:
```jsx
<Button
  component={Link}
  to={`/courses/${courseData._id || courseData.id}/assignments`}
  variant="light"
  color="indigo"
  size="md"
  radius="md"
  leftIcon={<IconFileText size={18} />}
>
  التكليفات والواجبات (Assignments)
</Button>
```

- [x] **Step 2: Register route in `client/src/routes.jsx`**

Import `CourseAssignments` and add route:
```jsx
{
  path: 'courses/:courseId/assignments',
  name: 'التكليفات والواجبات',
  element: <CourseAssignments queryClient={queryClient} />,
}
```

- [x] **Step 3: Commit Task 2**
  ```bash
  git add client/src/pages/admin/CourseInfo.jsx client/src/routes.jsx
  git commit -m "feat(client): register CourseAssignments route and CourseInfo action button"
  ```

---

### Task 3: Shared Assignment Modals & Components

**Files:**
- Create: `client/src/components/assignments/AssignmentFormModal.jsx`
- Create: `client/src/components/assignments/GradeSubmissionModal.jsx`
- Create: `client/src/components/assignments/SubmissionsDrawer.jsx`
- Create: `client/src/components/assignments/SubmitAssignmentModal.jsx`
- Create: `client/src/components/assignments/index.js`

**Interfaces:**
- `AssignmentFormModal`: props `{ opened, onClose, courseId, assignment, onSuccess }`
- `GradeSubmissionModal`: props `{ opened, onClose, submission, maxScore, onSuccess }`
- `SubmissionsDrawer`: props `{ opened, onClose, assignment, courseId }`
- `SubmitAssignmentModal`: props `{ opened, onClose, assignment, existingSubmission, onSuccess }`

- [x] **Step 1: Create `AssignmentFormModal.jsx`**
  - Form fields: `title`, `description`, `dueDate` (HTML datetime-local or Mantine DatePicker), `maxScore`.
  - File upload dropzone supporting PDF, DOCX, ZIP using `uploadMedia(file, { folder: 'assignments', onProgress })` with progress bar.
  - Handles both create (`POST /api/v1/assignments/course/:courseId`) and edit (`PATCH /api/v1/assignments/:id`).

- [x] **Step 2: Create `GradeSubmissionModal.jsx`**
  - Displays student name, submission timestamp, and late badge if applicable.
  - Number input for `grade` clamped to `0 <= grade <= maxScore`.
  - Textarea for `feedback`.
  - Dispatches `PATCH /api/v1/assignments/submissions/:submissionId/grade`.

- [x] **Step 3: Create `SubmissionsDrawer.jsx`**
  - Mantine Drawer from right side.
  - Fetches `GET /api/v1/assignments/:id/submissions`.
  - Search bar by student name and status filter (`all`, `submitted`, `graded`, `late`).
  - Table showing student avatar, name, submission date, late badge, download button for solution file, current grade, and action button to open `GradeSubmissionModal`.

- [x] **Step 4: Create `SubmitAssignmentModal.jsx`**
  - Student homework submission dialog.
  - File dropzone accepting PDF, DOCX, ZIP, images with live percentage progress bar via `uploadMedia`.
  - Student notes textarea.
  - Dispatches `POST /api/v1/assignments/:id/submissions`.

- [x] **Step 5: Create `client/src/components/assignments/index.js`**
  - Export all 4 modals cleanly.

- [x] **Step 6: Commit Task 3**
  ```bash
  git add client/src/components/assignments/
  git commit -m "feat(client): implement assignment modals, submissions drawer, and upload integration"
  ```

---

### Task 4: Main Course Assignments Hub View

**Files:**
- Create: `client/src/pages/admin/CourseAssignments.jsx`

**Interfaces:**
- Consumes: `GET /api/v1/assignments/course/:courseId`, `GET /api/v1/courses/:courseId`
- Renders: Role-adaptive workspace for Faculty (`teacher`/`admin`) vs Student (`student`)

- [x] **Step 1: Implement `CourseAssignments.jsx`**
  - Detect role via `currentUser = useDashboardContext()?.user || useQuery({ queryKey: ['currentUser'] })`.
  - **Faculty Workspace:**
    - Telemetry cards: Total assignments, pending reviews, class average.
    - Assignment cards: Title, description, due date pill, max score, attachment link, submissions counter (`X / Y submitted`).
    - Action buttons: "استعراض التسليمات والتصحيح" (opens `SubmissionsDrawer`), "تعديل" (opens `AssignmentFormModal`), "حذف" (with confirmation).
  - **Student Workspace:**
    - Summary stat cards: Submitted, pending, points earned.
    - Filter tabs: Active, Submitted, Past Due.
    - Assignment cards: Due date countdown pill (`متبقي X أيام`, `ينتهي اليوم`, `انتهى الموعد`), teacher instructions file download.
    - Status badge: `لم يتم التسليم` / `تم التسليم` / `تم التقييم (18/20)`.
    - Submit button opening `SubmitAssignmentModal`.
    - Graded feedback callout showing score, percentage bar, and instructor comments.

- [x] **Step 2: Verify client build**
  Run: `npm run build` in `client`
  Expected: PASS

- [x] **Step 3: Commit Task 4**
  ```bash
  git add client/src/pages/admin/CourseAssignments.jsx
  git commit -m "feat(client): implement CourseAssignments hub page for faculty and students"
  ```

---

### Task 5: End-to-End Verification & Documentation

**Files:**
- Full backend suite
- Full frontend build

- [x] **Step 1: Run full backend test suite**
  Run: `pnpm test` in `backend`
  Expected: PASS (139/139 passed)

- [x] **Step 2: Run client production build**
  Run: `npm run build` in `client`
  Expected: PASS

- [x] **Step 3: Commit and update plan status**
