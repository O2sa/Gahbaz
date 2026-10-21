# Gahbaz (منصة جَهْبَذ) — API Reference & Integration Guide

The Gahbaz API provides a comprehensive RESTful interface and WebSocket events for academic management, continuous assessment, courseware delivery, and communication.

- **Interactive Swagger UI**: `https://elearningsystem.onrender.com/api/docs` (or local `http://localhost:5000/api/docs`)
- **OpenAPI 3.0 JSON Spec**: `/api/docs.json`
- **Default Base URL**: `/api/v1`

---

## 1. Authentication & Security

All private endpoints require authentication via either:
1. **HTTP-Only Cookie**: `token` cookie set automatically upon successful login.
2. **Bearer Token**: `Authorization: Bearer <jwt-token>` header.

### Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new user | Public (Rate-limited) |
| `POST` | `/api/v1/auth/login` | Authenticate with email/password | Public (Rate-limited) |
| `GET` | `/api/v1/auth/logout` | Invalidate cookie session | Public |
| `GET` | `/api/v1/users/current-user` | Retrieve current authenticated user profile | Authenticated |

---

## 2. Core Domain Endpoints

### Academic Management

| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `GET` / `POST` | `/api/v1/colleges` | List or create university colleges | Admin |
| `GET` / `PATCH` / `DELETE` | `/api/v1/colleges/:id` | Read, update, or delete a college | Admin |
| `GET` / `POST` | `/api/v1/majors` | List or create academic majors | Admin |
| `GET` / `PATCH` / `DELETE` | `/api/v1/majors/:id` | Read, update, or delete a major | Admin |
| `GET` / `POST` | `/api/v1/subjects` | Master catalog of subjects | Admin, Teacher |
| `GET` / `POST` | `/api/v1/semesters` | List or launch academic semesters | Admin |
| `GET` | `/api/v1/semesters/current` | Retrieve active current semester | All Users |
| `GET` / `POST` | `/api/v1/semester-templates` | Manage curriculum templates | Admin |

### Courseware & Syllabi

| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/courses` | Query courses with filtering & pagination | All Users |
| `POST` | `/api/v1/courses` | Create new course offering | Admin, Teacher |
| `GET` / `PATCH` | `/api/v1/courses/:id` | Read or update course details | All Users / Instructor |
| `POST` | `/api/v1/sections` | Create syllabus section | Admin, Teacher |
| `POST` | `/api/v1/sections/:sectionId/lessons` | Add video/lecture lesson to section | Admin, Teacher |

### Continuous Assessment, Grades & Transcripts

| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/grades/course/:courseId` | Faculty Gradebook with assessment breakdown | Teacher, Admin |
| `PATCH` | `/api/v1/grades/:id` | Update student continuous assessment score | Teacher, Admin |
| `GET` | `/api/v1/grades/student/:studentId` | Query student academic scores | Student, Admin |
| `GET` | `/api/v1/transcripts/student/:studentId` | Official academic transcript & cumulative GPA | Student, Admin |

### Assignments & Student Submissions

| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `GET` / `POST` | `/api/v1/assignments/course/:courseId` | List or publish course assignments | Teacher, Student |
| `POST` | `/api/v1/assignments/:id/submissions` | Submit coursework with file attachment | Student |
| `PATCH` | `/api/v1/assignments/:id/submissions/:subId/grade` | Grade student submission with feedback | Teacher |

### Student Self-Service Course Enrollment

| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/enrollment/available` | Browse available courses for current term | Student |
| `POST` | `/api/v1/enrollment/register` | Register courses (credit & prerequisite checked)| Student |
| `POST` | `/api/v1/enrollment/drop` | Drop registered course with roster sync | Student |

### Real-Time Communication & Chat

| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/chats` | Retrieve user active chat rooms | All Users |
| `GET` | `/api/v1/chats/course/:courseId` | Retrieve or create course chat room | All Users |
| `GET` / `POST` | `/api/v1/messages` | Paginated messages query or send message | All Users |

### Media Upload & Storage (`/api/v1/media`)

| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/media/upload` | Direct multipart upload to active driver | Authenticated |
| `POST` | `/api/v1/media/presign-upload` | Request presigned S3/Wasabi upload URL | Authenticated |
| `GET` | `/api/v1/media/stream/:key` | Secure streaming proxy for private videos | Authenticated |

---

## 3. Real-Time WebSocket Events (Socket.IO)

- **Connection**: Connect to `http://localhost:5000` or production host with token auth.
- **Client Emits**:
  - `join_room` `{ roomId }`: Join a course channel or direct conversation.
  - `send_message` `{ roomId, message, senderId, attachments }`: Broadcast message.
  - `typing` `{ roomId, userId, userName }`: Real-time typing indicators.
- **Server Emits**:
  - `receive_message`: Delivers new message payload.
  - `user_typing` / `user_stopped_typing`: Real-time presence updates.
