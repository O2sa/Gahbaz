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

  it("should throw an error when environment variables have invalid types", () => {
    const mockEnv = {
      NODE_ENV: "invalid_env_mode",
    };

    expect(() => validateEnv(mockEnv)).toThrow();
  });

  it("should default STORAGE_PROVIDER to local when not provided", () => {
    const mockEnv = {};
    const config = validateEnv(mockEnv);
    expect(config.STORAGE_PROVIDER).toBe("local");
    expect(config.UPLOAD_DIR).toBe("uploads");
    expect(config.PUBLIC_URL).toBe("http://localhost:5000");
  });

  it("should accept valid cloud STORAGE_PROVIDER like wasabi, s3, cloudinary", () => {
    const mockEnv = {
      STORAGE_PROVIDER: "wasabi",
      WASABI_BUCKET_NAME: "my-bucket",
    };
    const config = validateEnv(mockEnv);
    expect(config.STORAGE_PROVIDER).toBe("wasabi");
    expect(config.WASABI_BUCKET_NAME).toBe("my-bucket");
  });
});
