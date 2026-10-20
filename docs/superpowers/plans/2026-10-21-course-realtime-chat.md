# Course Real-Time Discussion & Chat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a modern, fully-featured real-time Course Discussion & Chat subsystem providing both an in-page slide-over discussion drawer (`CourseChatDrawer.jsx`) on course pages and seamless deep-linking to the unified `/chat` hub with automated roster synchronization, message attachments, and course badging.

**Architecture:** Layered Node.js/Express/Socket.IO backend with dedicated course resolver endpoint `GET /api/v1/chats/course/:courseId`, integrated with React 18 / Mantine UI v6 frontend using `customFetch` and Socket.IO real-time channels.

**Tech Stack:** Node.js, Express, Socket.IO, Mongoose, React 18, Vite, Mantine UI v6, Tabler Icons, TanStack Query v5, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-21-course-realtime-chat-design.md`

## Global Constraints
- `GET /api/v1/chats/course/:courseId` must enforce university tenant isolation and verify that the requesting user is either a course teacher/admin or an enrolled student.
- The chat client MUST use `customFetch` (supporting HTTP-only cookies and standard response envelope unwrapping) rather than raw unauthenticated `axios`.
- Socket.IO must connect to `window.location.origin` or configured socket client instead of hardcoded `http://localhost:5000`.
- All backend tests (139/139 baseline) must remain green.
- Client build (`npm run build`) must compile cleanly with zero errors.

---

### Task 1: Backend Course Chat Endpoint & Integration Tests

**Files:**
- Modify: `backend/src/modules/chat/chat.service.js`
- Modify: `backend/src/modules/chat/chat.controller.js`
- Modify: `backend/src/modules/chat/chat.routes.js`
- Modify: `backend/tests/modules/auto-course-chat.test.js`

**Interfaces:**
- Produces: `GET /api/v1/chats/course/:courseId` returning `{ success: true, data: Chat }` with populated `course`, `users`, `groupAdmin`, `latestMessage`.

- [ ] **Step 1: Write integration test for `GET /api/v1/chats/course/:courseId`**

In `backend/tests/modules/auto-course-chat.test.js`, add test asserting `getCourseChat` returns populated course chat:
```javascript
it("GET /api/v1/chats/course/:courseId should return populated course discussion channel", async () => {
  const courseId = "64f1a2b3c4d5e6f7a8b9c0d1";
  const teacherId = "64f1a2b3c4d5e6f7a8b9c0d2";
  const mockChat = {
    _id: "chat123",
    chatName: "دورة Operating Systems",
    isGroupChat: true,
    course: { _id: courseId, name: "Operating Systems" },
    users: [{ _id: teacherId, firstName: "Ali", lastName: "Ahmed" }],
    groupAdmin: { _id: teacherId, firstName: "Ali" },
  };

  vi.spyOn(Chat, "findOne").mockReturnValue({
    populate: vi.fn().mockReturnValue({
      populate: vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          populate: vi.fn().mockResolvedValue(mockChat),
        }),
      }),
    }),
  });

  const res = await request(app)
    .get(`/api/v1/chats/course/${courseId}`)
    .set("Cookie", [`token=${teacherToken}`]);

  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.data.chatName).toBe("دورة Operating Systems");
});
```

- [ ] **Step 2: Run test to confirm it fails (endpoint not registered yet)**
  Run: `pnpm test tests/modules/auto-course-chat.test.js`

- [ ] **Step 3: Implement `getCourseChatService` and controller method**

In `backend/src/modules/chat/chat.service.js`:
```javascript
export const getCourseChatService = async (courseId, userId, universityId = null) => {
  // Ensure the course channel exists and roster is synced
  await ensureCourseChatChannel(courseId);

  const query = { course: courseId };
  if (universityId) query.university = universityId;

  const chat = await Chat.findOne(query)
    .populate("course", "name code cover")
    .populate("users", "name firstName lastName email avatar role")
    .populate("groupAdmin", "name firstName lastName email avatar")
    .populate("latestMessage");

  if (!chat) throw new NotFoundError("Course chat channel not found");
  return chat;
};
```

In `backend/src/modules/chat/chat.controller.js`:
```javascript
export const getCourseChat = async (req, res) => {
  const chat = await chatService.getCourseChatService(
    req.params.courseId,
    req.user.userId,
    req.user.universityId
  );
  sendSuccess(res, chat);
};
```

In `backend/src/modules/chat/chat.routes.js`:
```javascript
router.get("/course/:courseId", ctrl.getCourseChat);
```

- [ ] **Step 4: Run test to verify it passes**
  Run: `pnpm test tests/modules/auto-course-chat.test.js`
  Expected: PASS

- [ ] **Step 5: Commit Task 1**
  ```bash
  git add backend/src/modules/chat/ backend/tests/modules/auto-course-chat.test.js
  git commit -m "feat(chat): implement GET /api/v1/chats/course/:courseId endpoint"
  ```

---

### Task 2: Standardize Client Chat Transport & Socket Host

**Files:**
- Modify: `client/src/chat/utils/APIRoutes.js`
- Modify: `client/src/chat/components/Contacts.jsx:35-50`
- Modify: `client/src/chat/components/SingleChat.jsx:25-75`

**Interfaces:**
- Produces: Standardized, authenticated API requests using `customFetch` and dynamic Socket.IO origin.

- [ ] **Step 1: Update `client/src/chat/utils/APIRoutes.js`**
  - Set `host` dynamically: `window.location.origin` (or relative path).
  - Use `/api/v1/...` absolute paths for chat and message routes.

- [ ] **Step 2: Update `Contacts.jsx` to use `customFetch`**
  - Replace raw `axios.get(fetchChatsRoute)` with `customFetch.get('/chats')`.
  - Properly unwrap response `{ data }` (supporting both paginated `{ data: items }` and arrays).

- [ ] **Step 3: Update `SingleChat.jsx` to use `customFetch` with `POST`**
  - Replace `axios.put(sendMessageRoute, ...)` with `customFetch.post('/messages/addmsg', { chatId, content, attachment })`.
  - Replace `axios.get(recieveMessageRoute)` with `customFetch.get('/messages/getmsg/:chatId')`.

- [ ] **Step 4: Verify client build**
  Run: `npm run build` in `client`
  Expected: PASS

- [ ] **Step 5: Commit Task 2**
  ```bash
  git add client/src/chat/
  git commit -m "fix(client-chat): standardize chat transport using customFetch and dynamic socket host"
  ```

---

### Task 3: In-Page Course Discussion Drawer (`CourseChatDrawer`)

**Files:**
- Create: `client/src/components/chat/CourseChatDrawer.jsx`
- Create: `client/src/components/chat/index.js`
- Modify: `client/src/pages/admin/CourseInfo.jsx:185-215`

**Interfaces:**
- `CourseChatDrawer`: props `{ opened, onClose, courseId, courseName }`
- Produces: In-page slide-over chat with live messages, file attachment support, and deep-link button.

- [ ] **Step 1: Create `CourseChatDrawer.jsx`**
  - Mantine Drawer from right (width: 480px).
  - Queries `GET /api/v1/chats/course/:courseId` using TanStack Query.
  - Queries `GET /api/v1/chats/:chatId/messages` for conversation history.
  - Connects to Socket.IO and emits `join chat`.
  - Listens for `message recieved` and appends incoming messages live.
  - Outgoing message input with `Enter` shortcut and file upload attachment using `uploadMedia`.
  - Header button: `فتح في شاشة المحادثات الكاملة` navigating to `/chat?courseId=${courseId}`.

- [ ] **Step 2: Create `client/src/components/chat/index.js`**
  - Export `CourseChatDrawer`.

- [ ] **Step 3: Add Course Chat button in `CourseInfo.jsx`**
  - Add button in `CourseInfo.jsx` action row:
    ```jsx
    <Button
      onClick={() => setChatDrawerOpened(true)}
      variant="light"
      color="cyan"
      size="md"
      radius="md"
      leftIcon={<IconMessageDots size={18} />}
    >
      غرفة المناقشة الأكاديمية (Course Chat)
    </Button>
    ```
  - Mount `<CourseChatDrawer opened={chatDrawerOpened} onClose={() => setChatDrawerOpened(false)} courseId={courseData._id || courseData.id} courseName={courseData.name} />`.

- [ ] **Step 4: Verify client build**
  Run: `npm run build` in `client`
  Expected: PASS

- [ ] **Step 5: Commit Task 3**
  ```bash
  git add client/src/components/chat/ client/src/pages/admin/CourseInfo.jsx
  git commit -m "feat(client): implement CourseChatDrawer and integrate into CourseInfo"
  ```

---

### Task 4: Full Chat Hub Deep-Link & Course Badging

**Files:**
- Modify: `client/src/chat/pages/Chat.jsx`
- Modify: `client/src/chat/components/Contacts.jsx`

**Interfaces:**
- Consumes: URL query parameter `?courseId=...`
- Produces: Auto-selection of course chat room on `/chat` and `مقرر دراسي` badge in contacts list.

- [ ] **Step 1: Update `Chat.jsx` for URL `courseId` resolution**
  - Read `useLocation().search` to check `courseId = searchParams.get('courseId')`.
  - If present, query `/api/v1/chats/course/:courseId` and set `setSelectedChat(data)`.

- [ ] **Step 2: Update `Contacts.jsx` with Course Chat badge**
  - In chat items list, if `chat.course || chat.isGroupChat`:
    - Display `مقرر دراسي` badge with `IconBook`.
    - Render course icon / avatar.

- [ ] **Step 3: Verify client build**
  Run: `npm run build` in `client`
  Expected: PASS

- [ ] **Step 4: Commit Task 4**
  ```bash
  git add client/src/chat/
  git commit -m "feat(client-chat): add URL deep-linking and course badging to chat hub"
  ```

---

### Task 5: End-to-End Verification & Documentation

**Files:**
- Full backend suite
- Full frontend build

- [ ] **Step 1: Run full backend test suite**
  Run: `pnpm test` in `backend`
  Expected: PASS (all tests pass)

- [ ] **Step 2: Run client production build**
  Run: `npm run build` in `client`
  Expected: PASS

- [ ] **Step 3: Commit and update plan status**
