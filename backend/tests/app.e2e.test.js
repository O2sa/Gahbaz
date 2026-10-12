import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("End-to-End Application Pipeline", () => {
  it("GET /api/v1/test should return 200 OK with standard success envelope", async () => {
    const res = await request(app).get("/api/v1/test");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("healthy");
  });

  it("GET /api/unknown should return 404 Not Found with standard error envelope", async () => {
    const res = await request(app).get("/api/unknown");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });

  it("POST /api/v1/auth/register with empty body should return 422 Unprocessable Entity with validation details", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({});
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.details).toBeDefined();
    expect(Array.isArray(res.body.error.details)).toBe(true);
  });

  it("GET /api/v1/users/current-user without credentials should return 401 Unauthorized with standard envelope", async () => {
    const res = await request(app).get("/api/v1/users/current-user");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("UNAUTHENTICATED");
  });
});
