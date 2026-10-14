import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("Rate Limiting on Authentication (Task 2.2)", () => {
  it("should block requests with 429 Too Many Requests after exceeding threshold", async () => {
    // Send 5 requests (which will fail validation 422, but count toward rate limit)
    for (let i = 0; i < 5; i++) {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: `test${i}@example.com` });
      expect(res.status).not.toBe(429);
    }

    // 6th request must be blocked by rate limiter
    const blockedRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test6@example.com" });

    expect(blockedRes.status).toBe(429);
    expect(blockedRes.body.success).toBe(false);
    expect(blockedRes.body.error.code).toBe("TOO_MANY_REQUESTS");
  });
});
