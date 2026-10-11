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
