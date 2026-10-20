# Design Specification: Course Real-Time Discussion & Chat System

- **Document Version:** 1.0.0
- **Date:** 2026-10-21
- **Status:** Approved Baseline Specification
- **System Area:** Real-Time Academic Collaboration & Course Discussion (LMS/Chat)
- **Target Audience:** Frontend Engineers, Backend Engineers, QA Testers

---

## 1. Executive Summary & Problem Statement

Active academic engagement requires timely two-way communication between professors and enrolled students. In **Gahbaz**, each course offering represents an academic community where students need to ask questions about lectures, assignments, and exams, and professors need to provide real-time guidance.

### Current Gaps:
1. **Disconnected Navigation:** No button or link exists in the Course Hub (`CourseInfo.jsx`) to access the course's discussion room.
2. **Missing Course Chat Resolver:** The backend lacks a dedicated `GET /api/v1/chats/course/:courseId` endpoint to resolve or auto-provision the course's chat room directly from the course page.
3. **Legacy Chat Network Transport:** The frontend chat modules in `client/src/chat/` rely on raw `axios` calls with hardcoded `http://localhost:5000` URLs and mismatched HTTP methods (e.g. `PUT` for sending messages where the backend router expects `POST`), bypassing the system's authenticated cookie pipeline (`customFetch`).
4. **Lack of In-Context Discussion:** When students are watching video lessons or reviewing syllabus topics, they cannot ask a quick question without leaving the page.

This specification establishes an **Integrated Hybrid Model**:
- **In-Page Discussion Drawer (`CourseChatDrawer.jsx`):** A slide-over live chat drawer right inside `CourseInfo.jsx` preserving student context.
- **Deep-Linked Full Chat Hub:** Seamless auto-navigation to `/chat?courseId=:courseId` with distinctive course badging in the contacts sidebar.

---

## 2. System Architecture & Hybrid Workflow

```
+---------------------------------------------------------------------------------+
|                        Course Details Page (CourseInfo.jsx)                     |
+---------------------------------------------------------------------------------+
                                         |
                       [غرفة المناقشة الأكاديمية] Button
                                         |
                                         v
                      +---------------------------------------+
                      |       CourseChatDrawer.jsx            |
                      |  - Real-time Socket.IO feed           |
                      |  - Roster count & teacher badge       |
                      |  - Instant message & file attachments |
                      |  - [فتح في شاشة المحادثات الكاملة] -> |
                      +---------------------------------------+
                                         |
                                         v
                      +---------------------------------------+
                      |         Full Chat Hub (/chat)         |
                      |  - Auto-selects course channel        |
                      |  - Course badge & icon in Contacts    |
                      |  - Synchronized conversation history  |
                      +---------------------------------------+
```

---

## 3. Backend Data Contracts & Sockets

### 3.1 Course Chat Resolver Endpoint
- **Method & Path:** `GET /api/v1/chats/course/:courseId`
- **Protection:** Authenticated (`authGuard`), tenant-scoped (`university: req.user.universityId`).
- **Behavior:**
  1. Verifies the user is either an instructor/admin or an enrolled student in the course.
  2. Invokes `ensureCourseChatChannel(courseId)` to provision or retrieve the channel.
  3. Populates `course` (name, code), `users` (`name`, `firstName`, `lastName`, `email`, `avatar`, `role`), `groupAdmin` (`name`, `avatar`), and `latestMessage`.
  4. Returns standard response envelope:
     ```json
     {
       "success": true,
       "data": {
         "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
         "chatName": "دورة هياكل البيانات",
         "isGroupChat": true,
         "course": { "_id": "...", "name": "هياكل البيانات", "code": "CS201" },
         "users": [ ... ],
         "groupAdmin": { "_id": "...", "name": "د. فيصل الشمري" },
         "latestMessage": { ... }
       }
     }
     ```

### 3.2 Socket.IO Real-Time Events
- **Connection Handshake:**
  - Authenticates via HTTP-only cookie (`token=...`) or `socket.handshake.auth.token`.
  - Joins the personal room `socket.userId` automatically.
- **Room Join:**
  - Client emits `join chat` with `chatId`.
  - Server joins `socket.join(chatId)`.
- **Message Dispatch:**
  - When a message is saved via `POST /api/v1/messages/addmsg` (or `POST /api/v1/chats/:chatId/messages`), the client emits `new message` with `{ chatId, message }`.
  - Server broadcasts `message recieved` to all sockets in that room.

---

## 4. Frontend Component Design

### 4.1 Course Info Button & Integration (`CourseInfo.jsx`)
In `client/src/pages/admin/CourseInfo.jsx`, in the primary action button row:
```jsx
<Button
  onClick={() => setChatDrawerOpened(true)}
  variant="light"
  color="teal"
  size="md"
  radius="md"
  leftIcon={<IconMessageDots size={18} />}
>
  غرفة المناقشة الأكاديمية (Course Chat)
</Button>
```

### 4.2 In-Page Course Chat Drawer (`CourseChatDrawer.jsx`)
- **Location:** `client/src/components/chat/CourseChatDrawer.jsx`
- **Props:** `{ opened, onClose, courseId, courseName }`
- **Header:**
  - Course icon and title: `مناقشة مقرر: {courseName}`.
  - Active participant badge: e.g. `{chat.users.length} عضواً`.
  - Primary button: `فتح في شاشة المحادثات الكاملة` (navigates to `/chat?courseId=${courseId}`).
- **Message Feed:**
  - Live scroll area populated from `GET /api/v1/chats/:chatId/messages`.
  - Message bubble styles:
    - Outgoing messages (sent by current user): aligned right, brand primary background, white text.
    - Incoming messages (classmates / professor): aligned left, subtle gray/dark card with sender avatar, name, and role badge (`أستاذ المقرر` in amber if `groupAdmin`).
    - File attachments: render download button / image thumbnail.
    - Local Arabic timestamp formatting (`hh:mm a`).
  - Auto-scroll to latest message on receive.
- **Input Bar:**
  - TextInput with `placeholder="اكتب رسالتك أو استفسارك هنا..."`.
  - File upload trigger using `uploadMedia(file, { folder: 'attachments' })`.
  - Send button with `IconSend` supporting `Enter` key submission.

### 4.3 Full Chat Hub Integration (`/chat`)
- **Query Parameter Resolution:**
  - When landing on `/chat?courseId=:courseId`, `Chat.jsx` reads `searchParams.get('courseId')`.
  - Calls `GET /api/v1/chats/course/:courseId` via `customFetch`.
  - Sets `selectedChat` and emits `join chat` to Socket.IO.
- **Course Badging in Contacts List (`Contacts.jsx`):**
  - If `chat.isGroupChat && chat.course`:
    - Renders `مقرر دراسي` badge in teal.
    - Displays course name and `IconBook`.
    - Shows latest message snippet and timestamp.

---

## 5. Network & Transport Standardization

To eliminate previous network failures:
1. **Host Configuration:**
   - In `client/src/chat/utils/APIRoutes.js` and Socket initialization, use relative URL or dynamic `window.location.origin` (or dev proxy `/api/v1`) rather than hardcoded `http://localhost:5000`.
2. **Authenticated Transport:**
   - Replace raw `axios` calls with `customFetch` across all chat modules (`Contacts.jsx`, `ChatContainer.jsx`, `SingleChat.jsx`), ensuring:
     - `withCredentials: true` (cookies sent automatically).
     - Standard `{ success: true, data }` unwrapping.
     - HTTP `POST` for message creation.

---

## 6. Data Invariants & Security

- **Multi-Tenant Isolation:** Users can only access chats belonging to their registered `university`.
- **Course Enrollment Verification:** Non-enrolled students are rejected with `403 Forbidden` from joining or posting in course discussion rooms.
- **Automated Roster Synchronization:**
  - Registering in a course automatically adds the student to the chat (`syncCourseStudentRoster({ action: "add" })`).
  - Dropping a course automatically removes the student (`syncCourseStudentRoster({ action: "drop" })`).
  - Deleting a course cascades to delete its chat room.

---

## 7. Verification & Testing Plan

1. **Backend Tests:**
   - Add unit/integration tests in `backend/tests/modules/auto-course-chat.test.js`:
     - `GET /api/v1/chats/course/:courseId` returns course chat with populated users and teacher groupAdmin.
     - Sending a message to a course chat room saves to database and emits to room.
   - Run: `pnpm test tests/modules/auto-course-chat.test.js`.
2. **Frontend Compilation & Smoke Test:**
   - Run `npm run build` in `client` to verify zero build or JSX errors.
   - Verify drawer opening from `CourseInfo.jsx`, message sending, and deep-link navigation to `/chat?courseId=...`.
