# Backend Architecture Standardization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completely eliminate all legacy code and dual architectures, migrate shared Mongoose models into `src/models/`, standardize 100% of REST API routes and response envelopes, and align the test suite.

**Architecture:** Domain-driven modular Express application under `backend/src/` with central shared Mongoose 8 models in `src/models/`, unified `{ success, data, meta }` response helpers, declarative RBAC, Zod schema validation, and authenticated Socket.IO chat.

**Tech Stack:** Node.js (ESM), Express 4 with `express-async-errors`, Mongoose 8, Zod, Socket.IO, Vitest, Supertest, Argon2/Bcrypt, jsonwebtoken.

**Spec:** [docs/superpowers/specs/2026-10-12-backend-standardization-design.md](file:///c:/Users/msii/Documents/Gahbaz/docs/superpowers/specs/2026-10-12-backend-standardization-design.md)

## Global Constraints
- Target directory: Single source of truth under `backend/src/`. All root legacy directories (`controllers`, `routes`, `middleware`, `errors`, `configs`, `utils`, `models`) must be deleted.
- Standard response envelope: `{ success: true, data: ..., meta: { page, limit, total, totalPages } }` for success; `{ success: false, error: { code, message, details } }` for errors.
- Standard HTTP status codes: 201 Created for POST creations, 204 No Content for DELETE, 422 Unprocessable Entity for Zod validation failures.
- Multi-tenancy: All tenant queries strictly scoped by `university: req.user.universityId`.
- No frontend compatibility compromises: Deprecate all legacy `/api/v1/au/*` routes and misspelled endpoints.

---

### Task 1: Core Legacy Cleanup & Unified Response Utilities

**Files:**
- Modify: `backend/src/core/utils/response.utils.js`
- Modify: `backend/src/core/middleware/error.middleware.js`
- Test: `backend/tests/core/errors.test.js`

**Interfaces:**
- Consumes: `AppError` from `src/core/errors/appError.js`, Zod `ZodError`.
- Produces: `sendSuccess(res, data, statusCode, meta)`, `sendCreated(res, data)`, `sendNoContent(res)`, `sendPaginated(res, data, meta)`.

- [ ] **Step 1: Write tests for standard response helpers and error formatting**
  Verify `sendSuccess`, `sendCreated`, `sendNoContent`, `sendPaginated`, and `error.middleware.js` returning standardized JSON envelopes with proper status codes.

- [ ] **Step 2: Run test to verify initial state or failure**
  Run: `npm test tests/core/errors.test.js`

- [ ] **Step 3: Implement standard response utilities & error middleware**
  Implement `sendSuccess`, `sendCreated`, `sendNoContent`, `sendPaginated` in `backend/src/core/utils/response.utils.js`.
  Update `backend/src/core/middleware/error.middleware.js` to format `AppError`, `ZodError` (422), Mongo `11000` (409), and `CastError` (400) into `{ success: false, error: { code, message, details } }`.

- [ ] **Step 4: Delete root legacy directories**
  Remove `backend/controllers`, `backend/routes`, `backend/middleware`, `backend/errors`, `backend/configs`, `backend/utils`.

- [ ] **Step 5: Run tests and verify they pass**
  Run: `npm test tests/core/errors.test.js`

- [ ] **Step 6: Commit**
  ```bash
  git add backend/src/core/ backend/tests/core/
  git commit -m "feat: standardize response helpers, error middleware, and purge root legacy folders"
  ```

---

### Task 2: Standardized Mongoose 8 Domain Models in `src/models/`

**Files:**
- Create: `backend/src/models/User.js`
- Create: `backend/src/models/Admin.js`
- Create: `backend/src/models/Teacher.js`
- Create: `backend/src/models/Student.js`
- Create: `backend/src/models/College.js` (renamed from `Collage.js`, collection: `"colleges"`)
- Create: `backend/src/models/Major.js`
- Create: `backend/src/models/Subject.js`
- Create: `backend/src/models/Course.js`
- Create: `backend/src/models/Section.js`
- Create: `backend/src/models/SemesterTemplate.js` (renamed from `SemesterTemp.js`, collection: `"semester_templates"`)
- Create: `backend/src/models/Semester.js` (referencing `SemesterTemplate`)
- Create: `backend/src/models/Grade.js`
- Create: `backend/src/models/Chat.js` (renamed from `chatModel.js`, collection: `"chats"`)
- Create: `backend/src/models/Message.js` (renamed from `messageModel.js`, collection: `"messages"`)
- Create: `backend/src/models/University.js`
- Create: `backend/src/models/AuditLog.js` (renamed from `Logger.js`, collection: `"audit_logs"`)
- Create: `backend/src/models/PerformanceMetric.js` (renamed from `Performance.js`, collection: `"performance_metrics"`)
- Delete: `backend/models/`
- Test: `backend/tests/modules/models.test.js`

**Interfaces:**
- Consumes: Mongoose 8 schema definitions, `constants.js`.
- Produces: Exported Mongoose models in `src/models/*.js`.

- [ ] **Step 1: Write unit tests verifying all models compile, have timestamps, and declare schemas**
  Write `backend/tests/modules/models.test.js` to import each model from `src/models/` and verify model names and schema properties.

- [ ] **Step 2: Run test to verify failure**
  Run: `npm test tests/modules/models.test.js`

- [ ] **Step 3: Create modernized Mongoose models in `src/models/`**
  Implement all 17 models in `backend/src/models/` adhering strictly to Mongoose 8 standards, eliminating legacy comments, and setting explicit collection names.
  Remove `backend/models/`.

- [ ] **Step 4: Run test to verify all models pass**
  Run: `npm test tests/modules/models.test.js`

- [ ] **Step 5: Commit**
  ```bash
  git add backend/src/models/ backend/tests/modules/models.test.js
  git commit -m "feat: migrate and modernize all Mongoose models into src/models"
  ```

---

### Task 3: Standardize Authentication Module (`src/modules/auth/`)

**Files:**
- Modify: `backend/src/modules/auth/auth.service.js`
- Modify: `backend/src/modules/auth/auth.controller.js`
- Modify: `backend/src/modules/auth/auth.routes.js`
- Modify: `backend/src/modules/auth/auth.schema.js`
- Test: `backend/tests/modules/auth.test.js`

**Interfaces:**
- Consumes: `User`, `University` from `src/models/`, response helpers, password/token utilities.
- Produces: `/api/v1/auth` routes with 201 Created for register, 200 OK for login, me, refresh, logout, password reset.

- [ ] **Step 1: Update auth tests for standard response envelope**
  Assert `{ success: true, data: { user, token } }` and HTTP 201 on register.

- [ ] **Step 2: Run auth test to verify failures**
  Run: `npm test tests/modules/auth.test.js`

- [ ] **Step 3: Update auth module implementation**
  Update model imports to `src/models/User.js` and `src/models/University.js`.
  Use `sendCreated` and `sendSuccess` in `auth.controller.js`.

- [ ] **Step 4: Run auth tests to verify they pass**
  Run: `npm test tests/modules/auth.test.js`

- [ ] **Step 5: Commit**
  ```bash
  git add backend/src/modules/auth/ backend/tests/modules/auth.test.js
  git commit -m "feat: standardize auth module with REST status codes and envelope"
  ```

---

### Task 4: Standardize Users Module (`src/modules/users/`)

**Files:**
- Modify: `backend/src/modules/users/users.service.js`
- Modify: `backend/src/modules/users/users.controller.js`
- Modify: `backend/src/modules/users/users.routes.js`
- Modify: `backend/src/modules/users/users.schema.js`
- Test: `backend/tests/modules/users.test.js`

**Interfaces:**
- Consumes: `User` from `src/models/User.js`, response helpers.
- Produces: Pure REST `/api/v1/users` endpoints. Deletes legacy `/api/v1/au/*` routes.

- [ ] **Step 1: Update users tests for standard envelopes and 204 on deletion**
  Assert `GET /api/v1/users` returns `{ success: true, data, meta }`, `DELETE /api/v1/users/:id` returns 204 No Content.

- [ ] **Step 2: Run users test to verify failure**
  Run: `npm test tests/modules/users.test.js`

- [ ] **Step 3: Update users module implementation**
  Remove all legacy `/api/v1/au/*` aliases from `users.routes.js`.
  Use `sendSuccess`, `sendPaginated`, and `sendNoContent` in `users.controller.js`.
  Update model import to `src/models/User.js`.

- [ ] **Step 4: Run users tests to verify they pass**
  Run: `npm test tests/modules/users.test.js`

- [ ] **Step 5: Commit**
  ```bash
  git add backend/src/modules/users/ backend/tests/modules/users.test.js
  git commit -m "feat: standardize users module and remove legacy route aliases"
  ```

---

### Task 5: Standardize Academics Module - Structure & Terms (`src/modules/academics/`)

**Files:**
- Modify: `backend/src/modules/academics/academics.service.js`
- Modify: `backend/src/modules/academics/academics.controller.js`
- Modify: `backend/src/modules/academics/academics.routes.js`
- Modify: `backend/src/modules/academics/academics.schema.js`
- Test: `backend/tests/modules/academics-crud.test.js`
- Test: `backend/tests/modules/academics-semesters.test.js`

**Interfaces:**
- Consumes: `College`, `Major`, `Subject`, `SemesterTemplate`, `Semester` from `src/models/`.
- Produces: Standardized routes `/api/v1/colleges`, `/api/v1/majors`, `/api/v1/subjects`, `/api/v1/semester-templates`, `/api/v1/semesters`.

- [ ] **Step 1: Update academics tests for standard REST routes & envelopes**
  Update tests to target `/api/v1/colleges` (fixing `collages` typo) and `/api/v1/semester-templates`.
  Assert 201 on create, 204 on delete, and `{ success: true, data }`.

- [ ] **Step 2: Run tests to verify failures**
  Run: `npm test tests/modules/academics-crud.test.js tests/modules/academics-semesters.test.js`

- [ ] **Step 3: Update academic structure services, controllers, routes, schemas**
  Import models from `src/models/` (`College.js`, `SemesterTemplate.js`, etc.).
  Expose RESTful `/api/v1/colleges`, `/api/v1/semester-templates`.
  Use `sendCreated`, `sendSuccess`, `sendNoContent`.

- [ ] **Step 4: Run tests and verify they pass**
  Run: `npm test tests/modules/academics-crud.test.js tests/modules/academics-semesters.test.js`

- [ ] **Step 5: Commit**
  ```bash
  git add backend/src/modules/academics/ backend/tests/modules/academics*
  git commit -m "feat: standardize academic structure endpoints with colleges and semester-templates"
  ```

---

### Task 6: Standardize Academics Module - Courses, Grades & People (`src/modules/academics/`)

**Files:**
- Modify: `backend/src/modules/academics/academics.service.js`
- Modify: `backend/src/modules/academics/academics.controller.js`
- Modify: `backend/src/modules/academics/academics.routes.js`
- Modify: `backend/src/modules/academics/academics.schema.js`
- Test: `backend/tests/modules/academics-crud.test.js`

**Interfaces:**
- Consumes: `Course`, `Section`, `Grade`, `Student`, `Teacher`, `Admin` from `src/models/`.
- Produces: Standardized routes `/api/v1/courses`, `/api/v1/sections`, `/api/v1/grades`, `/api/v1/students`, `/api/v1/teachers`, `/api/v1/admins`.

- [ ] **Step 1: Write tests for grades calculation and section lessons with standard envelopes**
  Assert `sendSuccess` and `sendCreated` used across courses, sections, lessons, and grades.

- [ ] **Step 2: Run tests to verify failure**
  Run: `npm test tests/modules/academics-crud.test.js`

- [ ] **Step 3: Update courses, sections, grades, and people handlers**
  Ensure clean GPA calculation in `Grade` updates, clean lesson push/pull on `Section`, and standard responses.

- [ ] **Step 4: Run tests to verify they pass**
  Run: `npm test tests/modules/academics-crud.test.js`

- [ ] **Step 5: Commit**
  ```bash
  git add backend/src/modules/academics/ backend/tests/modules/academics-crud.test.js
  git commit -m "feat: standardize course, grade, and academic role handlers"
  ```

---

### Task 7: Standardize Chat & Messaging Module (`src/modules/chat/` & `src/sockets/`)

**Files:**
- Modify: `backend/src/modules/chat/chat.service.js`
- Modify: `backend/src/modules/chat/chat.controller.js`
- Modify: `backend/src/modules/chat/chat.routes.js`
- Modify: `backend/src/modules/chat/chat.schema.js`
- Modify: `backend/src/sockets/chatSocket.js`
- Test: `backend/tests/modules/chat.test.js`

**Interfaces:**
- Consumes: `Chat`, `Message`, `User` from `src/models/`.
- Produces: `/api/v1/chats` with nested `/api/v1/chats/:chatId/messages`. Removes separate top-level `/api/v1/messages`.

- [ ] **Step 1: Update chat tests to verify nested REST messages and standard envelopes**
  Test `POST /api/v1/chats` (201 Created), `POST /api/v1/chats/:chatId/messages` (201 Created), and `GET /api/v1/chats/:chatId/messages` (200 OK with `{ success: true, data }`).

- [ ] **Step 2: Run test to verify failure**
  Run: `npm test tests/modules/chat.test.js`

- [ ] **Step 3: Implement standardized nested chat module and socket integration**
  Update model imports to `src/models/Chat.js` and `src/models/Message.js`.
  Implement nested messages route and controller.
  Update `chatSocket.js` to use `Chat` and `Message`.

- [ ] **Step 4: Run chat tests to verify they pass**
  Run: `npm test tests/modules/chat.test.js`

- [ ] **Step 5: Commit**
  ```bash
  git add backend/src/modules/chat/ backend/src/sockets/ backend/tests/modules/chat.test.js
  git commit -m "feat: standardize chat module with nested REST messages and model cleanup"
  ```

---

### Task 8: Standardize System & Telemetry Module (`src/modules/system/`)

**Files:**
- Modify: `backend/src/modules/system/system.service.js`
- Modify: `backend/src/modules/system/system.controller.js`
- Modify: `backend/src/modules/system/system.routes.js`
- Modify: `backend/src/modules/system/system.schema.js`
- Test: `backend/tests/modules/system.test.js`

**Interfaces:**
- Consumes: `AuditLog`, `PerformanceMetric`, `User`, `College`, `Major`, `Course` from `src/models/`.
- Produces: Standard `/api/v1/system/stats`, `/api/v1/system/logs`, `/api/v1/system/search`.

- [ ] **Step 1: Update system tests to verify standard envelopes and model references**
  Test stats, logs, and search endpoints with `{ success: true, data }`.

- [ ] **Step 2: Run system tests to verify failures**
  Run: `npm test tests/modules/system.test.js`

- [ ] **Step 3: Update system module implementation**
  Update model imports to `src/models/AuditLog.js`, `src/models/PerformanceMetric.js`, `src/models/College.js`.
  Use `sendSuccess` and `sendPaginated`.

- [ ] **Step 4: Run system tests to verify they pass**
  Run: `npm test tests/modules/system.test.js`

- [ ] **Step 5: Commit**
  ```bash
  git add backend/src/modules/system/ backend/tests/modules/system.test.js
  git commit -m "feat: standardize system module with AuditLog and College models"
  ```

---

### Task 9: Express Pipeline Assembly, Full E2E & Final Verification

**Files:**
- Modify: `backend/src/app.js`
- Modify: `backend/tests/app.e2e.test.js`

**Interfaces:**
- Consumes: All standardized module routers mounted cleanly at `/api/v1/*`.
- Produces: Assembled Express application with global error handling and 404 handler.

- [ ] **Step 1: Update `app.js` routing table**
  Mount all standardized routes:
  - `/api/v1/auth`
  - `/api/v1/users`
  - `/api/v1/colleges`, `/api/v1/majors`, `/api/v1/subjects`, `/api/v1/courses`, `/api/v1/sections`, `/api/v1/semester-templates`, `/api/v1/semesters`, `/api/v1/grades`, `/api/v1/students`, `/api/v1/teachers`, `/api/v1/admins`
  - `/api/v1/chats`
  - `/api/v1/system`
  Remove all legacy route prefixes (`/api/v1/au`, `/api/v1/collages`, `/api/v1/messages`).

- [ ] **Step 2: Update e2e integration tests in `backend/tests/app.e2e.test.js`**
  Verify complete end-to-end flows with standard envelopes.

- [ ] **Step 3: Run full test suite across the entire project**
  Run: `npm test`
  Verify all test suites pass with 100% green status.

- [ ] **Step 4: Verify zero legacy folders remain**
  Verify `controllers/`, `routes/`, `middleware/`, `errors/`, `configs/`, `utils/`, `models/` do not exist in `backend/`.

- [ ] **Step 5: Commit**
  ```bash
  git add backend/src/app.js backend/tests/app.e2e.test.js
  git commit -m "feat: assemble standardized Express pipeline and verify 100% test pass"
  ```
