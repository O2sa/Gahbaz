# Design Specification: Course Assignments & Student Submissions Hub

- **Document Version:** 1.0.0
- **Date:** 2026-10-21
- **Status:** Approved Baseline Specification
- **System Area:** Academic Course Management & Student Submissions (LMS)
- **Target Audience:** Frontend Engineers, Backend Engineers, QA Testers

---

## 1. Executive Summary & Problem Statement

In an academic Learning Management System (LMS), continuous coursework assessments rely heavily on structured assignments, project milestones, and student homework submissions.

While the **Gahbaz** backend currently has foundational models (`Assignment.js`, `Submission.js`) and RESTful endpoints under `/api/v1/assignments`, the user-facing client currently lacks:
1. **Faculty Management UI:** No interface for professors to create, edit, or delete assignments with due dates, maximum scores, and attached instruction documents.
2. **Submissions Grading Roster:** No drawer/table for instructors to inspect submitted student files, detect late submissions, assign scores within max boundaries, and deliver actionable pedagogical feedback.
3. **Student Homework Portal:** No student workspace to observe upcoming deadlines with countdown timers, download instructor briefs, upload homework files (PDF, DOCX, ZIP) with live progress tracking, and view awarded grades/remarks.
4. **Course Integration:** No direct navigation button from the main course hub (`CourseInfo.jsx`) or registered route in `routes.jsx`.

This specification formalizes the design of the **Course Assignments & Student Submissions Hub** under the route `/courses/:courseId/assignments`.

---

## 2. System Architecture & Role-Based Workspaces

The hub resides at a single unified route: `/courses/:courseId/assignments`, adapting its presentation dynamically based on `currentUser.role`:
- **Faculty / Admin Workspace (`role: "teacher" | "admin" | "super-admin"`):** Focuses on assignment publishing, telemetry, submission review, and grading.
- **Student Workspace (`role: "student"`):** Focuses on homework discovery, deadline awareness, submission uploads via Wasabi S3 storage, and feedback review.

```
+-----------------------------------------------------------------------------------+
|                        /courses/:courseId/assignments                             |
+-----------------------------------------------------------------------------------+
                                   |
             +---------------------+---------------------+
             |                                           |
      (Faculty / Admin)                              (Student)
             v                                           v
+---------------------------+               +---------------------------+
| 1. Class Telemetry Cards  |               | 1. Student Summary Cards  |
| 2. "Create Assignment"    |               | 2. Tabbed Filter: Active, |
| 3. Assignment Cards List  |               |    Submitted, Past Due    |
| 4. Submissions Drawer &   |               | 3. Countdown Timers       |
|    Grading Feedback Modal |               | 4. Solution Upload Modal  |
+---------------------------+               +---------------------------+
```

---

## 3. API Contracts & Backend Enhancements

### 3.1 Existing Backend Endpoints (`/api/v1/assignments`)
All endpoints enforce university tenant isolation (`university: req.user.universityId`) and role-based access control:

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/assignments/course/:courseId` | `student`, `teacher`, `admin`, `super-admin` | Lists course assignments with pagination (`page`, `limit`). |
| `POST` | `/api/v1/assignments/course/:courseId` | `teacher`, `admin`, `super-admin` | Creates an assignment (`title`, `description`, `dueDate`, `maxScore`, `fileUrl`). |
| `GET` | `/api/v1/assignments/:id` | `student`, `teacher`, `admin`, `super-admin` | Fetches a single assignment by ID. |
| `PATCH` | `/api/v1/assignments/:id` | `teacher`, `admin`, `super-admin` | Updates assignment details or extends deadline. |
| `DELETE` | `/api/v1/assignments/:id` | `teacher`, `admin`, `super-admin` | Deletes assignment and cascade-deletes associated submissions. |
| `GET` | `/api/v1/assignments/:id/submissions` | `teacher`, `admin`, `super-admin` | Fetches all student submissions for an assignment. |
| `POST` | `/api/v1/assignments/:id/submissions` | `student` | Submits student homework (`fileUrl`, `notes`). Auto-sets status to `late` if past `dueDate`. |
| `GET` | `/api/v1/assignments/:id/my-submission` | `student` | Fetches current student's submission, score, and teacher feedback. |
| `PATCH` | `/api/v1/assignments/submissions/:submissionId/grade` | `teacher`, `admin`, `super-admin` | Grades a submission (`grade`, `feedback`). |

### 3.2 Backend Service Refinement
To align with the platform's unified user profile conventions, `assignments.service.js` will update its student population query:
```javascript
// backend/src/modules/assignments/assignments.service.js
export const getAssignmentSubmissionsService = async (assignmentId, universityId = null) => {
  const filter = { assignment: assignmentId };
  if (universityId) filter.university = universityId;
  return Submission.find(filter)
    .populate("student", "name firstName lastName email avatar")
    .sort({ submittedAt: -1 });
};
```

---

## 4. Frontend Component Design: Faculty Workspace

### 4.1 Telemetry Header & Actions
- **Metric Cards (4-Grid):**
  1. **إجمالي التكليفات (Total Assignments):** Count of published assignments in the course.
  2. **بانتظار التقييم (Pending Submissions):** Count of submissions with `status: 'submitted'` or `status: 'late'` that have not yet been graded.
  3. **نسبة تسليم الشعبة (Submission Rate):** Percentage of enrolled students who have submitted work.
  4. **متوسط الدرجات (Average Score):** Class mean score across all graded assignments.
- **Primary Action Button:**
  - `إضافة تكليف جديد (Create Assignment)` with `IconPlus`, opening the creation modal.

### 4.2 Assignment Card (Faculty View)
- Assignment title (`title`) and detailed instructions (`description`).
- Due Date with relative calendar badge (e.g., `ينتهي: 28 أكتوبر 2026`).
- Max Points badge (e.g., `الدرجة العظمى: 20 درجة`).
- Attached instruction file button (if `fileUrl` exists) linking to download/view the prompt document.
- Submission tracker pill: e.g. `24 / 30 طالب سلّموا الواجب` with progress mini-bar.
- Actions:
  - `استعراض التسليمات ورصد الدرجات`: Opens the Submissions Drawer.
  - `تعديل`: Opens edit modal.
  - `حذف`: Triggers deletion confirmation modal.

### 4.3 Create / Edit Assignment Modal (`AssignmentFormModal`)
- **Fields:**
  - `title`: TextInput (required, 2-200 chars).
  - `dueDate`: DateTime / DatePicker input (required, must be future or valid date).
  - `maxScore`: NumberInput (required, min: 1, default: 20 or 100).
  - `description`: Textarea for assignment instructions and guidelines.
  - `fileUrl`: Integrated file dropzone powered by `uploadMedia(file, { folder: 'assignments' })` with progress bar.

### 4.4 Submissions Slide-Over Drawer (`SubmissionsDrawer`)
- Opens smoothly from the right side without navigating away from the assignment list.
- **Header:** Displays assignment title, max points, and filter toolbar (search by student name/email, filter by status: All, Graded, Pending, Late).
- **Submissions Table:**
  - **الطالب (Student):** Avatar, unified name (`name` with fallback to `firstName lastName`), email.
  - **توقيت التسليم (Submitted At):** Exact date & time + badge:
    - `في الموعد (On Time)`: Green badge.
    - `متأخر (Late)`: Red badge indicating late submission.
  - **ملف الحل (Attachment):** Clickable button with icon to download/preview the student's file.
  - **ملاحظات الطالب (Notes):** Tooltip or expandable text with student remarks.
  - **الدرجة (Grade):** e.g., `18 / 20` or badge `بانتظار الرصد`.
  - **الإجراء (Action):** "تصحيح / رصد الدرجة" button opening the grading modal.

### 4.5 Grading Action Modal (`GradeSubmissionModal`)
- Input for `grade`: NumberInput strictly clamped to `0 <= grade <= assignment.maxScore`.
- Input for `feedback`: Textarea for pedagogical commentary and correction notes.
- Mutations invoke `PATCH /api/v1/assignments/submissions/:submissionId/grade`.
- Real-time toast notification and TanStack Query cache invalidation.

---

## 5. Frontend Component Design: Student Workspace

### 5.1 Student Summary Header
- **Stat Cards (3-Grid):**
  1. **الواجبات المنجزة:** Count of assignments submitted.
  2. **بانتظار التسليم:** Count of active assignments not yet submitted.
  3. **النقاط المحصلة:** Total points earned out of total graded points.
- **Status Filter Tabs:**
  - `التكليفات الحالية والنشطة (Active)`
  - `المسلمة والمقيمة (Submitted / Graded)`
  - `المنتهية (Past Due)`

### 5.2 Assignment Card (Student View)
- Course name and code.
- Title and description.
- Teacher prompt attachment button (if instructor provided a reference file).
- **Deadline Countdown Pill:**
  - `متبقي X أيام / ساعات`: Teal/Green indicator.
  - `ينتهي اليوم`: Orange warning indicator.
  - `انتهى موعد التسليم`: Red badge with notice that submission will be flagged as late.
- **Student Status Badge:**
  - `لم يتم التسليم`: Red/Gray badge.
  - `تم التسليم - قيد التصحيح`: Blue badge with submission timestamp.
  - `تم التقييم`: Green badge displaying awarded score (e.g. `18 / 20 (90%)`).
- **Submission Action:**
  - "تسليم الواجب" button opening the submission modal (or "إعادة التسليم" if allowed).

### 5.3 Submit Assignment Modal (`SubmitAssignmentModal`)
- Drag-and-drop file upload zone accepting PDF, DOCX, ZIP, PNG, JPG up to 50MB.
- Real-time progress bar powered by `uploadMedia(file, { folder: 'assignments', onProgress })`.
- Optional `notes` textarea for student comments to the professor.
- Submit button with loading spinner, dispatches `POST /api/v1/assignments/:id/submissions`.

### 5.4 Graded Feedback Card
- If the assignment has been graded by the instructor:
  - Displays the final score and grade percentage pill.
  - Evaluator notes callout box showing instructor feedback.
  - Download link to student's original submission.

---

## 6. Navigation, Routing & Integration

1. **Course Action Button (`CourseInfo.jsx`):**
   - Add an action button in the action row of `client/src/pages/admin/CourseInfo.jsx`:
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
2. **Application Route (`routes.jsx`):**
   - Register the route:
     ```jsx
     {
       path: 'courses/:courseId/assignments',
       name: 'التكليفات والواجبات',
       element: <CourseAssignments queryClient={queryClient} />,
     }
     ```
3. **Common Course Tab Integration (`TabsLinks.jsx`):**
   - Add an `assignments` tab item to the shared course tabs bar if enabled.

---

## 7. Data Invariants & Error Handling

- **University Isolation:** Every operational query and mutation MUST verify `{ university: req.user.universityId }`.
- **Score Bounds Invariant:** The awarded submission grade must strictly respect `0 <= grade <= assignment.maxScore`.
- **Late Submission Tagging:** If `now > assignment.dueDate`, the submission status must automatically record `status: 'late'`.
- **File Upload Fallback:** `mediaUpload.js` automatically routes to Wasabi/S3 presigned uploads when configured, with a seamless fallback to the local disk driver `/api/v1/media/upload`.

---

## 8. Verification & Testing Plan

1. **Backend Integration Tests:**
   - Execute: `pnpm test tests/modules/assignments.test.js`
   - Verify existing 5 tests pass, and add verification that `populate("student")` returns `name` and `avatar`.
2. **Frontend Compilation & Smoke Testing:**
   - Run `npm run build` in `client` to verify zero JSX or bundle errors.
   - Verify that clicking "التكليفات والواجبات" in `CourseInfo.jsx` correctly navigates to `/courses/:courseId/assignments`.
   - Verify assignment creation, file upload, student submission, late badge flagging, and teacher grading workflow.
