import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  updateUserProfile,
  changeUserPassword,
  getCurrentUserProfile,
  deleteUserService,
  listUsersService,
} from "../../src/modules/users/users.service.js";
import User from "../../src/models/User.js";
import * as passwordUtils from "../../src/core/utils/password.utils.js";

describe("Users Module Service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should allow a user to update their own profile and sanitize unauthorized fields", async () => {
    const mockUser = {
      _id: "user123",
      firstName: "Samuel",
      email: "sam@example.com",
      role: "student",
    };

    const findByIdAndUpdateSpy = vi
      .spyOn(User, "findByIdAndUpdate")
      .mockReturnValue({
        select: vi.fn().mockResolvedValue(mockUser),
      });

    const updated = await updateUserProfile("user123", "user123", {
      firstName: "Samuel",
      role: "super-admin", // Malicious attempt to change role
    });

    expect(findByIdAndUpdateSpy).toHaveBeenCalled();
    const passedUpdates = findByIdAndUpdateSpy.mock.calls[0][1];
    expect(passedUpdates.firstName).toBe("Samuel");
    expect(passedUpdates.role).toBeUndefined(); // Role modification was stripped!
    expect(updated.firstName).toBe("Samuel");
  });

  it("should prevent a user from modifying another user profile (IDOR prevention)", async () => {
    await expect(
      updateUserProfile("targetUser456", "requesterUser123", { firstName: "Hacked" })
    ).rejects.toThrow("Unauthorized to modify this profile");
  });

  it("should verify old password when changing user password", async () => {
    const mockUser = {
      _id: "user123",
      password: "hashedOldPassword",
    };

    vi.spyOn(User, "findById").mockReturnValue({
      select: vi.fn().mockResolvedValue(mockUser),
    });
    vi.spyOn(passwordUtils, "comparePassword").mockResolvedValue(false);

    await expect(
      changeUserPassword("user123", {
        oldPassword: "WrongOldPassword",
        password: "NewPassword123!",
      })
    ).rejects.toThrow("Invalid credentials");
  });

  it("should support user deletion for owner or admin", async () => {
    vi.spyOn(User, "findByIdAndDelete").mockResolvedValue({ _id: "user123" });

    const deleted = await deleteUserService("user123", "user123", false);
    expect(deleted).toBe(true);
  });

  it("should reject user deletion by non-owner non-admin", async () => {
    await expect(
      deleteUserService("user123", "differentUser", false)
    ).rejects.toThrow("Unauthorized to delete this user");
  });

  it("should list users with pagination metadata", async () => {
    const mockUsers = [{ _id: "1", firstName: "Alice" }, { _id: "2", firstName: "Bob" }];
    vi.spyOn(User, "find").mockReturnValue({
      select: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            sort: vi.fn().mockResolvedValue(mockUsers),
          }),
        }),
      }),
    });
    vi.spyOn(User, "countDocuments").mockResolvedValue(2);

    const result = await listUsersService({ page: 1, limit: 10 });
    expect(result.users).toHaveLength(2);
    expect(result.meta.total).toBe(2);
    expect(result.meta.totalPages).toBe(1);
  });
});
