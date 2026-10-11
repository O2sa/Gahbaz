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
      // missing MONGO_URL, JWT_SECRET
    };

    expect(() => validateEnv(mockEnv)).toThrow();
  });
});
