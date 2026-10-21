# Unified User Name & Enhanced Role Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Unify user names into a single `name` field across DB models and APIs, apply strict name validation (Arabic & Latin letters, spaces, hyphens, 3–70 chars), enhance Student, Teacher, and Admin modals with major, title, phone, and auto-generated credentials visibility.

**Architecture:** Mongoose schema evolution on `User` with `name` as primary stored field and virtual getters/setters for `firstName`/`lastName`. Shared Zod strict name validator. Enhanced CRUD controllers returning generated credentials envelope `{ user, tempPassword }`. Mantine modal forms in the client with live feedback and 1-click credential copying.

**Tech Stack:** Node.js, Express, Mongoose, Zod, Vitest, Supertest, React, Mantine UI, Tabler Icons.

**Spec:** `docs/superpowers/specs/2026-10-20-unified-user-management-design.md`

## Global Constraints
- `name` field must match regex: `/^[\u0600-\u06FFa-zA-Z\s\-]{3,70}$/` (no numbers or special symbols, 3–70 chars).
- Backward compatibility: any legacy code accessing `user.firstName` or `user.lastName` must continue working via virtual getters.
- Passing `firstName` and `lastName` without `name` into `User.create()` or pre-validate must automatically synthesize `name = `${firstName} ${lastName}`.trim()`.
- Password generation: if omitted on user creation, generate an 8-character secure random password and return it in `tempPassword`.
- Existing backend tests must remain green (current baseline: 125 tests passing).

---

### Task 1: Strict User Name Validator & Base User Schema Evolution

**Files:**
- Create: `backend/src/core/validators/user.validator.js`
- Modify: `backend/src/models/User.js`
- Test: `backend/tests/core/user-validation.test.js`

**Interfaces:**
- Produces: `userNameSchema` (Zod string validator for names)
- Modifies: `User` model with primary `name` field and `firstName`/`lastName` virtuals

- [x] **Step 1: Write the failing unit tests for user validation and User model**

Create `backend/tests/core/user-validation.test.js`:
```javascript
import { describe, it, expect } from 'vitest';
import { userNameSchema } from '../../src/core/validators/user.validator.js';
import User from '../../src/models/User.js';

describe('Strict User Name Validation', () => {
  it('should accept valid Arabic and Latin names', () => {
    expect(userNameSchema.safeParse('عبدالرحمن المطيري').success).toBe(true);
    expect(userNameSchema.safeParse('Dr. John Doe').success).toBe(false); // contains period
    expect(userNameSchema.safeParse('John Doe').success).toBe(true);
    expect(userNameSchema.safeParse('Jean-Luc Picard').success).toBe(true);
  });

  it('should reject names with numbers or symbols', () => {
    expect(userNameSchema.safeParse('Ahmed123').success).toBe(false);
    expect(userNameSchema.safeParse('Sara@Admin!').success).toBe(false);
    expect(userNameSchema.safeParse('User_Name').success).toBe(false);
  });

  it('should reject names shorter than 3 or longer than 70 characters', () => {
    expect(userNameSchema.safeParse('Al').success).toBe(false);
    expect(userNameSchema.safeParse('a'.repeat(71)).success).toBe(false);
  });

  it('User model should have name as primary field and support firstName/lastName virtuals', () => {
    const user = new User({
      name: 'فيصل الشمري',
      email: 'faisal.shammari@test.com',
    });
    expect(user.name).toBe('فيصل الشمري');
    expect(user.firstName).toBe('فيصل');
    expect(user.lastName).toBe('الشمري');

    // Test setter
    user.firstName = 'طارق';
    expect(user.name).toBe('طارق الشمري');
    expect(user.firstName).toBe('طارق');
  });

  it('User model should synthesize name from firstName and lastName if name is omitted', async () => {
    const user = new User({
      firstName: 'سارة',
      lastName: 'الأحمد',
      email: 'sara.ahmed@test.com',
    });
    await user.validate();
    expect(user.name).toBe('سارة الأحمد');
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/core/user-validation.test.js`
Expected: FAIL (cannot find `user.validator.js`, schema missing `name` as primary field)

- [x] **Step 3: Implement `userNameSchema` and update `User.js`**

Create `backend/src/core/validators/user.validator.js`:
```javascript
import { z } from 'zod';

export const NAME_REGEX = /^[\u0600-\u06FFa-zA-Z\s\-]{3,70}$/;

export const userNameSchema = z
  .string({ required_error: 'الاسم مطلوب' })
  .trim()
  .min(3, 'يجب أن يتكون الاسم من 3 أحرف على الأقل')
  .max(70, 'يجب ألا يتجاوز الاسم 70 حرفاً')
  .regex(NAME_REGEX, 'يجب أن يحتوي الاسم على أحرف عربية أو إنجليزية ومسافات فقط بدون أرقام أو رموز');
```

Update `backend/src/models/User.js`:
Add `name` field, virtual getters/setters for `firstName` and `lastName`, and `pre('validate')` fallback:
```javascript
import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: 3,
      maxlength: 70,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email",
      },
    },
    password: {
      type: String,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin", "super-admin", "user"],
      default: "student",
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      index: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "kind",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual getters and setters for backwards compatibility
UserSchema.virtual("firstName")
  .get(function () {
    return this.name ? this.name.split(/\s+/)[0] : "";
  })
  .set(function (val) {
    const lastName = this.name ? this.name.split(/\s+/).slice(1).join(" ") : "";
    this.name = `${val || ""} ${lastName}`.trim();
  });

UserSchema.virtual("lastName")
  .get(function () {
    return this.name ? this.name.split(/\s+/).slice(1).join(" ") : "";
  })
  .set(function (val) {
    const firstName = this.name ? this.name.split(/\s+/)[0] : "";
    this.name = `${firstName} ${val || ""}`.trim();
  });

// Pre-validate hook to synthesize name if legacy firstName/lastName were provided
UserSchema.pre("validate", function (next) {
  if (!this.name && (this.get("firstName") || this.get("lastName"))) {
    this.name = `${this.get("firstName") || ""} ${this.get("lastName") || ""}`.trim();
  }
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
```

- [x] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/core/user-validation.test.js`
Expected: PASS (4 tests passing)

- [x] **Step 5: Commit**

```bash
git add backend/src/core/validators/user.validator.js backend/src/models/User.js backend/tests/core/user-validation.test.js
git commit -m "feat(users): add strict userNameSchema and make name primary field with virtuals"
```

---

### Task 2: Student Model & Validation Enhancement with Credential Visibility

**Files:**
- Modify: `backend/src/models/Student.js`
- Modify: `backend/src/modules/students/students.validator.js`
- Modify: `backend/src/modules/students/students.service.js`
- Modify: `backend/src/modules/students/students.controller.js`
- Test: `backend/tests/modules/students-name.test.js`

**Interfaces:**
- Consumes: `userNameSchema` from `backend/src/core/validators/user.validator.js`
- Produces: Enhanced `POST /api/v1/students` returning `{ success: true, data: student, tempPassword }`

- [x] **Step 1: Write integration tests for student creation with unified name & optional credentials**

Create `backend/tests/modules/students-name.test.js`:
```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import User from '../../src/models/User.js';
import Student from '../../src/models/Student.js';
import University from '../../src/models/University.js';
import { createJWT } from '../../src/core/utils/token.utils.js';

describe('Student Name & Credentials Management', () => {
  let adminToken;
  let universityId;

  beforeEach(async () => {
    await User.deleteMany({});
    await University.deleteMany({});

    const university = await University.create({ name: 'جامعة قحطاني', subdomain: 'gahbaz' });
    universityId = university._id;

    const admin = await User.create({
      name: 'مدير النظام',
      email: 'admin@test.com',
      role: 'admin',
      isAdmin: true,
      university: universityId,
    });

    adminToken = createJWT({
      userId: admin._id,
      role: 'admin',
      universityId: universityId.toString(),
    });
  });

  it('POST /api/v1/students should create student with single name and return tempPassword', async () => {
    const res = await request(app)
      .post('/api/v1/students')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'سارة محمد الأحمد',
        email: 'sara.ahmed@student.test',
        phone: '0551122334',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('سارة محمد الأحمد');
    expect(res.body.data.email).toBe('sara.ahmed@student.test');
    expect(res.body.tempPassword).toBeDefined();
    expect(res.body.tempPassword.length).toBeGreaterThanOrEqual(8);
  });

  it('POST /api/v1/students should reject invalid names containing numbers or special chars', async () => {
    const res = await request(app)
      .post('/api/v1/students')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Student123!',
        email: 'bad.name@student.test',
      });

    expect(res.status).toBe(400);
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/modules/students-name.test.js`
Expected: FAIL (validator expects `firstName` and `lastName`, doesn't accept `name`, tempPassword not returned in envelope)

- [x] **Step 3: Update Student model, validator, and service**

In `backend/src/models/Student.js`:
Add `studentId` field, ensure `major` is optional:
```javascript
import mongoose from "mongoose";
import User from "./User.js";

const StudentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    trim: true,
    default: "",
  },
  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Major",
    default: null,
  },
  comingSemester: {
    type: Number,
    default: 0,
  },
  semesters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
    },
  ],
  grades: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grade",
    },
  ],
});

export default User.discriminators?.Student || User.discriminator("Student", StudentSchema);
```

In `backend/src/modules/students/students.validator.js`:
```javascript
import { z } from "zod";
import { userNameSchema } from "../../core/validators/user.validator.js";

export const createStudentSchema = z.object({
  name: userNameSchema.optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email format"),
  major: z.string().optional().nullable(),
  studentId: z.string().optional(),
  phone: z.union([z.number(), z.string()]).optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
}).refine((data) => Boolean(data.name || (data.firstName && data.lastName)), {
  message: "الاسم مطلوب",
  path: ["name"],
});

export const updateStudentSchema = z.object({
  name: userNameSchema.optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  major: z.string().optional().nullable(),
  studentId: z.string().optional(),
  phone: z.union([z.number(), z.string()]).optional(),
  comingSemester: z.number().optional(),
});
```

In `backend/src/modules/students/students.service.js`:
```javascript
export const createStudentService = async (data, universityId) => {
  const name = data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim();
  const rawPassword = data.password || generateSecurePassword(8);
  const hashedPassword = await hashPassword(rawPassword);

  const student = await Student.create({
    ...data,
    name,
    university: universityId,
    password: hashedPassword,
    role: "student",
  });

  await sendMail(
    student.email,
    "Welcome to Gahbaz - Your Temporary Password",
    `Hello ${student.name},\n\nYour account has been created with temporary password: ${rawPassword}\nPlease change it after logging in.`
  );

  const savedStudent = await Student.findById(student._id).select("-password").populate("major");
  return {
    student: savedStudent,
    tempPassword: rawPassword,
  };
};

export const updateStudentService = async (id, data, universityId) => {
  const updatePayload = { ...data };
  if (data.name) {
    updatePayload.name = data.name.trim();
  } else if (data.firstName || data.lastName) {
    updatePayload.name = `${data.firstName || ''} ${data.lastName || ''}`.trim();
  }

  const student = await Student.findOneAndUpdate(
    { _id: id, university: universityId },
    updatePayload,
    { new: true }
  ).select("-password").populate("major");
  if (!student) throw new NotFoundError("Student not found");
  return student;
};
```

In `backend/src/modules/students/students.controller.js`:
```javascript
export const createStudent = async (req, res) => {
  const { student, tempPassword } = await studentsService.createStudentService(req.body, req.user.universityId);
  return res.status(StatusCodes.CREATED).json({
    success: true,
    data: student,
    tempPassword,
  });
};
```

- [x] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/modules/students-name.test.js`
Expected: PASS (2 tests passing)

- [x] **Step 5: Commit**

```bash
git add backend/src/models/Student.js backend/src/modules/students/ backend/tests/modules/students-name.test.js
git commit -m "feat(students): support unified name, strict validation, and tempPassword visibility"
```

---

### Task 3: Teacher Model & Validation Enhancement with Credential Visibility

**Files:**
- Modify: `backend/src/models/Teacher.js`
- Modify: `backend/src/modules/teachers/teachers.validator.js`
- Modify: `backend/src/modules/teachers/teachers.service.js`
- Modify: `backend/src/modules/teachers/teachers.controller.js`
- Test: `backend/tests/modules/teachers-name.test.js`

**Interfaces:**
- Consumes: `userNameSchema` from `backend/src/core/validators/user.validator.js`
- Produces: Enhanced `POST /api/v1/teachers` returning `{ success: true, data: teacher, tempPassword }`

- [x] **Step 1: Write integration tests for teacher creation with unified name & title**

Create `backend/tests/modules/teachers-name.test.js`:
```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import User from '../../src/models/User.js';
import University from '../../src/models/University.js';
import { createJWT } from '../../src/core/utils/token.utils.js';

describe('Teacher Name & Title Management', () => {
  let adminToken;
  let universityId;

  beforeEach(async () => {
    await User.deleteMany({});
    await University.deleteMany({});

    const university = await University.create({ name: 'جامعة قحطاني', subdomain: 'gahbaz' });
    universityId = university._id;

    const admin = await User.create({
      name: 'مدير النظام',
      email: 'admin@test.com',
      role: 'admin',
      isAdmin: true,
      university: universityId,
    });

    adminToken = createJWT({
      userId: admin._id,
      role: 'admin',
      universityId: universityId.toString(),
    });
  });

  it('POST /api/v1/teachers should create teacher with name, title, and return tempPassword', async () => {
    const res = await request(app)
      .post('/api/v1/teachers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'فيصل الشمري',
        title: 'دكتور',
        email: 'faisal.shammari@teacher.test',
        phone: '0559988776',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('فيصل الشمري');
    expect(res.body.data.title).toBe('دكتور');
    expect(res.body.tempPassword).toBeDefined();
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/modules/teachers-name.test.js`
Expected: FAIL

- [x] **Step 3: Update Teacher model, validator, and service**

In `backend/src/models/Teacher.js`:
Ensure `title` defaults to `""` and is trimmed:
```javascript
import mongoose from "mongoose";
import User from "./User.js";

const TeacherSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "",
    trim: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
});

export default User.discriminators?.Teacher || User.discriminator("Teacher", TeacherSchema);
```

In `backend/src/modules/teachers/teachers.validator.js`:
```javascript
import { z } from "zod";
import { userNameSchema } from "../../core/validators/user.validator.js";

export const createTeacherSchema = z.object({
  name: userNameSchema.optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email format"),
  title: z.string().optional(),
  phone: z.union([z.number(), z.string()]).optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
}).refine((data) => Boolean(data.name || (data.firstName && data.lastName)), {
  message: "الاسم مطلوب",
  path: ["name"],
});

export const updateTeacherSchema = z.object({
  name: userNameSchema.optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  title: z.string().optional(),
  phone: z.union([z.number(), z.string()]).optional(),
});
```

In `backend/src/modules/teachers/teachers.service.js`:
```javascript
export const createTeacherService = async (data, universityId) => {
  const name = data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim();
  const rawPassword = data.password || generateSecurePassword(8);
  const hashedPassword = await hashPassword(rawPassword);

  const teacher = await Teacher.create({
    ...data,
    name,
    university: universityId,
    password: hashedPassword,
    role: "teacher",
  });

  await sendMail(
    teacher.email,
    "Gahbaz Teacher Account Created",
    `Your teacher account has been created with temporary password: ${rawPassword}\nPlease change it upon login.`
  );

  const savedTeacher = await Teacher.findById(teacher._id).select("-password");
  return {
    teacher: savedTeacher,
    tempPassword: rawPassword,
  };
};

export const updateTeacherService = async (id, data, universityId) => {
  const updatePayload = { ...data };
  if (data.name) {
    updatePayload.name = data.name.trim();
  } else if (data.firstName || data.lastName) {
    updatePayload.name = `${data.firstName || ''} ${data.lastName || ''}`.trim();
  }

  const updatedTeacher = await Teacher.findOneAndUpdate(
    { _id: id, university: universityId },
    updatePayload,
    { new: true }
  ).select("-password");
  if (!updatedTeacher) throw new NotFoundError("Teacher not found");
  return updatedTeacher;
};
```

In `backend/src/modules/teachers/teachers.controller.js`:
```javascript
export const createTeacher = async (req, res) => {
  const { teacher, tempPassword } = await teachersService.createTeacherService(req.body, req.user.universityId);
  return res.status(StatusCodes.CREATED).json({
    success: true,
    data: teacher,
    tempPassword,
  });
};
```

- [x] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/modules/teachers-name.test.js`
Expected: PASS

- [x] **Step 5: Commit**

```bash
git add backend/src/models/Teacher.js backend/src/modules/teachers/ backend/tests/modules/teachers-name.test.js
git commit -m "feat(teachers): support unified name, title, and tempPassword visibility"
```

---

### Task 4: Admin Validation, Universal Search, and Seed Migration

**Files:**
- Modify: `backend/src/modules/admins/admins.validator.js`
- Modify: `backend/src/modules/admins/admins.service.js`
- Modify: `backend/src/modules/admins/admins.controller.js`
- Modify: `backend/src/modules/users/users.validator.js`
- Modify: `backend/src/modules/users/users.service.js`
- Modify: `backend/src/seeds/seedFullDemoData.js`
- Modify: `backend/src/seeds/seedDemoUsers.js`

**Interfaces:**
- Produces: Universal search across `name`, `email`, `phone` in `users.service.js`
- Produces: `POST /api/v1/admins` returning `{ success: true, data: admin, tempPassword }`

- [x] **Step 1: Write test for universal user search and admin temp password**

Create `backend/tests/modules/users-search.test.js`:
```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import User from '../../src/models/User.js';
import University from '../../src/models/University.js';
import { createJWT } from '../../src/core/utils/token.utils.js';

describe('Universal User Search & Admin Credentials', () => {
  let adminToken;
  let universityId;

  beforeEach(async () => {
    await User.deleteMany({});
    await University.deleteMany({});

    const university = await University.create({ name: 'جامعة قحطاني', subdomain: 'gahbaz' });
    universityId = university._id;

    const admin = await User.create({
      name: 'مدير النظام الأول',
      email: 'admin.super@test.com',
      role: 'admin',
      isAdmin: true,
      university: universityId,
      phone: '0501112233',
    });

    adminToken = createJWT({
      userId: admin._id,
      role: 'admin',
      universityId: universityId.toString(),
    });
  });

  it('GET /api/v1/users should match search queries on name', async () => {
    const res = await request(app)
      .get('/api/v1/users?search=النظام')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.users.length).toBe(1);
    expect(res.body.data.users[0].name).toBe('مدير النظام الأول');
  });

  it('POST /api/v1/admins should create admin and return tempPassword', async () => {
    const res = await request(app)
      .post('/api/v1/admins')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'مدير جديد',
        email: 'new.admin@test.com',
        permissions: 'rw',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('مدير جديد');
    expect(res.body.tempPassword).toBeDefined();
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/modules/users-search.test.js`
Expected: FAIL

- [x] **Step 3: Update `admins.validator.js`, `admins.service.js`, `users.service.js`, and seed scripts**

In `backend/src/modules/admins/admins.validator.js`:
Use `userNameSchema`:
```javascript
import { z } from "zod";
import { userNameSchema } from "../../core/validators/user.validator.js";

export const createAdminSchema = z.object({
  name: userNameSchema.optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  permissions: z.enum(["r", "rw", "rd", "rwd"]).default("rw"),
}).refine((data) => Boolean(data.name || (data.firstName && data.lastName)), {
  message: "الاسم مطلوب",
  path: ["name"],
});

export const updateAdminSchema = z.object({
  name: userNameSchema.optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  permissions: z.enum(["r", "rw", "rd", "rwd"]).optional(),
});
```

In `backend/src/modules/admins/admins.service.js`:
```javascript
export const createAdminService = async (data, universityId) => {
  const name = data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'مدير الجامعة';
  const rawPassword = data.password || generateSecurePassword(8);
  const hashedPassword = await hashPassword(rawPassword);

  const admin = await Admin.create({
    ...data,
    name,
    university: universityId,
    role: "admin",
    isAdmin: true,
    kind: "Admin",
    permissions: data.permissions || "rw",
    password: hashedPassword,
  });

  const savedAdmin = await Admin.findById(admin._id).select("-password");
  return {
    admin: savedAdmin,
    tempPassword: rawPassword,
  };
};
```

In `backend/src/modules/admins/admins.controller.js`:
```javascript
export const createAdmin = async (req, res) => {
  const { admin, tempPassword } = await adminsService.createAdminService(req.body, req.user.universityId);
  return res.status(StatusCodes.CREATED).json({
    success: true,
    data: admin,
    tempPassword,
  });
};
```

In `backend/src/modules/users/users.service.js`:
Update search query to search `name`, `email`, and `phone`:
```javascript
  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.$or = [
      { name: { $regex: escaped, $options: "i" } },
      { email: { $regex: escaped, $options: "i" } },
      { phone: { $regex: escaped, $options: "i" } },
    ];
  }
```

Update `backend/src/seeds/seedFullDemoData.js` and `backend/src/seeds/seedDemoUsers.js`:
Ensure all user seeds define `name: ...`.

- [x] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/modules/users-search.test.js`
Expected: PASS

- [x] **Step 5: Commit**

```bash
git add backend/src/modules/admins/ backend/src/modules/users/ backend/src/seeds/ backend/tests/modules/users-search.test.js
git commit -m "feat(users): add universal search on name/email/phone and update admin credentials"
```

---

### Task 5: Frontend Students Management Modal & Credentials Dialog

**Files:**
- Modify: `client/src/pages/admin/Students.jsx`
- Modify: `client/src/hooks/useStudents.js` (if needed to capture response data)

**Interfaces:**
- Consumes: `useMajors` hook, `POST /api/v1/students`
- Produces: Student creation modal with name strict validation, major selection, phone, password, and credential copy dialog.

- [x] **Step 1: Update `client/src/pages/admin/Students.jsx`**
  - Add `Select` for Major loaded via `useMajors()`.
  - Add `phone` and optional `password` input.
  - Implement client-side strict name validation:
    ```javascript
    name: (val) => {
      if (!val?.trim()) return 'اسم الطالب مطلوب';
      if (val.trim().length < 3) return 'يجب أن يتكون الاسم من 3 أحرف على الأقل';
      if (!/^[\u0600-\u06FFa-zA-Z\s\-]{3,70}$/.test(val.trim())) {
        return 'يجب أن يحتوي الاسم على أحرف عربية أو إنجليزية ومسافات فقط بدون أرقام أو رموز';
      }
      return null;
    }
    ```
  - Add a Mantine `Modal` for `createdCredentials` displaying `{ name, email, tempPassword }` with a "نسخ بيانات الدخول" button copying to clipboard using `navigator.clipboard.writeText(...)`.

- [x] **Step 2: Test frontend build**

Run: `npm run build` in `client`
Expected: PASS

- [x] **Step 3: Commit**

```bash
git add client/src/pages/admin/Students.jsx
git commit -m "feat(client): enhance Students modal with strict name validation, major select, and credential copy"
```

---

### Task 6: Frontend Teachers and Admins Management Modals

**Files:**
- Modify: `client/src/pages/admin/Teachers.jsx`
- Modify: `client/src/pages/admin/Admins.jsx`

**Interfaces:**
- Produces: Teachers and Admins management modals with strict name validation and credential copy dialog.

- [x] **Step 1: Update `client/src/pages/admin/Teachers.jsx`**
  - Add Title Select (`دكتور`, `أستاذ`, `أستاذ مشارك`, `أستاذ مساعد`, `محاضر`, `معيد`).
  - Add `phone` and optional `password` field.
  - Add strict name validation regex.
  - Add `createdCredentials` success popup dialog with 1-click copy.

- [x] **Step 2: Update `client/src/pages/admin/Admins.jsx`**
  - Add strict name validation regex.
  - Add `createdCredentials` success popup dialog with 1-click copy.

- [x] **Step 3: Test frontend build**

Run: `npm run build` in `client`
Expected: PASS

- [x] **Step 4: Commit**

```bash
git add client/src/pages/admin/Teachers.jsx client/src/pages/admin/Admins.jsx
git commit -m "feat(client): enhance Teachers and Admins modals with strict validation and credentials copy"
```

---

### Task 7: End-to-End Verification and DB Migration

**Files:**
- Create: `backend/src/scripts/migrate-user-names.js`

- [x] **Step 1: Write and run DB migration script**
  Migrate any existing database records where `name` is null/empty by combining `firstName` and `lastName`.
  Execute: `node backend/src/scripts/migrate-user-names.js`.

- [x] **Step 2: Run all backend tests**
  Execute: `pnpm test` in `backend`
  Expected: PASS (all tests pass, 0 failures).

- [x] **Step 3: Run client build**
  Execute: `npm run build` in `client`
  Expected: PASS.

- [x] **Step 4: Commit**
```bash
git add backend/src/scripts/migrate-user-names.js
git commit -m "chore: add user names DB migration script and verify full test suite"
```
