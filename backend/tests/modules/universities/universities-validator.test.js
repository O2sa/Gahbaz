import { describe, it, expect } from "vitest";
import {
  createUniversitySchema,
  updateUniversitySchema,
  universityQuerySchema,
} from "../../../src/modules/universities/universities.validator.js";

describe("University Validator Schemas", () => {
  it("should validate valid university provisioning payload", () => {
    const payload = {
      name: "King Saud University",
      code: "KSU",
      adminName: "Dr. Fahad Al-Otaibi",
      adminEmail: "fahad@ksu.edu.sa",
    };
    const result = createUniversitySchema.safeParse(payload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.code).toBe("KSU");
    }
  });

  it("should reject payload with missing fields or invalid email", () => {
    const invalidPayload = {
      name: "AB",
      code: "",
      adminName: "",
      adminEmail: "not-an-email",
    };
    const result = createUniversitySchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });

  it("should validate university update payload", () => {
    const payload = {
      name: "Updated University Name",
      active: false,
    };
    const result = updateUniversitySchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("should validate and parse university query parameters with defaults", () => {
    const query = {};
    const result = universityQuerySchema.safeParse(query);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
    }
  });
});
