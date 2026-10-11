import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("End-to-End Application Pipeline", () => {
  it("GET /api/v1/test should return 200 OK", async () => {
    const res = await request(app).get("/api/v1/test");
    expect(res.status).toBe(200);
    expect(res.body.msg).toBe("test route");
  });

  it("GET /api/unknown should return 404 Not Found", async () => {
    const res = await request(app).get("/api/unknown");
    expect(res.status).toBe(404);
    expect(res.body.msg).toBe("not found");
  });

  it("POST /api/v1/auth/register with empty body should return 400 Bad Request with validation errors", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it("GET /api/v1/users/current-user without credentials should return 401 Unauthorized", async () => {
    const res = await request(app).get("/api/v1/users/current-user");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
