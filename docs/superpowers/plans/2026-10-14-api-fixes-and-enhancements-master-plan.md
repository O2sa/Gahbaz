# API Fixes & Enhancements Master Execution Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve all discovered 404 route discrepancies, eliminate multi-tenant data leakage vulnerabilities, enforce ACID transaction integrity, and implement the approved LMS/SIS enhancements (Assignments, Add/Drop Portal, Auto-Course Chat, and GPA Transcripts) step by step.

**Architecture:** Layered modular Node.js/Express architecture under `backend/src/modules/` with centralized Mongoose 8 models under `backend/src/models/`, Zod request validation, and uniform response envelopes.

**Tech Stack:** Node.js, Express, MongoDB (Mongoose 8), Zod, Socket.IO, Vitest, Mantine UI v6, TanStack Query v5.

**Spec Reference:** [docs/superpowers/specs/2026-10-13-gahbaz-business-requirements.md](file:///c:/Users/msii/Documents/Gahbaz/docs/superpowers/specs/2026-10-13-gahbaz-business-requirements.md)

---

## Global Constraints & Principles

- **Response Envelope:** 100% of API endpoints must return `{ success: true, data, meta }` on success or `{ success: false, error: { code, message, details } }` on failure.
- **Multi-Tenant Isolation:** Every operational query and mutation MUST verify `{ university: req.user.universityId }`.
- **Zero Breaking Changes:** Preserve backward compatibility for both query parameter filters (`?semester=...`) and historical path aliases (`/courses/semester-courses/...`).
- **Test-Driven:** Every task must include unit/integration tests verified with `npm test` before marking completed.

---

## Phase 1: Critical Route Discrepancies & 404 Bug Fixes

---

### Task 1.1: Mount First-Class `/api/v1/sections` Router & Lesson Sub-Routes

**Problem:** The client calls `/api/v1/sections/:id` and `/api/v1/sections/:sectionId/lessons/:lessonId`, but the backend only mounts sections under `/api/v1/courses/sections`, triggering 404 Not Found errors on viewing or editing sections.

**Files:**
- Create: `backend/src/modules/courses/sections.routes.js`
- Modify: `backend/src/app.js:61-75`
- Test: `backend/tests/modules/sections-routes.test.js`

**Interfaces:**
- `GET /api/v1/sections/:id` -> returns `{ success: true, data: Section }`
- `PATCH /api/v1/sections/:id` -> updates section name
- `DELETE /api/v1/sections/:id` -> removes section
- `POST /api/v1/sections/:sectionId/lessons` -> adds a lesson
- `PATCH /api/v1/sections/:sectionId/lessons/:lessonId` -> updates a lesson
- `DELETE /api/v1/sections/:sectionId/lessons/:lessonId` -> deletes a lesson

- [x] **Step 1: Write integration tests for `/api/v1/sections`**
- [x] **Step 2: Create `sections.routes.js` and delegate to existing controller methods**
- [x] **Step 3: Mount `app.use("/api/v1/sections", authGuard, sectionsRouter)` in `app.js`**
- [x] **Step 4: Run `npm test` to verify all 6 endpoints pass**
- [x] **Step 5: Commit changes**

---

### Task 1.2: Mount `/api/v1/semester-templates` and Path Aliases

**Problem:** `SemestersTemplate.jsx` calls `GET /api/v1/semester-templates/:majorId`, but templates are only registered under `/api/v1/semesters/templates`, throwing a 404.

**Files:**
- Modify: `backend/src/modules/semesters/semesters.routes.js`
- Modify: `backend/src/modules/semesters/semesters.controller.js`
- Modify: `backend/src/app.js:65-70`
- Test: `backend/tests/modules/semester-templates.test.js`

**Interfaces:**
- `GET /api/v1/semester-templates/:majorId` -> returns list of semester templates for that major
- `GET /api/v1/semesters/semester-template/:id` -> returns single semester template by ID

- [x] **Step 1: Write integration tests for `/api/v1/semester-templates/:majorId`**
- [x] **Step 2: Add route aliases in `semesters.routes.js` and mount `/api/v1/semester-templates` in `app.js`**
- [x] **Step 3: Support major ID filter in controller if passed as route param**
- [x] **Step 4: Verify with `npm test`**
- [x] **Step 5: Commit changes**

---

### Task 1.3: Add Missing Academic Query Aliases (`semester-courses`, `collage-subjects`, `major`)

**Problem:** Client pages call:
- `/api/v1/courses/semester-courses/:semesterId` (in `Semester.jsx`)
- `/api/v1/subjects/collage-subjects/:majorId` (in `SemestersTemplate.jsx`)
- `/api/v1/majors/major/:majorId` (in `AboutMajor.jsx`)
All of these currently 404 because the API expected root query parameters.

**Files:**
- Modify: `backend/src/modules/courses/courses.routes.js`
- Modify: `backend/src/modules/subjects/subjects.routes.js`
- Modify: `backend/src/modules/majors/majors.routes.js`
- Test: `backend/tests/modules/academic-aliases.test.js`

- [x] **Step 1: Write integration tests verifying all 3 alias routes return 200 with data**
- [x] **Step 2: Add `router.get("/semester-courses/:semesterId", ...)` in `courses.routes.js`**
- [x] **Step 3: Add `router.get("/collage-subjects/:majorId", ...)` in `subjects.routes.js`**
- [x] **Step 4: Add `router.get("/major/:id", ...)` in `majors.routes.js`**
- [x] **Step 5: Run `npm test` and verify**
- [x] **Step 6: Commit changes**

---

### Task 1.4: Resolve Course Gradebook Collision (`/grades/:id`)

**Problem:** When `StudentGrades.jsx` requests `GET /api/v1/grades/:courseId`, the backend routes to `getGrade` expecting a single Grade document ID, failing with `Grade not found` (404).

**Files:**
- Modify: `backend/src/modules/grades/grades.routes.js`
- Modify: `backend/src/modules/grades/grades.controller.js`
- Modify: `backend/src/modules/grades/grades.service.js`
- Test: `backend/tests/modules/grades-route-fallback.test.js`

**Interfaces:**
- `GET /api/v1/grades/:id`: Checks if `:id` is a `Course` ID. If so, returns course gradebook (`getCourseGrades`). If it's a Grade document, returns single grade.

- [x] **Step 1: Write test checking `GET /api/v1/grades/:courseId` returns course grades**
- [x] **Step 2: Update controller/service to intelligently resolve course gradebook fallback**
- [x] **Step 3: Run `npm test`**
- [x] **Step 4: Commit changes**

---

## Phase 2: Multi-Tenancy & Security Hardening

---

### Task 2.1: Enforce University Tenant Scoping on All Queries & Mutations

**Problem:** `courses.service.js`, `subjects.service.js`, and `sections` currently query by `_id` without verifying `university: req.user.universityId`, allowing cross-tenant data access.

**Files:**
- Modify: `backend/src/modules/courses/courses.service.js`
- Modify: `backend/src/modules/subjects/subjects.service.js`
- Test: `backend/tests/core/tenant-isolation.test.js`

- [x] **Step 1: Write test verifying a user from University A receives 404/Forbidden when querying University B's course or subject ID**
- [x] **Step 2: Add `{ university: universityId }` to all find, update, and delete queries in `courses.service.js`**
- [x] **Step 3: Add tenant check to `subjects.service.js`**
- [x] **Step 4: Verify with `npm test`**
- [x] **Step 5: Commit changes**

---

### Task 2.2: Add Rate Limiting to Authentication & Sensitive Routes

**Problem:** Login and account creation have no request rate limiters, leaving the platform vulnerable to credential stuffing and brute-force attacks.

**Files:**
- Create: `backend/src/core/middleware/rateLimit.middleware.js`
- Modify: `backend/src/modules/auth/auth.routes.js`
- Modify: `backend/package.json` (add `express-rate-limit`)

- [x] **Step 1: Install `express-rate-limit`**
- [x] **Step 2: Create auth limiter (5 attempts per 15 minutes per IP)**
- [x] **Step 3: Attach limiter to `/api/v1/auth/login` and `/register`**
- [x] **Step 4: Write test verifying 429 Too Many Requests response after limit exceeded**
- [x] **Step 5: Commit changes**

---

## Phase 3: ACID Transactions & Referential Data Integrity

---

### Task 3.1: Wrap Multi-Document Semester Operations in MongoDB Sessions

**Problem:** `startSemesterService` creates courses, fetches templates, and links student gradebooks across dozens of documents without transaction rollback, risking database corruption on failure.

**Files:**
- Modify: `backend/src/modules/semesters/semesters.service.js`
- Test: `backend/tests/modules/semester-transaction.test.js`

- [x] **Step 1: Write test asserting no partial courses or records remain if a middle step fails**
- [x] **Step 2: Wrap `startSemesterService` in `mongoose.startSession()` with `withTransaction()`**
- [x] **Step 3: Test and commit changes**

---

### Task 3.2: Implement Cascade Deletion Safeguards

**Problem:** Deleting a `College` or `Course` leaves orphaned records in MongoDB.

**Files:**
- Modify: `backend/src/models/College.js`
- Modify: `backend/src/models/Course.js`
- Modify: `backend/src/modules/colleges/colleges.service.js`
- Modify: `backend/src/modules/courses/courses.service.js`
- Test: `backend/tests/modules/cascade-delete.test.js`

- [x] **Step 1: Write test verifying deleting a course deletes its sections and grade records**
- [x] **Step 2: Add cleanup logic or Mongoose pre-hook to remove child records**
- [x] **Step 3: Verify and commit changes**

---

## Phase 4: Core Strategic Feature Enhancements

---

### Task 4.1: Full Assignment & Student Submissions Engine

**Goal:** Allow faculty to publish homework/tasks with deadlines and attachments, students to submit PDF/ZIP files with countdown timers, and instructors to provide grades and remarks.

**Files:**
- Create: `backend/src/models/Assignment.js`
- Create: `backend/src/models/Submission.js`
- Create: `backend/src/modules/assignments/assignments.routes.js`
- Create: `backend/src/modules/assignments/assignments.controller.js`
- Create: `backend/src/modules/assignments/assignments.service.js`
- Create: `backend/src/modules/assignments/assignments.validator.js`
- Modify: `backend/src/app.js` (mount `/api/v1/assignments`)
- Test: `backend/tests/modules/assignments.test.js`
- Client: `client/src/pages/admin/Assignments.jsx`, `client/src/pages/student/Assignments.jsx`

**Interfaces:**
- `POST /api/v1/courses/:courseId/assignments` -> Create assignment (`title, description, dueDate, maxScore, fileUrl`)
- `GET /api/v1/courses/:courseId/assignments` -> List assignments for course
- `POST /api/v1/assignments/:id/submissions` -> Student submits work (`fileUrl, notes`)
- `GET /api/v1/assignments/:id/submissions` -> Teacher views all submissions
- `PATCH /api/v1/submissions/:id/grade` -> Teacher grades submission and updates Grade document

- [x] **Step 1: Create Assignment and Submission Mongoose models**
- [x] **Step 2: Implement Zod validators and business services**
- [x] **Step 3: Register routes in `app.js`**
- [x] **Step 4: Write comprehensive tests and verify with `npm test`**
- [x] **Step 5: Connect client UI components**
- [x] **Step 6: Commit changes**

---

### Task 4.2: Automated Course Chat Channels Synchronization

**Goal:** Automatically provision an active discussion room for every course offering, setting the instructor as administrator and synchronizing enrolled students.

**Files:**
- Modify: `backend/src/modules/courses/courses.service.js`
- Modify: `backend/src/modules/semesters/semesters.service.js`
- Modify: `backend/src/modules/chat/chat.service.js`
- Test: `backend/tests/modules/auto-course-chat.test.js`

- [ ] **Step 1: Create helper `ensureCourseChatChannel(courseId)` in chat service**
- [ ] **Step 2: Trigger channel creation when course is created or semester started**
- [ ] **Step 3: Sync student roster when students are added or dropped**
- [ ] **Step 4: Verify with tests and commit**

---

### Task 4.3: Hybrid Student Course Enrollment & Add/Drop Portal

**Goal:** Enable students to view open courses during the Add/Drop window, register for eligible classes, and enforce prerequisite and credit hour restrictions (12-19 credits).

**Files:**
- Create: `backend/src/modules/enrollment/enrollment.routes.js`
- Create: `backend/src/modules/enrollment/enrollment.controller.js`
- Create: `backend/src/modules/enrollment/enrollment.service.js`
- Modify: `backend/src/app.js` (mount `/api/v1/enrollment`)
- Test: `backend/tests/modules/enrollment.test.js`
- Client: `client/src/pages/student/CourseRegistration.jsx`

**Interfaces:**
- `GET /api/v1/enrollment/available-courses` -> Returns open courses matching student major & passed prerequisites
- `POST /api/v1/enrollment/register` -> Enrolls student in selected course (validating total credit hours)
- `POST /api/v1/enrollment/drop` -> Drops course during active Add/Drop window

- [ ] **Step 1: Implement enrollment validation service (credit hours & prerequisites)**
- [ ] **Step 2: Register routes and controllers**
- [ ] **Step 3: Write tests verifying credit limit violations are rejected**
- [ ] **Step 4: Build client self-service registration UI**
- [ ] **Step 5: Commit changes**

---

### Task 4.4: Cumulative GPA & Official Academic Transcript Engine

**Goal:** Calculate semester GPA and cumulative GPA weighted by credit units, map to letter grades (A+, A, B, etc.), and provide a printable official transcript.

**Files:**
- Create: `backend/src/core/utils/gpa.utils.js`
- Create: `backend/src/modules/transcripts/transcripts.routes.js`
- Create: `backend/src/modules/transcripts/transcripts.controller.js`
- Create: `backend/src/modules/transcripts/transcripts.service.js`
- Modify: `backend/src/app.js`
- Test: `backend/tests/modules/gpa-calculation.test.js`
- Client: `client/src/pages/student/Transcript.jsx`

**Interfaces:**
- `GET /api/v1/students/:id/transcript` -> Returns term-by-term breakdown, credit units, grade letters, SGPA, and cumulative CGPA (4.0 & 5.0 scales).

- [ ] **Step 1: Implement GPA calculation algorithms in `gpa.utils.js`**
- [ ] **Step 2: Implement transcript service grouping grades by academic semester**
- [ ] **Step 3: Register route and verify with unit tests**
- [ ] **Step 4: Build student transcript view in client**
- [ ] **Step 5: Commit changes**

---

## Execution Summary & Order of Execution

```text
[Phase 1: 404 Route Fixes] ──► [Phase 2: Tenant Security] ──► [Phase 3: Transactions] ──► [Phase 4: Enhancements]
(Tasks 1.1 - 1.4)              (Tasks 2.1 - 2.2)               (Tasks 3.1 - 3.2)          (Tasks 4.1 - 4.4)
```
- **Total Tasks:** 12 structured tasks across 4 phases.
- **Immediate Next Action:** Execute Task 1.1 (Mount `/api/v1/sections`).
