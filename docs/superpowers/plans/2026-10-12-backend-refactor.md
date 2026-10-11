# Backend Refactoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Gahbaz e-learning backend into a modular domain layered architecture with strict multi-tenancy, declarative RBAC, comprehensive Zod validation, fixed logic and security bugs, and automated Vitest test coverage while preserving 100% frontend API compatibility.

**Architecture:** The backend transitions from flat controllers and routes to domain modules (`auth`, `users`, `academics`, `chat`, `system`) under `src/modules/`. Each module is separated into routes, controllers, services, and validators. Foundational concerns (error handling, RBAC, authentication, response helpers) are centralized in `src/core/`.

**Tech Stack:** Node.js (ESM), Express.js 4, Mongoose 8, Socket.IO 4, Zod, Vitest, Supertest, Bcryptjs, JsonWebToken.

**Spec:** [docs/superpowers/specs/2026-10-12-backend-refactor-design.md](file:///c:/Users/msii/Documents/Gahbaz/docs/superpowers/specs/2026-10-12-backend-refactor-design.md)

## Global Constraints
- Node ES Modules (`"type": "module"`) across all files. No CommonJS `require()` or unhandled `__dirname`.
- Backward compatibility: All existing REST endpoints (`/api/v1/*`) and legacy chat aliases (`/api/v1/au/*`) must remain functional.
- Zero plaintext credentials: No secrets in source code.
- Strict multi-tenancy: All queries for academic and user resources must scope by `university: req.user.universityId`.
- No unhandled promises: Every asynchronous subdocument method must be explicitly awaited.
- No returning function references: Ensure responses return data entities (`res.json(updatedUser)`), never controller functions.

---

### Task 1: Package Dependencies, Environment Config & Vitest Harness

**Files:**
- Modify: `backend/package.json`
- Create: `backend/src/config/env.js`
- Create: `backend/vitest.config.js`
- Create: `backend/tests/setup.js`
- Test: `backend/tests/config/env.test.js`

**Interfaces:**
- Produces: `env` object validated via Zod (`PORT`, `MONGO_URL`, `JWT_SECRET`, `JWT_LIFETIME`, `EMAIL_USER`, `EMAIL_PASS`).
- Consumes: `process.env`.

- [ ] **Step 1: Write the failing test for environment configuration**

Create `backend/tests/config/env.test.js`:
```javascript
import { describe, it, expect } from "vitest";
import { validateEnv } from "../../src/config/env.js";

describe("Environment Config", () => {
  it("should validate and return environment variables when valid", () => {
    const mockEnv = {
      PORT: "5000",
      MONGO_URL: "mongodb://localhost:27017/test_gahbaz",
      JWT_SECRET: "test_secret_key_12345",
      JWT_LIFETIME: "1d",
      EMAIL_USER: "test@example.com",
      EMAIL_PASS: "secret_pass",
      NODE_ENV: "test",
    };

    const config = validateEnv(mockEnv);
    expect(config.PORT).toBe(5000);
    expect(config.MONGO_URL).toBe("mongodb://localhost:27017/test_gahbaz");
    expect(config.JWT_SECRET).toBe("test_secret_key_12345");
  });

  it("should throw an error when required variables are missing", () => {
    const mockEnv = {
      PORT: "5000",
    };

    expect(() => validateEnv(mockEnv)).toThrow();
  });
});
```

- [ ] **Step 2: Update package.json with dependencies and test script**

In `backend/package.json`:
- Remove `react-ga4`, `@tiptap/extension-placeholder`, `xss-clean`, `crypto`, `express-fileupload`.
- Add `"test": "vitest run"` and `"test:watch": "vitest"`.
- Ensure `zod`, `vitest`, `supertest` are included in dependencies/devDependencies.

- [ ] **Step 3: Create Vitest config and test setup**

Create `backend/vitest.config.js`:
```javascript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.js"],
    testTimeout: 20000,
  },
});
```

Create `backend/tests/setup.js`:
```javascript
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_key_min_32_chars";
process.env.JWT_LIFETIME = process.env.JWT_LIFETIME || "1d";
process.env.MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/gahbaz_test";
process.env.EMAIL_USER = process.env.EMAIL_USER || "test@gahbaz.com";
process.env.EMAIL_PASS = process.env.EMAIL_PASS || "dummy_pass";
```

- [ ] **Step 4: Implement minimal env validator**

Create `backend/src/config/env.js`:
```javascript
import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  MONGO_URL: z.string().min(1, "MONGO_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_LIFETIME: z.string().default("1d"),
  EMAIL_USER: z.string().default(""),
  EMAIL_PASS: z.string().default(""),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const validateEnv = (envObj = process.env) => {
  return envSchema.parse(envObj);
};

export const env = validateEnv();
export default env;
```

- [ ] **Step 5: Run tests and commit**

Run: `npx vitest run tests/config/env.test.js`
Expected: PASS

```bash
git add backend/package.json backend/vitest.config.js backend/tests/setup.js backend/src/config/env.js backend/tests/config/env.test.js
git commit -m "chore: setup vitest harness, package dependencies and env validation"
```

---

### Task 2: Core Error Handling & Standardized Response Utilities

**Files:**
- Create: `backend/src/core/errors/appError.js`
- Create: `backend/src/core/errors/customErrors.js`
- Create: `backend/src/core/utils/response.utils.js`
- Create: `backend/src/core/middleware/error.middleware.js`
- Test: `backend/tests/core/errors.test.js`

**Interfaces:**
- Produces: `AppError`, `BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ValidationError`, `sendSuccess`, `errorHandlerMiddleware`.

- [ ] **Step 1: Write failing test for error classes and error middleware**

Create `backend/tests/core/errors.test.js`:
```javascript
import { describe, it, expect, vi } from "vitest";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ValidationError,
} from "../../src/core/errors/customErrors.js";
import errorHandlerMiddleware from "../../src/core/middleware/error.middleware.js";

describe("Custom Errors & Middleware", () => {
  it("should create correct error hierarchy and status codes", () => {
    const err = new NotFoundError("User not found");
    expect(err.statusCode).toBe(404);
    expect(err.isOperational).toBe(true);
    expect(err.message).toBe("User not found");
  });

  it("should format operational errors correctly in middleware", () => {
    const err = new BadRequestError("Invalid parameter");
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    errorHandlerMiddleware(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        msg: "Invalid parameter",
      })
    );
  });
});
```

- [ ] **Step 2: Implement AppError and Custom Errors**

Create `backend/src/core/errors/appError.js`:
```javascript
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

Create `backend/src/core/errors/customErrors.js`:
```javascript
import { AppError } from "./appError.js";

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

export class ValidationError extends AppError {
  constructor(errors, message = "Validation failed") {
    super(message, 400);
    this.errors = errors;
  }
}

export class UnauthenticatedError extends AppError {
  constructor(message = "Authentication invalid") {
    super(message, 401);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, 403);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Access forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict") {
    super(message, 409);
  }
}
```

- [ ] **Step 3: Implement Response Utils & Error Middleware**

Create `backend/src/core/utils/response.utils.js`:
```javascript
export const sendSuccess = (res, statusCode = 200, data = {}) => {
  return res.status(statusCode).json(data);
};
```

Create `backend/src/core/middleware/error.middleware.js`:
```javascript
import { AppError } from "../errors/appError.js";

const errorHandlerMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong, please try again later";
  let errors = err.errors;

  // Handle Mongoose CastError (bad ObjectId)
  if (err.name === "CastError") {
    statusCode = 404;
    message = `No resource found with id: ${err.value}`;
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code && err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field} already exists`;
  }

  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  const responsePayload = {
    success: false,
    msg: message,
    message,
  };

  if (errors) {
    responsePayload.errors = errors;
  }

  if (process.env.NODE_ENV === "development" && statusCode === 500) {
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};

export default errorHandlerMiddleware;
```

- [ ] **Step 4: Run tests and commit**

Run: `npx vitest run tests/core/errors.test.js`
Expected: PASS

```bash
git add backend/src/core/errors/ backend/src/core/utils/response.utils.js backend/src/core/middleware/error.middleware.js backend/tests/core/errors.test.js
git commit -m "feat: implement centralized error handling and response utilities"
```

---

### Task 3: Security Utilities, Mailer & Token Management

**Files:**
- Create: `backend/src/core/utils/password.utils.js`
- Create: `backend/src/core/utils/token.utils.js`
- Create: `backend/src/config/mailer.js`
- Test: `backend/tests/core/security.test.js`

**Interfaces:**
- Produces: `hashPassword`, `comparePassword`, `generateSecurePassword`, `createJWT`, `verifyJWT`, `sendMail`.
- Consumes: `bcryptjs`, `jsonwebtoken`, `node:crypto`, `nodemailer`, `env`.

- [ ] **Step 1: Write failing test for security utilities**

Create `backend/tests/core/security.test.js`:
```javascript
import { describe, it, expect } from "vitest";
import {
  hashPassword,
  comparePassword,
  generateSecurePassword,
} from "../../src/core/utils/password.utils.js";
import { createJWT, verifyJWT } from "../../src/core/utils/token.utils.js";

describe("Security & Token Utilities", () => {
  it("should hash and verify passwords correctly", async () => {
    const raw = "MySecurePassword123!";
    const hashed = await hashPassword(raw);
    expect(hashed).not.toBe(raw);
    const valid = await comparePassword(raw, hashed);
    expect(valid).toBe(true);
    const invalid = await comparePassword("WrongPassword", hashed);
    expect(invalid).toBe(false);
  });

  it("should generate cryptographically secure random passwords", () => {
    const pass1 = generateSecurePassword();
    const pass2 = generateSecurePassword();
    expect(pass1.length).toBeGreaterThanOrEqual(12);
    expect(pass1).not.toBe(pass2);
  });

  it("should create and verify JWT payloads", () => {
    const payload = { userId: "user123", role: "admin" };
    const token = createJWT(payload);
    expect(typeof token).toBe("string");
    const decoded = verifyJWT(token);
    expect(decoded.userId).toBe("user123");
    expect(decoded.role).toBe("admin");
  });
});
```

- [ ] **Step 2: Implement password.utils.js**

Create `backend/src/core/utils/password.utils.js`:
```javascript
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) return false;
  return bcrypt.compare(password, hashedPassword);
};

export const generateSecurePassword = (bytes = 12) => {
  return crypto.randomBytes(bytes).toString("base64url");
};
```

- [ ] **Step 3: Implement token.utils.js**

Create `backend/src/core/utils/token.utils.js`:
```javascript
import jwt from "jsonwebtoken";
import env from "../../config/env.js";

export const createJWT = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_LIFETIME,
  });
};

export const verifyJWT = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};
```

- [ ] **Step 4: Implement mailer.js without hardcoded credentials**

Create `backend/src/config/mailer.js`:
```javascript
import nodemailer from "nodemailer";
import env from "./env.js";

let transporter = null;

if (env.EMAIL_USER && env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });
}

export const sendMail = async (to, subject, text) => {
  if (!transporter) {
    console.warn(`[Mailer] Mailer not configured. Skipping email to ${to}`);
    return;
  }

  const mailOptions = {
    from: env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`[Mailer Error] Failed sending email to ${to}:`, error.message);
  }
};

export default sendMail;
```

- [ ] **Step 5: Run tests and commit**

Run: `npx vitest run tests/core/security.test.js`
Expected: PASS

```bash
git add backend/src/core/utils/password.utils.js backend/src/core/utils/token.utils.js backend/src/config/mailer.js backend/tests/core/security.test.js
git commit -m "feat: implement security utils and credentials-safe mailer"
```

---

### Task 4: Authentication Middleware, Declarative RBAC & Request Validator

**Files:**
- Create: `backend/src/core/middleware/auth.middleware.js`
- Create: `backend/src/core/middleware/rbac.middleware.js`
- Create: `backend/src/core/middleware/validate.middleware.js`
- Test: `backend/tests/core/authMiddleware.test.js`

**Interfaces:**
- Produces: `authenticateUser`, `requireRoles`, `enforceDemoReadOnly`, `validateRequest`.
- Consumes: `verifyJWT`, `UnauthenticatedError`, `UnauthorizedError`, `BadRequestError`, `ValidationError`.

- [ ] **Step 1: Write failing test for auth, rbac, and validation middlewares**

Create `backend/tests/core/authMiddleware.test.js`:
```javascript
import { describe, it, expect, vi } from "vitest";
import { authenticateUser } from "../../src/core/middleware/auth.middleware.js";
import { requireRoles } from "../../src/core/middleware/rbac.middleware.js";
import { validateRequest } from "../../src/core/middleware/validate.middleware.js";
import { createJWT } from "../../src/core/utils/token.utils.js";
import { z } from "zod";

describe("Auth & RBAC Middleware", () => {
  it("should authenticate valid JWT cookie and inject user into req", async () => {
    const token = createJWT({ userId: "u123", role: "admin", universityId: "univ1" });
    const req = { cookies: { token } };
    const res = {};
    const next = vi.fn();

    await authenticateUser(req, res, next);
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe("u123");
    expect(req.user.role).toBe("admin");
    expect(next).toHaveBeenCalled();
  });

  it("should throw UnauthenticatedError if token is missing", async () => {
    const req = { cookies: {} };
    const res = {};
    const next = vi.fn();

    await expect(authenticateUser(req, res, next)).rejects.toThrow("Authentication invalid");
  });

  it("should allow matching role in requireRoles", () => {
    const req = { user: { role: "admin" } };
    const res = {};
    const next = vi.fn();

    const guard = requireRoles("admin", "super-admin");
    guard(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should throw UnauthorizedError in requireRoles for disallowed role", () => {
    const req = { user: { role: "student" } };
    const res = {};
    const next = vi.fn();

    const guard = requireRoles("admin");
    expect(() => guard(req, res, next)).toThrow("Unauthorized access");
  });

  it("should validate request body with Zod schema", async () => {
    const schema = z.object({ name: z.string().min(3) });
    const middleware = validateRequest({ body: schema });
    const req = { body: { name: "ab" }, query: {}, params: {} };
    const res = {};
    const next = vi.fn();

    await expect(middleware(req, res, next)).rejects.toThrow("Validation failed");
  });
});
```

- [ ] **Step 2: Implement auth.middleware.js with throttled activity tracking**

Create `backend/src/core/middleware/auth.middleware.js`:
```javascript
import { UnauthenticatedError } from "../errors/customErrors.js";
import { verifyJWT } from "../utils/token.utils.js";

// Memory cache to throttle lastActivity DB writes (max once per 10 minutes per user)
const activityThrottle = new Map();

export const authenticateUser = async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  try {
    const decoded = verifyJWT(token);
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      universityId: decoded.universityId,
      isDemoUser: decoded.isDemoUser || false,
    };

    // Asynchronously throttle activity logging without blocking the request
    const now = Date.now();
    const lastLogged = activityThrottle.get(decoded.userId) || 0;
    if (now - lastLogged > 10 * 60 * 1000) {
      activityThrottle.set(decoded.userId, now);
      // Clean up map size periodically
      if (activityThrottle.size > 10000) activityThrottle.clear();
    }

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};
```

- [ ] **Step 3: Implement rbac.middleware.js**

Create `backend/src/core/middleware/rbac.middleware.js`:
```javascript
import { UnauthorizedError, BadRequestError } from "../errors/customErrors.js";

export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized access to this route");
    }
    next();
  };
};

export const enforceDemoReadOnly = (req, res, next) => {
  if (req.user?.isDemoUser && ["POST", "PATCH", "PUT", "DELETE"].includes(req.method)) {
    throw new BadRequestError("Demo User. Read Only!");
  }
  next();
};
```

- [ ] **Step 4: Implement validate.middleware.js**

Create `backend/src/core/middleware/validate.middleware.js`:
```javascript
import { ValidationError } from "../errors/customErrors.js";

export const validateRequest = ({ body, query, params }) => {
  return async (req, res, next) => {
    try {
      if (body) {
        req.body = await body.parseAsync(req.body);
      }
      if (query) {
        req.query = await query.parseAsync(req.query);
      }
      if (params) {
        req.params = await params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      if (error.errors) {
        const errorDetails = error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        throw new ValidationError(errorDetails, errorDetails[0]?.message || "Validation failed");
      }
      throw error;
    }
  };
};
```

- [ ] **Step 5: Run tests and commit**

Run: `npx vitest run tests/core/authMiddleware.test.js`
Expected: PASS

```bash
git add backend/src/core/middleware/ backend/tests/core/authMiddleware.test.js
git commit -m "feat: implement auth middleware, declarative RBAC and Zod request validator"
```

---

### Task 5: Auth Module Refactoring & Privilege Escalation Fix

**Files:**
- Create: `backend/src/modules/auth/auth.validator.js`
- Create: `backend/src/modules/auth/auth.service.js`
- Create: `backend/src/modules/auth/auth.controller.js`
- Create: `backend/src/modules/auth/auth.routes.js`
- Test: `backend/tests/modules/auth.test.js`

**Interfaces:**
- Produces: `authRouter`, `registerService`, `loginService`.
- Prevents: Automatic `super-admin` promotion on registration; returns proper cookies with `sameSite` and security flags.

- [ ] **Step 1: Write failing test for auth endpoints**

Create `backend/tests/modules/auth.test.js`:
```javascript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import mongoose from "mongoose";
import { registerUser, loginUser } from "../../src/modules/auth/auth.service.js";
import User from "../../../models/User.js";
import Admin from "../../../models/Admin.js";
import University from "../../../models/University.js";

describe("Auth Module Service", () => {
  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);
    await User.deleteMany({});
    await University.deleteMany({});
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });

  it("should register a normal user and prevent super-admin escalation", async () => {
    const university = await University.create({ name: "Test Univ" });
    const res = await registerUser({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "Password123!",
      university: university._id.toString(),
      role: "super-admin", // Attempt privilege escalation
    });

    expect(res.user).toBeDefined();
    expect(res.user.role).not.toBe("super-admin"); // Should be sanitized
  });

  it("should login valid user and reject invalid credentials", async () => {
    const university = await University.create({ name: "Test Univ" });
    await registerUser({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "Password123!",
      university: university._id.toString(),
    });

    const loginRes = await loginUser("jane@example.com", "Password123!");
    expect(loginRes.token).toBeDefined();

    await expect(loginUser("jane@example.com", "WrongPassword")).rejects.toThrow(
      "Invalid credentials"
    );
  });
});
```

- [ ] **Step 2: Implement auth validator schemas**

Create `backend/src/modules/auth/auth.validator.js`:
```javascript
import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  university: z.string().optional(),
  phone: z.union([z.number(), z.string()]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
```

- [ ] **Step 3: Implement auth service**

Create `backend/src/modules/auth/auth.service.js`:
```javascript
import User from "../../models/User.js";
import Admin from "../../models/Admin.js";
import University from "../../models/University.js";
import { hashPassword, comparePassword } from "../../core/utils/password.utils.js";
import { createJWT } from "../../core/utils/token.utils.js";
import {
  BadRequestError,
  UnauthenticatedError,
} from "../../core/errors/customErrors.js";

export const registerUser = async (data) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new BadRequestError("Email already registered");
  }

  // Enforce secure default role: regular registration cannot create super-admin
  const hashedPassword = await hashPassword(data.password);
  let universityId = data.university;

  if (!universityId) {
    const defaultUniv = await University.findOne();
    if (defaultUniv) universityId = defaultUniv._id;
  }

  const user = await User.create({
    ...data,
    password: hashedPassword,
    university: universityId,
    role: "student", // default role
  });

  return { user };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const role = user.__t ? user.__t.toLowerCase() : user.role || "student";
  const token = createJWT({
    userId: user._id.toString(),
    email: user.email,
    role: user.role || role,
    universityId: user.university?.toString(),
    isDemoUser: ["student@test.com", "teacher@tech.com", "admin@test.com"].includes(user.email),
  });

  return { token, user, role: user.__t || user.role };
};
```

- [ ] **Step 4: Implement auth controller and routes**

Create `backend/src/modules/auth/auth.controller.js`:
```javascript
import { registerUser, loginUser } from "./auth.service.js";

export const register = async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json({ msg: "User registered successfully", user: result.user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const { token, user, role } = await loginUser(email, password);

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({ msg: "user logged in", role });
};

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ msg: "user logged out!" });
};
```

Create `backend/src/modules/auth/auth.routes.js`:
```javascript
import { Router } from "express";
import { register, login, logout } from "./auth.controller.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "./auth.validator.js";

const router = Router();

router.post("/register", validateRequest({ body: registerSchema }), register);
router.post("/login", validateRequest({ body: loginSchema }), login);
router.get("/logout", logout);

export default router;
```

- [ ] **Step 5: Run tests and commit**

Run: `npx vitest run tests/modules/auth.test.js`
Expected: PASS

```bash
git add backend/src/modules/auth/ backend/tests/modules/auth.test.js
git commit -m "feat: refactor auth module with validation, secure registration and token handling"
```

---

### Task 6: Unified Users Module, Profile Management & Legacy Chat Route Aliasing

**Files:**
- Create: `backend/src/modules/users/users.validator.js`
- Create: `backend/src/modules/users/users.service.js`
- Create: `backend/src/modules/users/users.controller.js`
- Create: `backend/src/modules/users/users.routes.js`
- Test: `backend/tests/modules/users.test.js`

**Interfaces:**
- Produces: `usersRouter`, aliases for legacy `/api/v1/au/*` routes.
- Fixes: IDOR vulnerabilities in profile/password updates; fixes controller functions returning function references.

- [ ] **Step 1: Write failing test for user profile and IDOR protections**

Create `backend/tests/modules/users.test.js`:
```javascript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import mongoose from "mongoose";
import { updateUserProfile, changeUserPassword } from "../../src/modules/users/users.service.js";
import User from "../../../models/User.js";
import { hashPassword } from "../../src/core/utils/password.utils.js";

describe("Users Module Service", () => {
  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);
    await User.deleteMany({});
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });

  it("should allow a user to update their own profile and prevent updating unauthorized fields", async () => {
    const user = await User.create({
      firstName: "Sam",
      lastName: "Altman",
      email: "sam@example.com",
      password: await hashPassword("Pass123!"),
    });

    const updated = await updateUserProfile(user._id.toString(), user._id.toString(), {
      firstName: "Samuel",
      role: "super-admin", // Malicious attempt to change role
    });

    expect(updated.firstName).toBe("Samuel");
    expect(updated.role).not.toBe("super-admin");
  });

  it("should prevent a user from modifying another user profile (IDOR prevention)", async () => {
    const user1 = await User.create({
      firstName: "User1",
      email: "u1@example.com",
      password: await hashPassword("Pass123!"),
    });
    const user2 = await User.create({
      firstName: "User2",
      email: "u2@example.com",
      password: await hashPassword("Pass123!"),
    });

    await expect(
      updateUserProfile(user2._id.toString(), user1._id.toString(), { firstName: "Hacked" })
    ).rejects.toThrow("Unauthorized");
  });
});
```

- [ ] **Step 2: Implement users validator schemas**

Create `backend/src/modules/users/users.validator.js`:
```javascript
import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.union([z.number(), z.string()]).optional(),
  avatar: z.string().optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  password: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
```

- [ ] **Step 3: Implement users service**

Create `backend/src/modules/users/users.service.js`:
```javascript
import User from "../../models/User.js";
import { comparePassword, hashPassword } from "../../core/utils/password.utils.js";
import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from "../../core/errors/customErrors.js";

export const getCurrentUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password").populate("university");
  if (!user) throw new NotFoundError("User not found");
  return user;
};

export const getUserById = async (targetId, requester) => {
  const user = await User.findById(targetId).select("-password");
  if (!user) throw new NotFoundError("User not found");
  if (user.__t === "Student") await user.populate("major");
  return user;
};

export const updateUserProfile = async (targetUserId, requesterId, updateData, isRequesterAdmin = false) => {
  if (targetUserId !== requesterId && !isRequesterAdmin) {
    throw new UnauthorizedError("Unauthorized to modify this profile");
  }

  // Whitelist safe fields
  const safeUpdates = {};
  if (updateData.firstName) safeUpdates.firstName = updateData.firstName;
  if (updateData.lastName) safeUpdates.lastName = updateData.lastName;
  if (updateData.phone) safeUpdates.phone = updateData.phone;
  if (updateData.avatar) safeUpdates.avatar = updateData.avatar;

  const updatedUser = await User.findByIdAndUpdate(targetUserId, safeUpdates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) throw new NotFoundError("User not found");
  return updatedUser;
};

export const changeUserPassword = async (userId, { oldPassword, password }) => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  const isMatch = await comparePassword(oldPassword, user.password);
  if (!isMatch) throw new BadRequestError("Invalid credentials");

  const hashedPassword = await hashPassword(password);
  await User.findByIdAndUpdate(userId, { password: hashedPassword });
  return { success: true };
};

export const getAllUsersForChat = async (requesterId, searchQuery) => {
  const filter = { _id: { $ne: requesterId } };
  if (searchQuery) {
    filter.$or = [
      { firstName: { $regex: searchQuery, $options: "i" } },
      { lastName: { $regex: searchQuery, $options: "i" } },
      { email: { $regex: searchQuery, $options: "i" } },
    ];
  }
  return User.find(filter).select("-password");
};
```

- [ ] **Step 4: Implement users controller and routes with legacy aliases**

Create `backend/src/modules/users/users.controller.js`:
```javascript
import {
  getCurrentUserProfile,
  getUserById,
  updateUserProfile,
  changeUserPassword,
  getAllUsersForChat,
} from "./users.service.js";

export const getCurrentUser = async (req, res) => {
  const user = await getCurrentUserProfile(req.user.id);
  res.status(200).json(user);
};

export const getUser = async (req, res) => {
  const user = await getUserById(req.params.id, req.user);
  res.status(200).json(user);
};

export const updateUser = async (req, res) => {
  const updatedUser = await updateUserProfile(
    req.params.id,
    req.user.id,
    req.body,
    req.user.role === "admin" || req.user.role === "super-admin"
  );
  res.status(200).json(updatedUser);
};

export const changePassword = async (req, res) => {
  await changeUserPassword(req.user.id, req.body);
  res.cookie("token", "logout", { httpOnly: true, expires: new Date(Date.now()) });
  res.status(200).json({ msg: "Password changed successfully" });
};

// Legacy Chat Endpoints compatibility (/api/v1/au/*)
export const legacyGetAllUsers = async (req, res) => {
  const users = await getAllUsersForChat(req.user.id, req.query.search);
  res.status(200).json(users);
};

export const legacyRenameUser = async (req, res) => {
  const targetId = req.body.userId || req.user.id;
  const updated = await updateUserProfile(targetId, req.user.id, { firstName: req.body.newUsername });
  res.status(200).json({ status: true, updatedUser: updated });
};
```

Create `backend/src/modules/users/users.routes.js`:
```javascript
import { Router } from "express";
import {
  getCurrentUser,
  getUser,
  updateUser,
  changePassword,
  legacyGetAllUsers,
  legacyRenameUser,
} from "./users.controller.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { updateUserSchema, changePasswordSchema } from "./users.validator.js";
import { enforceDemoReadOnly } from "../../core/middleware/rbac.middleware.js";

const router = Router();

router.get("/current-user", getCurrentUser);
router.route("/:id").get(getUser).patch(enforceDemoReadOnly, validateRequest({ body: updateUserSchema }), updateUser);
router.post("/:id/change-pass", enforceDemoReadOnly, validateRequest({ body: changePasswordSchema }), changePassword);

// Router for legacy /api/v1/au compatibility
export const legacyAuRouter = Router();
legacyAuRouter.get("/allUsers", legacyGetAllUsers);
legacyAuRouter.put("/renameUser", enforceDemoReadOnly, legacyRenameUser);

export default router;
```

- [ ] **Step 5: Run tests and commit**

Run: `npx vitest run tests/modules/users.test.js`
Expected: PASS

```bash
git add backend/src/modules/users/ backend/tests/modules/users.test.js
git commit -m "feat: implement unified users module with IDOR prevention and legacy route compatibility"
```

---

### Task 7: Academic Domain Models Cleanup & Mongoose 8 Compatibility

**Files:**
- Modify: `backend/models/Collage.js`
- Modify: `backend/models/Major.js`
- Modify: `backend/models/Subject.js`
- Modify: `backend/models/Course.js`
- Modify: `backend/models/Semester.js`
- Modify: `backend/models/Section.js`
- Modify: `backend/models/Grade.js`
- Modify: `backend/models/University.js`
- Test: `backend/tests/modules/models.test.js`

**Interfaces:**
- Produces: Clean, valid Mongoose 8 models without deprecated `pre('remove')` hooks, corrected Arabic validation messages, and structured grade schemas.

- [ ] **Step 1: Write tests verifying model validations and grade updates**

Create `backend/tests/modules/models.test.js`:
```javascript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import mongoose from "mongoose";
import Grade from "../../models/Grade.js";
import Section from "../../models/Section.js";
import Subject from "../../models/Subject.js";

describe("Mongoose Models Validation & Methods", () => {
  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });

  it("should create sections and properly await lesson operations", async () => {
    const courseId = new mongoose.Types.ObjectId();
    const section = new Section({ name: "Unit 1", course: courseId });
    await section.save();

    await section.addLesson({ name: "Intro to Algorithms" });
    expect(section.lessons.length).toBe(1);
    expect(section.lessons[0].name).toBe("Intro to Algorithms");
  });

  it("should calculate grade totals and percentages accurately", async () => {
    const courseId = new mongoose.Types.ObjectId();
    const studentId = new mongoose.Types.ObjectId();
    const gradeDoc = new Grade({
      course: courseId,
      student: studentId,
      grades: [
        { key: "midterm", name: "Midterm", maxValue: 30, value: 25 },
        { key: "final", name: "Final", maxValue: 50, value: 45 },
      ],
    });

    gradeDoc.recalculateTotal();
    expect(gradeDoc.total).toBe(70);
    expect(gradeDoc.percent).toBe((70 / 80) * 100);
  });
});
```

- [ ] **Step 2: Clean up models (Collage, Major, Subject, Course, Semester, Section, Grade)**

Update `backend/models/Collage.js`:
- Fix Arabic string `"لا بد من تحديد عدد الحصص اليومية"` on `university` to `"University is required"`.
- Ensure `majors` relationship is clear.

Update `backend/models/Major.js`:
- Remove deprecated `pre('remove')` hook.
- Ensure references to `collage`, `students`, `semesterTemplates`.

Update `backend/models/Subject.js`:
- Replace `throw new Error("Lesson not found")` with proper validation error.
- Remove invalid Arabic validation strings.

Update `backend/models/Section.js`:
- Ensure `addLesson`, `updateLesson`, `deleteLesson` return the saved document and are cleanly awaited.

Update `backend/models/Grade.js`:
- Refactor to structured `grades` subdocument array with `recalculateTotal()`.

Update `backend/models/University.js`:
- Correct name default and validation messages.

- [ ] **Step 3: Run tests and commit**

Run: `npx vitest run tests/modules/models.test.js`
Expected: PASS

```bash
git add backend/models/ backend/tests/modules/models.test.js
git commit -m "refactor: modernize mongoose models for Mongoose 8 and fix schema errors"
```

---

### Task 8: Academics Service - Colleges, Majors, Subjects, Admins, Teachers & Students

**Files:**
- Create: `backend/src/modules/academics/academics.validator.js`
- Create: `backend/src/modules/academics/academics.service.js`
- Create: `backend/src/modules/academics/academics.controller.js`
- Create: `backend/src/modules/academics/academics.routes.js`
- Test: `backend/tests/modules/academics-crud.test.js`

**Interfaces:**
- Produces: CRUD operations for colleges, majors, subjects, teachers, and students scoped to `req.user.universityId`.
- Fixes: `getSubject` calling `Subject.create`, functions returning controller function references, uppercase `_Id` crashes, and student creation using email as password.

- [ ] **Step 1: Write failing test for academic CRUD with university scoping**

Create `backend/tests/modules/academics-crud.test.js`:
```javascript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import mongoose from "mongoose";
import {
  createCollageService,
  getCollagesService,
  createSubjectService,
  getSubjectByIdService,
} from "../../src/modules/academics/academics.service.js";
import Collage from "../../../models/Collage.js";
import Subject from "../../../models/Subject.js";

describe("Academics Domain CRUD", () => {
  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);
    await Collage.deleteMany({});
    await Subject.deleteMany({});
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });

  it("should create collage scoped to university", async () => {
    const univId = new mongoose.Types.ObjectId().toString();
    const collage = await createCollageService(
      { name: "Computer Science", numberOfSemesters: 8 },
      univId
    );

    expect(collage.name).toBe("Computer Science");
    expect(collage.university.toString()).toBe(univId);

    const collages = await getCollagesService(univId);
    expect(collages.length).toBe(1);
  });

  it("should get subject by ID and NOT create a new subject (fixing getSubject bug)", async () => {
    const univId = new mongoose.Types.ObjectId().toString();
    const created = await createSubjectService({ name: "Algorithms 101" }, univId);

    const countBefore = await Subject.countDocuments();
    const fetched = await getSubjectByIdService(created._id.toString());
    const countAfter = await Subject.countDocuments();

    expect(fetched.name).toBe("Algorithms 101");
    expect(countAfter).toBe(countBefore); // Count must NOT increase
  });
});
```

- [ ] **Step 2: Implement academic validator schemas**

Create `backend/src/modules/academics/academics.validator.js`:
```javascript
import { z } from "zod";

export const createCollageSchema = z.object({
  name: z.string().min(2),
  numberOfSemesters: z.number().int().min(1).max(20),
});

export const createMajorSchema = z.object({
  name: z.string().min(2),
  collage: z.string().min(24),
});

export const createSubjectSchema = z.object({
  name: z.string().min(2),
  collage: z.string().min(24).optional(),
});
```

- [ ] **Step 3: Implement academics service (Colleges, Majors, Subjects, Students, Teachers)**

Create `backend/src/modules/academics/academics.service.js`:
```javascript
import Collage from "../../models/Collage.js";
import Major from "../../models/Major.js";
import Subject from "../../models/Subject.js";
import SemesterTemp from "../../models/SemesterTemp.js";
import Student from "../../models/Student.js";
import Teacher from "../../models/Teacher.js";
import { NotFoundError } from "../../core/errors/customErrors.js";
import { generateSecurePassword, hashPassword } from "../../core/utils/password.utils.js";
import sendMail from "../../config/mailer.js";

// Collages
export const createCollageService = async (data, universityId) => {
  return Collage.create({ ...data, university: universityId });
};

export const getCollagesService = async (universityId) => {
  return Collage.find({ university: universityId });
};

export const getCollageByIdService = async (id, universityId) => {
  const collage = await Collage.findOne({ _id: id, university: universityId });
  if (!collage) throw new NotFoundError("Collage not found");
  return collage;
};

export const updateCollageService = async (id, data, universityId) => {
  const collage = await Collage.findOneAndUpdate(
    { _id: id, university: universityId },
    data,
    { new: true, runValidators: true }
  );
  if (!collage) throw new NotFoundError("Collage not found");
  return collage;
};

export const deleteCollageService = async (id, universityId) => {
  const collage = await Collage.findOneAndDelete({ _id: id, university: universityId });
  if (!collage) throw new NotFoundError("Collage not found");
  const majors = await Major.find({ collage: collage._id });
  for (const m of majors) {
    await SemesterTemp.deleteMany({ major: m._id });
  }
  await Major.deleteMany({ collage: collage._id });
  await Subject.deleteMany({ collage: collage._id });
  return collage;
};

// Subjects
export const createSubjectService = async (data, universityId) => {
  return Subject.create({ ...data, university: universityId });
};

export const getSubjectByIdService = async (id) => {
  const subject = await Subject.findById(id);
  if (!subject) throw new NotFoundError("Subject not found");
  return subject;
};

export const updateSubjectService = async (id, data) => {
  const subject = await Subject.findByIdAndUpdate(id, data, { new: true });
  if (!subject) throw new NotFoundError("Subject not found");
  return subject;
};

export const deleteSubjectService = async (id) => {
  const subject = await Subject.findByIdAndDelete(id);
  if (!subject) throw new NotFoundError("Subject not found");
  return subject;
};

// Student Creation with Secure Passwords
export const createStudentService = async (data, universityId) => {
  const tempPassword = generateSecurePassword(8);
  const hashedPassword = await hashPassword(tempPassword);

  const student = new Student({
    ...data,
    university: universityId,
    password: hashedPassword,
  });
  await student.save();

  await sendMail(
    student.email,
    "Welcome to Gahbaz - Your Temporary Password",
    `Hello ${student.firstName},\n\nYour account has been created with temporary password: ${tempPassword}\nPlease change your password upon login.`
  );

  return student;
};
```

- [ ] **Step 4: Implement academics controller and routes**

Create `backend/src/modules/academics/academics.controller.js` and `backend/src/modules/academics/academics.routes.js` with proper routes for `/collages`, `/majors`, `/subjects`, `/students`, `/teachers`, `/admins`.

- [ ] **Step 5: Run tests and commit**

Run: `npx vitest run tests/modules/academics-crud.test.js`
Expected: PASS

```bash
git add backend/src/modules/academics/ backend/tests/modules/academics-crud.test.js
git commit -m "feat: implement academics CRUD services with strict university scoping"
```

---

### Task 9: Academics Service - Semesters, Sections, Lessons, Grades & Transactions

**Files:**
- Modify: `backend/src/modules/academics/academics.service.js`
- Modify: `backend/src/modules/academics/academics.controller.js`
- Modify: `backend/src/modules/academics/academics.routes.js`
- Test: `backend/tests/modules/academics-semesters.test.js`

**Interfaces:**
- Produces: `startSemesterService` wrapped in MongoDB session transaction, awaited lesson methods, accurate grade calculation.
- Fixes: Unawaited promises in sections, `throw new Error("Lesson not found")` during grade updates.

- [ ] **Step 1: Write failing test for startSemester transactional execution and section lessons**

Create `backend/tests/modules/academics-semesters.test.js`:
```javascript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import mongoose from "mongoose";
import Section from "../../models/Section.js";
import { addLessonService, updateLessonService } from "../../src/modules/academics/academics.service.js";

describe("Semesters & Sections Service", () => {
  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);
    await Section.deleteMany({});
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });

  it("should add and update lessons asynchronously without empty promises", async () => {
    const courseId = new mongoose.Types.ObjectId();
    const section = await Section.create({ name: "Chapter 1", course: courseId });

    const updatedSection = await addLessonService(section._id.toString(), {
      name: "Binary Search",
    });

    expect(updatedSection.lessons.length).toBe(1);
    expect(updatedSection.lessons[0].name).toBe("Binary Search");
  });
});
```

- [ ] **Step 2: Implement startSemester and Section/Lesson logic in academics.service.js**

Add methods to `backend/src/modules/academics/academics.service.js`:
- `startSemesterService` (using `mongoose.startSession()` and `session.withTransaction(...)` when replica set is active).
- `addLessonService`, `updateLessonService`, `deleteLessonService` (all properly awaited).
- `updateGradeService` (recalculating total and percentage cleanly).

- [ ] **Step 3: Update controllers and routes**

Expose `/sections/:sectionId/lessons` endpoints with properly returned JSON records.

- [ ] **Step 4: Run tests and commit**

Run: `npx vitest run tests/modules/academics-semesters.test.js`
Expected: PASS

```bash
git add backend/src/modules/academics/ backend/tests/modules/academics-semesters.test.js
git commit -m "feat: implement transactional semester initialization and awaited lesson operations"
```

---

### Task 10: Chat & Real-Time Messaging Module

**Files:**
- Create: `backend/src/modules/chat/chat.validator.js`
- Create: `backend/src/modules/chat/chat.service.js`
- Create: `backend/src/modules/chat/chat.controller.js`
- Create: `backend/src/modules/chat/chat.routes.js`
- Create: `backend/src/sockets/chatSocket.js`
- Test: `backend/tests/modules/chat.test.js`

**Interfaces:**
- Produces: `chatRouter`, `messagesRouter`, `setupChatSocket`.
- Fixes: Sender identity spoofing, ES module `__dirname` crashes, `socket.off('setup')` out-of-scope ReferenceError.

- [ ] **Step 1: Write failing test for chat messaging and sender verification**

Create `backend/tests/modules/chat.test.js`:
```javascript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import mongoose from "mongoose";
import { sendMessageService, createDirectChatService } from "../../src/modules/chat/chat.service.js";
import Chat from "../../models/chatModel.js";
import Messages from "../../models/messageModel.js";
import User from "../../models/User.js";

describe("Chat & Messaging Service", () => {
  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);
    await Chat.deleteMany({});
    await Messages.deleteMany({});
    await User.deleteMany({});
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });

  it("should create direct chat and send message binding sender to authenticated user", async () => {
    const user1 = await User.create({ firstName: "Alice", email: "a@test.com" });
    const user2 = await User.create({ firstName: "Bob", email: "b@test.com" });

    const chat = await createDirectChatService(user1._id.toString(), user2._id.toString());
    expect(chat.users.length).toBe(2);

    const message = await sendMessageService({
      senderId: user1._id.toString(),
      chatId: chat._id.toString(),
      content: "Hello Bob!",
    });

    expect(message.sender.toString()).toBe(user1._id.toString());
    expect(message.content).toBe("Hello Bob!");
  });
});
```

- [ ] **Step 2: Implement chat service, controller, and routes**

Create `backend/src/modules/chat/chat.service.js` binding sender strictly to `req.user.id` and enforcing chat membership.
Create `backend/src/modules/chat/chat.controller.js` and `backend/src/modules/chat/chat.routes.js`.

- [ ] **Step 3: Implement Socket.IO handler in sockets/chatSocket.js**

Create `backend/src/sockets/chatSocket.js`:
- Validate socket connection handshake.
- Join user to personal room `user:<id>`.
- Fix `userData._id` scoping bug in disconnect.

- [ ] **Step 4: Run tests and commit**

Run: `npx vitest run tests/modules/chat.test.js`
Expected: PASS

```bash
git add backend/src/modules/chat/ backend/src/sockets/ backend/tests/modules/chat.test.js
git commit -m "feat: implement secure chat and socket.io service with sender verification"
```

---

### Task 11: System & Analytics Module

**Files:**
- Create: `backend/src/modules/system/system.service.js`
- Create: `backend/src/modules/system/system.controller.js`
- Create: `backend/src/modules/system/system.routes.js`
- Test: `backend/tests/modules/system.test.js`

**Interfaces:**
- Produces: `systemRouter`.
- Fixes: Date calculation bug (`getDay() - 3`), in-memory `Logger.find()` dump, ReDoS regex injection.

- [ ] **Step 1: Write failing test for system health, date math and safe search**

Create `backend/tests/modules/system.test.js`:
```javascript
import { describe, it, expect } from "vitest";
import { calculateThreeMonthsAgo, sanitizeSearchQuery } from "../../src/modules/system/system.service.js";

describe("System & Analytics Logic", () => {
  it("should calculate correct 3-month date delta", () => {
    const now = new Date("2026-10-15T00:00:00Z");
    const past = calculateThreeMonthsAgo(now);
    expect(past.getUTCMonth()).toBe(6); // October (9) - 3 = July (6)
  });

  it("should escape special regex characters to prevent ReDoS", () => {
    const raw = ".*+?^${}()|[]\\";
    const escaped = sanitizeSearchQuery(raw);
    expect(escaped).not.toContain(".*");
  });
});
```

- [ ] **Step 2: Implement system service, controller and routes**

Create `backend/src/modules/system/system.service.js`, `backend/src/modules/system/system.controller.js`, `backend/src/modules/system/system.routes.js`.

- [ ] **Step 3: Run tests and commit**

Run: `npx vitest run tests/modules/system.test.js`
Expected: PASS

```bash
git add backend/src/modules/system/ backend/tests/modules/system.test.js
git commit -m "feat: implement system module fixing date math bug and ReDoS vulnerability"
```

---

### Task 12: Application Pipeline Assembly, Server Lifecycle & Full Verification

**Files:**
- Create: `backend/src/app.js`
- Modify: `backend/server.js`
- Test: `backend/tests/app.e2e.test.js`

**Interfaces:**
- Produces: Assembled Express application, HTTP server with Socket.IO, graceful shutdown.

- [ ] **Step 1: Write comprehensive end-to-end API test**

Create `backend/tests/app.e2e.test.js`:
```javascript
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";

describe("End-to-End API Routes", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("GET /api/v1/test should return 200 OK", async () => {
    const res = await request(app).get("/api/v1/test");
    expect(res.status).toBe(200);
    expect(res.body.msg).toBe("test route");
  });

  it("GET /api/v1/unknown should return 404 Not Found", async () => {
    const res = await request(app).get("/api/v1/unknown");
    expect(res.status).toBe(404);
  });
});
```

- [ ] **Step 2: Create src/app.js assembling all routes and middlewares**

Create `backend/src/app.js`:
```javascript
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import authRouter from "./modules/auth/auth.routes.js";
import usersRouter, { legacyAuRouter } from "./modules/users/users.routes.js";
import academicsRouter from "./modules/academics/academics.routes.js";
import chatRouter from "./modules/chat/chat.routes.js";
import systemRouter from "./modules/system/system.routes.js";

import { authenticateUser } from "./core/middleware/auth.middleware.js";
import errorHandlerMiddleware from "./core/middleware/error.middleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Public static assets
app.use("/images", express.static(path.resolve(__dirname, "../images")));

// Health test route
app.get("/api/v1/test", (req, res) => res.json({ msg: "test route" }));

// Auth routes (unauthenticated)
app.use("/api/v1/auth", authRouter);

// Authenticated API routes
app.use("/api/v1", authenticateUser);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/au", legacyAuRouter);
app.use("/api/v1", academicsRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/system", systemRouter);

// Global Error Handler
app.use(errorHandlerMiddleware);

export default app;
```

- [ ] **Step 3: Update server.js to connect DB before listening**

Update `backend/server.js` ensuring Mongoose connects successfully *before* `app.listen()`, and attaching Socket.IO cleanly.

- [ ] **Step 4: Run full test suite and verify all tests pass**

Run: `npx vitest run`
Expected: ALL PASS

- [ ] **Step 5: Final commit**

```bash
git add backend/src/app.js backend/server.js backend/tests/app.e2e.test.js
git commit -m "feat: complete backend refactor pipeline assembly and server lifecycle"
```
