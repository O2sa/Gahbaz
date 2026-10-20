# Unified User Name & Enhanced Role Management Specification

## 1. Overview & Business Goals
The Gahbaz learning platform currently manages user entities across multiple subclasses: `Student`, `Teacher`, and `Admin`, inherited from the base `User` model. Previously, user names were split into `firstName` and `lastName`, while frontend forms and external integrations treated `name` as a single input. This caused 400 Bad Request errors during creation/updating, missing field mismatches, and fragmented searching.

This subsystem redesign achieves:
1. **Unified `name` Field:** Making `name` the single primary stored field on `User`, with backwards-compatible virtual getters/setters for `firstName` and `lastName`.
2. **Strict Name Validation:** Enforcing strict validation rules (Arabic/Latin letters, spaces, hyphens only, 3 to 70 characters, rejecting digits and special characters).
3. **Enhanced Role Modals:**
   - **Students:** Add optional `major` selector, `phone`, optional `password`, and temporary credentials display.
   - **Teachers:** Add `title` selection (دكتور / أستاذ), `phone`, optional `password`, and temporary credentials display.
   - **Admins:** Standardize `name` validation and credential generation.
4. **Credential Visibility:** When an admin creates a user without providing an explicit password, the backend generates an 8-character secure password and returns it in the response so the admin UI can present a 1-click "Copy Credentials" dialog.
5. **Universal Search:** Search on `/api/v1/users`, `/students`, `/teachers`, and `/admins` queries `name`, `email`, and `phone` seamlessly.

---

## 2. Data Model Design

### 2.1 Base `User` Model (`backend/src/models/User.js`)
```javascript
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

// Pre-validate hook for documents that might pass firstName/lastName without name
UserSchema.pre("validate", function (next) {
  if (!this.name && (this.get("firstName") || this.get("lastName"))) {
    this.name = `${this.get("firstName") || ""} ${this.get("lastName") || ""}`.trim();
  }
  next();
});
```

### 2.2 Discriminators
* **`Student` (`backend/src/models/Student.js`):**
  - `major`: `ObjectId` referencing `Major`, optional.
  - `studentId`: String, optional.
  - `comingSemester`: Number, default 0.
  - `semesters`: Array of `ObjectId` referencing `Semester`.
  - `grades`: Array of `ObjectId` referencing `Grade`.
* **`Teacher` (`backend/src/models/Teacher.js`):**
  - `title`: String, default `""` (e.g., `دكتور`, `أستاذ`, `أستاذ مشارك`, `محاضر`).
  - `courses`: Array of `ObjectId` referencing `Course`.
  - `subjects`: Array of `ObjectId` referencing `Subject`.
* **`Admin` (`backend/src/models/Admin.js`):**
  - `permissions`: Enum `["r", "rw", "rd", "rwd"]`, default `"rw"`.
  - `role`: Enum `["admin", "super-admin", "user"]`, default `"admin"`.

---

## 3. Strict Validation Specification (Zod)

### 3.1 Reusable Name Validator
```javascript
const NAME_REGEX = /^[\u0600-\u06FFa-zA-Z\s\-]{3,70}$/;

export const userNameSchema = z
  .string({ required_error: "الاسم مطلوب" })
  .trim()
  .min(3, "يجب أن يتكون الاسم من 3 أحرف على الأقل")
  .max(70, "يجب ألا يتجاوز الاسم 70 حرفاً")
  .regex(NAME_REGEX, "يجب أن يحتوي الاسم على أحرف عربية أو إنجليزية ومسافات فقط بدون أرقام أو رموز");
```

### 3.2 Student Validators (`backend/src/modules/students/students.validator.js`)
* **`createStudentSchema`:**
  - `name`: `userNameSchema` (also accepts `{ firstName, lastName }` via pre-processing / refine for legacy compatibility).
  - `email`: `z.string().email("Invalid email format")`.
  - `major`: `z.string().optional()`.
  - `phone`: `z.string().optional()`.
  - `password`: `z.string().min(6).optional()`.
  - `studentId`: `z.string().optional()`.
* **`updateStudentSchema`:**
  - `name`: `userNameSchema.optional()`.
  - `major`: `z.string().optional()`.
  - `phone`: `z.string().optional()`.
  - `comingSemester`: `z.number().optional()`.

### 3.3 Teacher Validators (`backend/src/modules/teachers/teachers.validator.js`)
* **`createTeacherSchema`:**
  - `name`: `userNameSchema`.
  - `email`: `z.string().email("Invalid email format")`.
  - `title`: `z.string().optional()`.
  - `phone`: `z.string().optional()`.
  - `password`: `z.string().min(6).optional()`.
* **`updateTeacherSchema`:**
  - `name`: `userNameSchema.optional()`.
  - `title`: `z.string().optional()`.
  - `phone`: `z.string().optional()`.

### 3.4 Admin Validators (`backend/src/modules/admins/admins.validator.js`)
* **`createAdminSchema`:**
  - `name`: `userNameSchema`.
  - `email`: `z.string().email("Invalid email format")`.
  - `password`: `z.string().min(6).optional()`.
  - `permissions`: `z.enum(["r", "rw", "rd", "rwd"]).default("rw")`.
* **`updateAdminSchema`:**
  - `name`: `userNameSchema.optional()`.
  - `permissions`: `z.enum(["r", "rw", "rd", "rwd"]).optional()`.

---

## 4. API Endpoints & Response Contracts

### 4.1 Student Endpoints
* `POST /api/v1/students`
  - Body: `{ name, email, major?, phone?, password?, studentId? }`
  - Response (201):
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d0fe4f5311236168a109ca",
        "name": "أحمد محمود الغامدي",
        "email": "ahmed.ghamdi@student.gahbaz.edu",
        "role": "student",
        "major": { "_id": "...", "name": "Software Engineering" },
        "phone": "0551234567"
      },
      "tempPassword": "generatedPass123" // returned if password was generated
    }
    ```
* `PATCH /api/v1/students/:id`
  - Body: `{ name?, major?, phone?, comingSemester? }`

### 4.2 Teacher Endpoints
* `POST /api/v1/teachers`
  - Body: `{ name, email, title?, phone?, password? }`
  - Response (201):
    ```json
    {
      "success": true,
      "data": {
        "_id": "...",
        "name": "د. فيصل الشمري",
        "title": "دكتور",
        "email": "faisal.shammari@gahbaz.edu",
        "role": "teacher"
      },
      "tempPassword": "generatedPass123"
    }
    ```

### 4.3 Admin Endpoints
* `POST /api/v1/admins`
  - Body: `{ name, email, permissions?, password? }`
  - Response (201):
    ```json
    {
      "success": true,
      "data": { ... },
      "tempPassword": "generatedPass123"
    }
    ```

---

## 5. Frontend UI/UX Enhancements

### 5.1 Students Page (`client/src/pages/admin/Students.jsx`)
- **Add Modal:**
  - Name input with real-time feedback against Arabic/Latin characters.
  - Email input.
  - Major select (fetching list from `useMajors()`, optional with "اختر التخصص...").
  - Phone input.
  - Password input (optional, labeled "كلمة المرور (اتركه فارغاً للتوليد التلقائي)").
- **Credentials Success Dialog:**
  - Shown after creation with fields: Name, Email, and Temporary Password.
  - "نسخ بيانات الدخول" (Copy to Clipboard) button with tooltip.
- **Table:**
  - Displays avatar, full `name`, email, major name badge, phone, and actions.

### 5.2 Teachers Page (`client/src/pages/admin/Teachers.jsx`)
- **Add Modal:**
  - Title selector: `['دكتور', 'أستاذ', 'أستاذ مشارك', 'أستاذ مساعد', 'محاضر', 'معيد']`.
  - Name input with strict validation.
  - Email input.
  - Phone input.
  - Optional password input.
- **Credentials Success Dialog:**
  - Displays generated credentials with copy button.

### 5.3 Admins Page (`client/src/pages/admin/Admins.jsx`)
- Single `name` input with strict validation.
- Email, permissions, and credential copy dialog.

---

## 6. Migration & Verification Plan
1. **Database Migration Script:** Run an in-line migration to populate `name` from `firstName` and `lastName` for any pre-existing users.
2. **Seed Scripts:** Update `seedFullDemoData.js` and `seedDemoUsers.js` to define `name`.
3. **Automated Testing:**
   - Unit tests for `userNameSchema`:
     - Reject names < 3 characters.
     - Reject names > 70 characters.
     - Reject numbers (`"Ahmed123"`).
     - Reject special characters (`"Sara@Admin!"`).
     - Accept Arabic names (`"عبدالرحمن المطيري"`).
     - Accept Latin names with hyphens/spaces (`"Jean-Luc Picard"`).
   - Integration tests for `POST /api/v1/students`, `POST /api/v1/teachers`, `POST /api/v1/admins`.
   - Verify all 125 backend tests remain green.
