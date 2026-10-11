# Backend Architecture Standardization Design

- **Date:** 2026-10-12
- **Topic:** Backend Architecture Standardization & Complete Legacy Purge
- **Status:** Approved Design

---

## 1. Executive Summary & Goals

### 1.1 Context
In the previous refactoring cycle, backend improvements were introduced under `backend/src/`, but legacy root folders (`controllers/`, `routes/`, `middleware/`, `errors/`, `configs/`, `utils/`, `models/`) were left standing to support backward compatibility with the 3-year-old React frontend. This resulted in dual architectures, dead code, and non-standard API designs (such as `/api/v1/au/*` aliases, misspelled models like `Collage`, and inconsistent HTTP response payloads).

### 1.2 Core Directives
1. **Unconstrained by Legacy Frontend:** The frontend will be refactored subsequently in its own cycle. Backend design must prioritize industry best practices, pure RESTful conventions, and clean architectural boundaries without compromise.
2. **Complete Legacy Code Purge:** Delete all redundant root directories in `backend/`. The entire backend application must reside under `backend/src/`.
3. **Enterprise Standardization:**
   - Unified `{ success: true, data, meta }` and `{ success: false, error }` envelopes across 100% of endpoints.
   - Strict RESTful HTTP semantics (201 Created, 204 No Content, 422 Unprocessable Entity, 401/403/404/409).
   - Domain-driven modular organization (`src/modules/*`) with central shared models (`src/models/*`).
   - Clean Mongoose 8 models with correct spelling (`College.js`, `SemesterTemplate.js`, `Chat.js`, `Message.js`).
   - Strict Zod validation on request parameters, queries, and bodies.
   - Multi-tenant scoping (`university: req.user.universityId`) and declarative RBAC.

---

## 2. Directory Layout & File Organization

### 2.1 Files & Directories to Permanently Delete
The following legacy folders in `backend/` are completely removed:
- `backend/controllers/`
- `backend/routes/`
- `backend/middleware/`
- `backend/errors/`
- `backend/configs/`
- `backend/utils/`
- `backend/models/`

### 2.2 Standard Target Architecture
```text
backend/
├── package.json
├── package-lock.json
├── server.js                    # HTTP server & Socket.IO initialization
├── vitest.config.js             # Vitest test configuration
├── tests/                       # Unit & integration test suites
│   ├── config/
│   ├── core/
│   └── modules/
└── src/
    ├── app.js                   # Express application setup & middleware pipeline
    ├── config/
    │   ├── constants.js         # Domain constants (Roles, permissions, grade brackets)
    │   ├── db.js                # Mongoose connection & lifecycle logic
    │   ├── env.js               # Zod-validated environment variables
    │   └── mailer.js            # Nodemailer transport service
    ├── core/
    │   ├── errors/
    │   │   ├── appError.js      # AppError base class
    │   │   └── customErrors.js  # BadRequestError, UnauthorizedError, ForbiddenError, etc.
    │   ├── middleware/
    │   │   ├── auth.middleware.js     # JWT verification & activity tracking
    │   │   ├── error.middleware.js    # Global error formatter & exception handler
    │   │   ├── rbac.middleware.js     # Declarative role & permission authorization
    │   │   └── validate.middleware.js # Zod schema validator middleware
    │   └── utils/
    │       ├── password.utils.js      # Argon2/Bcrypt password hashing & comparison
    │       ├── response.utils.js      # sendSuccess, sendCreated, sendNoContent, sendPaginated
    │       └── token.utils.js         # JWT signing & verification utilities
    ├── models/                  # Shared Mongoose 8 domain models
    │   ├── Admin.js             # User discriminator
    │   ├── AuditLog.js          # Renamed from Logger.js
    │   ├── Chat.js              # Renamed from chatModel.js
    │   ├── College.js           # Renamed from Collage.js
    │   ├── Course.js
    │   ├── Grade.js
    │   ├── Major.js
    │   ├── Message.js           # Renamed from messageModel.js
    │   ├── PerformanceMetric.js # Renamed from Performance.js
    │   ├── Section.js
    │   ├── Semester.js
    │   ├── SemesterTemplate.js  # Renamed from SemesterTemp.js
    │   ├── Student.js           # User discriminator
    │   ├── Subject.js
    │   ├── Teacher.js           # User discriminator
    │   ├── University.js
    │   └── User.js              # Base user model
    ├── modules/                 # Domain-driven feature modules
    │   ├── academics/
    │   │   ├── academics.controller.js
    │   │   ├── academics.routes.js
    │   │   ├── academics.schema.js
    │   │   └── academics.service.js
    │   ├── auth/
    │   │   ├── auth.controller.js
    │   │   ├── auth.routes.js
    │   │   ├── auth.schema.js
    │   │   └── auth.service.js
    │   ├── chat/
    │   │   ├── chat.controller.js
    │   │   ├── chat.routes.js
    │   │   ├── chat.schema.js
    │   │   └── chat.service.js
    │   ├── system/
    │   │   ├── system.controller.js
    │   │   ├── system.routes.js
    │   │   ├── system.schema.js
    │   │   └── system.service.js
    │   └── users/
    │       ├── users.controller.js
    │       ├── users.routes.js
    │       ├── users.schema.js
    │       └── users.service.js
    └── sockets/
        └── chatSocket.js        # Authenticated Socket.IO room events
```

---

## 3. Standardized Domain Models Specification

1. **`User.js` & Discriminators (`Admin.js`, `Teacher.js`, `Student.js`)**:
   - `User`: Base schema with `email`, `password` (hashed, `select: false`), `name`, `phone`, `role` (`student`, `teacher`, `admin`, `super-admin`), `university` (ObjectId, ref `University`), `lastActive` (Date), `avatar` (String), `timestamps: true`.
   - `Admin`: Discriminator with `permissions` (`r`, `w`, `rw`).
   - `Teacher`: Discriminator with `title`, `courses` (`[ObjectId]`, ref `Course`), `subjects` (`[ObjectId]`, ref `Subject`).
   - `Student`: Discriminator with `major` (ObjectId, ref `Major`), `comingSemester` (Number), `semesters` (`[ObjectId]`, ref `Semester`), `grades` (`[ObjectId]`, ref `Grade`).
2. **`College.js`**:
   - Renamed from `Collage.js`.
   - Schema: `name` (String, required), `description` (String), `university` (ObjectId, ref `University`, required, index). Collection explicitly set to `"colleges"`.
3. **`Major.js`**:
   - Schema: `name` (String, required), `college` (ObjectId, ref `College`, required, index).
4. **`Subject.js`**:
   - Schema: `name` (String, required), `code` (String, required), `college` (ObjectId, ref `College`, required), `description` (String).
5. **`SemesterTemplate.js`**:
   - Renamed from `SemesterTemp.js`.
   - Schema: `name` (String, required), `major` (ObjectId, ref `Major`, required, index), `index` (Number), `active` (Boolean, default: false), `subjects` (`[ObjectId]`, ref `Subject`). Collection explicitly set to `"semester_templates"`.
6. **`Semester.js`**:
   - Schema: `name` (String, required), `major` (ObjectId, ref `Major`, required), `template` (ObjectId, ref `SemesterTemplate`, required), `university` (ObjectId, ref `University`, required, index), `courses` (`[ObjectId]`, ref `Course`), `students` (`[ObjectId]`, ref `Student`), `startDate` (Date), `endDate` (Date, required), `completed` (Boolean, default: false).
7. **`Course.js`**:
   - Schema: `subject` (ObjectId, ref `Subject`, required), `teacher` (ObjectId, ref `Teacher`), `semester` (ObjectId, ref `Semester`, required), `university` (ObjectId, ref `University`, required), `sections` (`[ObjectId]`, ref `Section`).
8. **`Section.js`**:
   - Schema: `name` (String, required), `course` (ObjectId, ref `Course`, required), `students` (`[ObjectId]`, ref `Student`), `capacity` (Number, default: 30), `schedule` (String), `room` (String), `lessons` (subdocument array with `title`, `content`, `date`, `files`).
9. **`Grade.js`**:
   - Schema: `student` (ObjectId, ref `Student`, required, index), `course` (ObjectId, ref `Course`, required, index), `semester` (ObjectId, ref `Semester`, required), `assignments` (Number, default: 0), `midterm` (Number, default: 0), `final` (Number, default: 0), `total` (Number, default: 0), `letterGrade` (String, enum: `["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"]`), `gpaPoints` (Number).
10. **`Chat.js` & `Message.js`**:
    - Renamed from `chatModel.js` and `messageModel.js`.
    - `Chat`: `chatName` (String), `isGroupChat` (Boolean, default: false), `users` (`[ObjectId]`, ref `User`), `latestMessage` (ObjectId, ref `Message`), `groupAdmin` (ObjectId, ref `User`), `university` (ObjectId, ref `University`, required, index). Collection explicitly set to `"chats"`.
    - `Message`: `sender` (ObjectId, ref `User`, required), `content` (String, required), `chat` (ObjectId, ref `Chat`, required, index), `readBy` (`[ObjectId]`, ref `User`). Collection explicitly set to `"messages"`.
11. **`AuditLog.js` & `PerformanceMetric.js`**:
    - Renamed from `Logger.js` and `Performance.js`.
    - `AuditLog`: `user` (ObjectId, ref `User`), `action` (String), `details` (Object), `ip` (String), `timestamp` (Date, default: Date.now, expires: 90 days).
    - `PerformanceMetric`: `route` (String), `method` (String), `durationMs` (Number), `statusCode` (Number), `timestamp` (Date, default: Date.now).

---

## 4. API Endpoints & REST Specification

### 4.1 Response Envelope Standards
- **Success (`200 OK`, `201 Created`):**
  ```json
  {
    "success": true,
    "data": { ... },
    "meta": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
  }
  ```
- **Empty Success (`204 No Content`):**
  - No body sent.
- **Error Response (`400`, `401`, `403`, `404`, `409`, `422`, `500`):**
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid request parameters",
      "details": [
        { "field": "email", "issue": "Invalid email address format" }
      ]
    }
  }
  ```

### 4.2 Endpoint Manifest

#### Authentication (`/api/v1/auth`)
- `POST /register`: Registers user account (201 Created).
- `POST /login`: Validates credentials, issues access & refresh tokens (200 OK).
- `GET /me`: Returns authenticated user profile and university context (200 OK).
- `POST /refresh`: Issues fresh access token from refresh token (200 OK).
- `POST /logout`: Clears session / auth cookies (200 OK).
- `POST /forgot-password`: Issues secure password reset token (200 OK).
- `POST /reset-password`: Resets password via verified token (200 OK).

#### Users (`/api/v1/users`)
- `GET /`: Lists users with pagination & role filtering (200 OK).
- `GET /:id`: Retrieves user profile by ID (200 OK).
- `PATCH /:id`: Updates user details (200 OK).
- `DELETE /:id`: Removes user (204 No Content).
- `PATCH /me/password`: Self-service password change (200 OK).
- `PATCH /me/profile`: Self-service profile info change (200 OK).
*(All legacy `/api/v1/au/*` routes are removed).*

#### Academics (`/api/v1/...`)
- **Colleges:**
  - `GET /api/v1/colleges`: List colleges for user's university (200 OK).
  - `POST /api/v1/colleges`: Create college (201 Created).
  - `GET /api/v1/colleges/:id`: Get college details (200 OK).
  - `PATCH /api/v1/colleges/:id`: Update college (200 OK).
  - `DELETE /api/v1/colleges/:id`: Delete college & cascading relations (204 No Content).
- **Majors:**
  - `GET, POST /api/v1/majors`
  - `GET, PATCH, DELETE /api/v1/majors/:id`
- **Subjects:**
  - `GET, POST /api/v1/subjects`
  - `GET, PATCH, DELETE /api/v1/subjects/:id`
- **Semester Templates:**
  - `GET, POST /api/v1/semester-templates`
  - `GET, PATCH, DELETE /api/v1/semester-templates/:id`
- **Semesters:**
  - `GET, POST /api/v1/semesters`
  - `GET, PATCH, DELETE /api/v1/semesters/:id`
  - `POST /api/v1/semesters/:id/activate`: Activate semester & update template status.
  - `POST /api/v1/semesters/generate`: Mass create semester instances for major templates.
- **Courses & Sections:**
  - `GET, POST /api/v1/courses`, `GET, PATCH, DELETE /api/v1/courses/:id`
  - `GET, POST /api/v1/sections`, `GET, PATCH, DELETE /api/v1/sections/:id`
  - `POST /api/v1/sections/:sectionId/lessons`: Add lesson to section.
  - `PATCH, DELETE /api/v1/sections/:sectionId/lessons/:lessonId`: Update/delete lesson.
- **Grades:**
  - `GET /api/v1/grades/course/:courseId`: Get all grades for course (200 OK).
  - `GET /api/v1/grades/student/:studentId`: Get student's academic transcript (200 OK).
  - `PATCH /api/v1/grades/:id`: Update grade scores and recalculate GPA (200 OK).
- **Academic People (Role-Scoped):**
  - `GET, POST /api/v1/students`, `GET, PATCH, DELETE /api/v1/students/:id`
  - `GET, POST /api/v1/teachers`, `GET, PATCH, DELETE /api/v1/teachers/:id`
  - `GET, POST /api/v1/admins`, `GET, PATCH, DELETE /api/v1/admins/:id`

#### Chat & Messaging (`/api/v1/chats`)
- `GET /api/v1/chats`: List chats current user belongs to (200 OK).
- `POST /api/v1/chats`: Create 1-on-1 or group chat (201 Created).
- `GET /api/v1/chats/:id`: Get chat room details and participants (200 OK).
- `PATCH /api/v1/chats/:id`: Update group chat name or participants (200 OK).
- `GET /api/v1/chats/:chatId/messages`: Retrieve paginated messages for a chat (200 OK).
- `POST /api/v1/chats/:chatId/messages`: Send message in a chat (201 Created).
*(Replaces top-level non-standard `/api/v1/messages` endpoint with nested RESTful resource).*

#### System & Telemetry (`/api/v1/system`)
- `GET /api/v1/system/stats`: University overview statistics (200 OK).
- `GET /api/v1/system/logs`: Filtered audit activity log stream (200 OK).
- `GET /api/v1/system/search`: ReDoS-safe parameterized search across entities (200 OK).

---

## 5. Security, Multi-Tenancy & Error Handling

1. **Multi-Tenancy Guard:**
   - Every read and write query scoped by `req.user.universityId`.
   - Prevent cross-tenant data leakage by enforcing tenant checks at the database query level.
2. **Declarative RBAC:**
   - Middleware `requireRoles("admin", "super-admin")` attached explicitly to route definitions.
   - Resource-level checks for `req.user.id === targetUserId` on self-service endpoints.
3. **Centralized Error Handling:**
   - Zod validation errors formatted into 422 with actionable `{ field, issue }` payloads.
   - Database duplicate key violations (11000) transformed into 409 Conflict.
   - Invalid ObjectIDs caught as 400 Bad Request.

---

## 6. Testing Strategy

All 12 test suites in `backend/tests/` will be updated to validate:
1. All new model imports from `src/models/*.js`.
2. New REST route paths (e.g. `/api/v1/colleges`, `/api/v1/semester-templates`, `/api/v1/chats/:id/messages`).
3. Standard response envelope assertions (`expect(body).toMatchObject({ success: true, data: expect.anything() })`).
4. Correct HTTP status codes (`201` on create, `204` on delete, `422` on validation failures).
5. 100% passing test execution in Vitest.
