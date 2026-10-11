import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  updateUserProfile,
  changeUserPassword,
  getCurrentUserProfile,
} from "../../src/modules/users/users.service.js";
import User from "../../models/User.js";
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

    vi.spyOn(User, "findById").mockResolvedValue(mockUser);
    vi.spyOn(passwordUtils, "comparePassword").mockResolvedValue(false);

    await expect(
      changeUserPassword("user123", {
        oldPassword: "WrongOldPassword",
        password: "NewPassword123!",
      })
    ).rejects.toThrow("Invalid credentials");
  });
});
