import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerUser, loginUser } from "../../../src/modules/auth/auth.service.js";
import User from "../../../src/models/User.js";
import University from "../../../src/models/University.js";
import * as passwordUtils from "../../../src/core/utils/password.utils.js";
import env from "../../../src/config/env.js";

describe("Auth Module Service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should register a new user as an admin with a placeholder university needing setup", async () => {
    vi.spyOn(User, "findOne").mockResolvedValue(null);
    const mockUniv = {
      _id: "univ123",
      name: "University of John Doe",
      code: "U12345",
      needsSetup: true,
      active: true,
      admin: null,
      save: vi.fn().mockResolvedValue(true),
    };
    vi.spyOn(University, "create").mockResolvedValue(mockUniv);
    const createSpy = vi.spyOn(User, "create").mockImplementation(async (data) => ({
      _id: "user123",
      ...data,
    }));

    const res = await registerUser({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "Password123!",
    });

    expect(createSpy).toHaveBeenCalled();
    const passedData = createSpy.mock.calls[0][0];
    expect(passedData.role).toBe("admin");
    expect(passedData.kind).toBe("Admin");
    expect(passedData.university).toBe("univ123");
    expect(mockUniv.save).toHaveBeenCalled();
    expect(res.user._id).toBe("user123");
    expect(res.token).toBeDefined();
    expect(res.needsOnboarding).toBe(true);
    expect(res.university).toBeDefined();
  });

  it("should reject registration when ENABLE_REGISTRATION is disabled", async () => {
    const originalEnable = env.ENABLE_REGISTRATION;
    env.ENABLE_REGISTRATION = false;
    try {
      await expect(
        registerUser({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          password: "Password123!",
        })
      ).rejects.toThrow("Registration is currently disabled");
    } finally {
      env.ENABLE_REGISTRATION = originalEnable;
    }
  });

  it("should reject registration if email is already registered", async () => {
    vi.spyOn(User, "findOne").mockResolvedValue({ _id: "existing_user", email: "john@example.com" });

    await expect(
      registerUser({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "Password123!",
      })
    ).rejects.toThrow("Email already registered");
  });

  it("should login valid user and return JWT token", async () => {
    const mockUser = {
      _id: "user123",
      email: "jane@example.com",
      password: "hashedPassword123",
      role: "admin",
      university: "univ123",
    };

    vi.spyOn(User, "findOne").mockReturnValue({
      select: vi.fn().mockResolvedValue(mockUser),
    });
    vi.spyOn(passwordUtils, "comparePassword").mockResolvedValue(true);

    const loginRes = await loginUser("jane@example.com", "Password123!");
    expect(loginRes.token).toBeDefined();
    expect(loginRes.user.email).toBe("jane@example.com");
    expect(loginRes.role).toBe("admin");
  });

  it("should reject login if password does not match", async () => {
    const mockUser = {
      _id: "user123",
      email: "jane@example.com",
      password: "hashedPassword123",
    };

    vi.spyOn(User, "findOne").mockReturnValue({
      select: vi.fn().mockResolvedValue(mockUser),
    });
    vi.spyOn(passwordUtils, "comparePassword").mockResolvedValue(false);

    await expect(loginUser("jane@example.com", "WrongPassword")).rejects.toThrow(
      "Invalid credentials"
    );
  });
});
