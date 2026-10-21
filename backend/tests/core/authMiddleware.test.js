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
    expect(() => guard(req, res, next)).toThrow("Unauthorized access to this route");
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
