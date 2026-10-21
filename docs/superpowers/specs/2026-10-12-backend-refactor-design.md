# Backend Refactoring Specification: Gahbaz E-Learning System

**Date:** 2026-10-12  
**Status:** Approved  
**Scope:** Backend Architecture, Security Hardening, Bug Fixing, Layering, and Automated Testing

---

## 1. Background & Objectives

The Gahbaz E-Learning System backend was developed ~3 years ago using Node.js, Express, MongoDB, and Socket.IO. A thorough code audit revealed severe architectural deficiencies, security vulnerabilities, and logic bugs:

- **Security & Access Control:**
  - Plaintext Gmail credentials hardcoded directly in `backend/utils/mailer.js`.
  - Insecure registration logic (`isFirstAccount = true` hardcoded), allowing anyone to register as a `super-admin`.
  - Critical IDOR vulnerabilities: controllers accept arbitrary `userId` and `sender` parameters in `req.body` to modify profiles, change passwords, and send messages.
  - Flawed RBAC: `authMiddleware.js` parses URL path substrings (`req.originalUrl.split("/")`) against a blacklisted array, leaving admin endpoints (`/api/v1/admins`) completely unprotected.
  - Insecure defaults: temporary passwords default to user emails; pseudo-random generation uses insecure `Math.random()`.
  - Database write contention: `User.findByIdAndUpdate` writes to the database on every authenticated HTTP request.
- **Critical Logic Bugs & Runtime Errors:**
  - Controllers returning function references instead of data: `updateUser`, `updateTeacher`, `updateAdmin`, `deleteSubject`, `updateSubject` return `json(updateUser)`, `json(updateTeacher)`, etc.
  - `getSubject` calls `Subject.create(req.body)` on GET requests, creating new documents instead of fetching an existing one.
  - Mongoose 8 incompatibility: deprecated `Schema.pre('remove')` hooks in `Major.js`, `Course.js`, and `Semester.js` that never execute or fail.
  - Unawaited asynchronous operations in `Section.js` methods (`addLesson`, `updateLesson`, `deleteLesson`), returning pending empty promises to clients.
  - Casing bugs causing crashes or failed cascading deletions (`course._Id`, `major._Id`).
  - Copy-pasted Arabic schema error strings (`"لا بد من تحديد عدد الحصص اليومية"`) attached to `University`, `Semester.template`, etc.
  - Date calculation bug in `dataCollector.js` (`threeMonthsAgo.getDay() - 3`).
  - Unhandled multi-tenancy and lack of tenant scoping across queries.
- **Code Duplication & Dead Code:**
  - Two parallel user routers and controllers: `userRouter.js`/`userControllers.js` vs `userRoutes.js`/`userController.js`.
  - Conflicting dependencies in `package.json` (frontend packages like `react-ga4` and `@tiptap/extension-placeholder` inside backend; both `multer` and `express-fileupload`).
  - Zero automated tests in the backend.

### Core Objective
Refactor the backend into a clean, robust, and secure **Modular Domain Layered Architecture** using modern ES Modules (ESM), enforcing strict multi-tenancy and route-level RBAC, fixing all logic bugs, introducing Zod schema validation and Vitest test coverage, while maintaining **100% backward compatibility** with the existing React frontend.

---

## 2. Target Architecture & Project Structure

The project will be organized by functional domain modules under `src/`:

```
backend/
├── src/
│   ├── app.js                         # Express app pipeline, security headers, CORS, body parsers
│   ├── server.js                      # Server lifecycle: DB connection, HTTP listener, Socket.IO
│   ├── config/
│   │   ├── db.js                      # Resilient Mongoose connection with lifecycle hooks
│   │   ├── env.js                     # Zod-validated environment variables
│   │   └── mailer.js                  # Nodemailer transport configured exclusively from env
│   ├── core/                          # Cross-cutting foundational modules
│   │   ├── errors/
│   │   │   ├── appError.js            # Base AppError class (isOperational, statusCode)
│   │   │   └── customErrors.js        # BadRequest, Unauthorized, Forbidden, NotFound, ValidationError
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js     # JWT extraction, session parsing, user injection
│   │   │   ├── rbac.middleware.js     # Declarative route guards (requireRoles, requireTenant)
│   │   │   ├── validate.middleware.js # Generic Zod schema validator (body, query, params)
│   │   │   └── error.middleware.js    # Centralized global error handling
│   │   └── utils/
│   │       ├── password.utils.js      # Bcrypt hashing & crypto-secure random string generator
│   │       ├── token.utils.js         # JWT creation and verification
│   │       └── response.utils.js      # Consistent JSON response utilities
│   ├── modules/                       # Domain Modules
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.validator.js
│   │   ├── users/
│   │   │   ├── users.routes.js        # Handles /users and aliases legacy /au routes
│   │   │   ├── users.controller.js
│   │   │   ├── users.service.js
│   │   │   └── users.validator.js
│   │   ├── academics/
│   │   │   ├── academics.routes.js    # Collages, Majors, Subjects, Semesters, Courses, Sections, Grades
│   │   │   ├── academics.controller.js
│   │   │   ├── academics.service.js
│   │   │   ├── academics.validator.js
│   │   │   └── models/
│   │   │       ├── Collage.js
│   │   │       ├── Major.js
│   │   │       ├── Subject.js
│   │   │       ├── Semester.js
│   │   │       ├── SemesterTemp.js
│   │   │       ├── Course.js
│   │   │       ├── Section.js
│   │   │       └── Grade.js
│   │   ├── chat/
│   │   │   ├── chat.routes.js         # Direct/Group chats, messages
│   │   │   ├── chat.controller.js
│   │   │   ├── chat.service.js
│   │   │   ├── chat.validator.js
│   │   │   └── models/
│   │   │       ├── Chat.js
│   │   │       └── Message.js
│   │   └── system/
│   │       ├── system.routes.js       # Admin health dashboard, search, metrics
│   │       ├── system.controller.js
│   │       ├── system.service.js
│   │       └── models/
│   │           ├── Logger.js
│   │           └── Performance.js
│   └── sockets/
│       └── chatSocket.js              # Socket.IO connection handling and room routing
├── tests/
│   ├── setup.js                       # Test environment setup with in-memory Mongo
│   ├── auth.test.js
│   ├── academics.test.js
│   ├── users.test.js
│   └── chat.test.js
└── package.json
```

---

## 3. Security, Authentication & Multi-Tenancy

### 3.1 Credential & Configuration Hardening
- Remove hardcoded credentials from `mailer.js`.
- Define `src/config/env.js` with Zod validation to ensure required variables (`PORT`, `MONGO_URL`, `JWT_SECRET`, `JWT_LIFETIME`, `EMAIL_USER`, `EMAIL_PASS`) exist on startup.
- Prevent unauthenticated registrations from assuming `super-admin` status. First account creation will require a setup key or explicit seeding script.

### 3.2 Authentication & User Session
- Verify JWT tokens from either `req.cookies.token` or `Authorization: Bearer <token>`.
- Attach normalized user metadata to `req.user`:
  ```js
  req.user = {
    id: user._id.toString(),
    email: user.email,
    role: user.role, // 'super-admin' | 'admin' | 'teacher' | 'student'
    universityId: user.university?.toString(),
    isDemoUser: user.isDemoUser || false,
  };
  ```
- **Throttled Activity Tracking:** Replace per-request database updates with a memory-cached throttle (only update `lastActivity` in DB if older than 10 minutes) executed asynchronously without blocking HTTP response time.

### 3.3 Declarative RBAC Middleware
Replace substring-based path filtering with explicit guards:
- `requireRoles(...allowedRoles)`: Verifies `req.user.role` is in the allowed list; throws `ForbiddenError` (403) otherwise.
  - `/api/v1/admins` $\rightarrow$ `requireRoles('super-admin')`
  - `/api/v1/collages`, `/api/v1/majors`, `/api/v1/subjects`, `/api/v1/semesters` $\rightarrow$ `requireRoles('admin', 'super-admin')`
  - Course editing & lessons $\rightarrow$ `requireRoles('teacher', 'admin', 'super-admin')`
- `enforceDemoReadOnly`: Blocks state-changing methods (`POST`, `PUT`, `PATCH`, `DELETE`) for demo accounts (`req.user.isDemoUser`).

### 3.4 Strict Multi-Tenant Scoping
- All service methods query through `university: req.user.universityId`.
- Super-admins can optionally supply a target `universityId` in request parameters or query strings.
- Attempts to access or modify resources belonging to another university return `404 Not Found`.

---

## 4. Domain Models & Business Logic

### 4.1 Academics Domain
- **Colleges & Majors:**
  - Fix cascading delete logic without using deprecated `remove()` hooks.
  - Fix singular/plural mismatch (`majors` vs `major`).
  - Correct schema validation strings.
- **Subjects & Courses:**
  - Correct `getSubject` implementation to fetch by ID using `Subject.findOne({ _id: id, university: req.user.universityId })`.
  - Fix course and section deletion cascading using proper `_id` references.
- **Sections & Lessons:**
  - Properly `await` all asynchronous operations on subdocuments (`addLesson`, `updateLesson`, `deleteLesson`).
  - Store lessons with valid MongoDB ObjectIds and sanitized video/topic properties.
- **Grades:**
  - Refactor grade items to a typed subdocument schema with validation for score ranges.
  - `createGrade`: Restrict grade creation only to students enrolled in that specific course.
  - Fix `updateGrade` calculation to validate bounds and eliminate invalid error messages.
- **Semester Initialization (`startSemester`):**
  - Execute template instantiation inside a MongoDB session transaction (`session.withTransaction(...)`) ensuring atomic creation of semester records, courses, student enrollment links, initial grade records, and group chat rooms.

### 4.2 Users Domain
- Unify user management routes into a single cohesive service.
- Disallow arbitrary `userId` parameters from `req.body` to prevent IDOR vulnerabilities.
- Provide route aliases for legacy chat routes (`/api/v1/au/allUsers`, `/api/v1/au/renameUser`, `/api/v1/au/avatarUpdate`, `/api/v1/au/passwordUpdate`).

### 4.3 Chat & Socket.IO Domain
- Fix ES Module path resolution for file uploads/attachments using `fileURLToPath(import.meta.url)`.
- Authenticate Socket.IO handshake connections using the JWT token.
- Secure chat membership: users can only view, fetch messages from, or send messages to chats where `users.includes(req.user.id)`.

### 4.4 System & Analytics Domain
- Fix date calculation in `dataCollector.js`: use `threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)`.
- Eliminate `Logger.find()` in-memory dump prior to MongoDB aggregation.
- Fix ReDoS vulnerability in search endpoints using escaped regex patterns and valid fields (`firstName`, `lastName`, `email`).

---

## 5. Request Validation & Centralized Error Handling

### 5.1 Zod Validation
- Reusable middleware `validateRequest({ body, query, params })`.
- Schemas defined per endpoint validating required fields, string lengths, valid MongoDB ObjectIds, and data types.

### 5.2 Centralized Error Handling
- Base `AppError` class with `statusCode`, `isOperational`, and error payload.
- Global `error.middleware.js` intercepts operational and database errors (Mongoose CastError, duplicate key 11000, validation errors) and returns consistent JSON structures:
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
  ```
- 500 Internal Server Errors log stack traces to internal logger while sending a safe message to clients.

---

## 6. Frontend Compatibility & Verification

### 6.1 Route & Contract Preservation
- Maintain all existing REST endpoint paths under `/api/v1/`.
- Maintain legacy aliases for chat endpoints under `/api/v1/au/`.
- Correct HTTP status codes on GET endpoints (returning 200 OK instead of 201 Created).
- Return proper JSON objects matching existing React Query and `customFetch` expectations.

### 6.2 Testing Harness
- **Vitest + Supertest**: Integration testing covering:
  1. Authentication & RBAC enforcement (rejecting unauthorized escalation, rejecting invalid roles).
  2. Multi-tenancy isolation (preventing cross-university data access).
  3. Academic operations (CRUD, start semester transaction, grade calculations).
  4. IDOR prevention in user profile and chat message operations.
- Script added to `backend/package.json`: `"test": "vitest run"`.
