import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerUser, loginUser } from "../../src/modules/auth/auth.service.js";
import User from "../../models/User.js";
import University from "../../models/University.js";
import * as passwordUtils from "../../src/core/utils/password.utils.js";

describe("Auth Module Service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should register a normal user and prevent super-admin escalation", async () => {
    vi.spyOn(User, "findOne").mockResolvedValue(null);
    vi.spyOn(University, "findOne").mockResolvedValue({ _id: "univ123" });
    const createSpy = vi.spyOn(User, "create").mockImplementation(async (data) => ({
      _id: "user123",
      ...data,
    }));

    const res = await registerUser({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "Password123!",
      role: "super-admin", // Attempt privilege escalation
    });

    expect(createSpy).toHaveBeenCalled();
    const passedData = createSpy.mock.calls[0][0];
    expect(passedData.role).toBe("student"); // Privilege escalation prevented
    expect(passedData.email).toBe("john@example.com");
    expect(res.user._id).toBe("user123");
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
      role: "student",
      university: "univ123",
    };

    vi.spyOn(User, "findOne").mockResolvedValue(mockUser);
    vi.spyOn(passwordUtils, "comparePassword").mockResolvedValue(true);

    const loginRes = await loginUser("jane@example.com", "Password123!");
    expect(loginRes.token).toBeDefined();
    expect(loginRes.user.email).toBe("jane@example.com");
    expect(loginRes.role).toBe("student");
  });

  it("should reject login if password does not match", async () => {
    const mockUser = {
      _id: "user123",
      email: "jane@example.com",
      password: "hashedPassword123",
    };

    vi.spyOn(User, "findOne").mockResolvedValue(mockUser);
    vi.spyOn(passwordUtils, "comparePassword").mockResolvedValue(false);

    await expect(loginUser("jane@example.com", "WrongPassword")).rejects.toThrow(
      "Invalid credentials"
    );
  });
});
