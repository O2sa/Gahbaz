import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("OpenAPI / Swagger Documentation API", () => {
  it("GET /api/docs.json should serve OpenAPI 3.0.3 specification", async () => {
    const res = await request(app).get("/api/docs.json");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body.openapi).toBe("3.0.3");
    expect(res.body.info).toBeDefined();
    expect(res.body.info.title).toContain("Gahbaz");
    expect(res.body.paths).toBeDefined();
    expect(Object.keys(res.body.paths).length).toBeGreaterThan(20);
    expect(res.body.components.securitySchemes.bearerAuth).toBeDefined();
    expect(res.body.components.securitySchemes.cookieAuth).toBeDefined();
  });

  it("GET /api/docs/json should serve the specification through the docs router", async () => {
    const res = await request(app).get("/api/docs/json");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body.openapi).toBe("3.0.3");
  });

  it("GET /api/docs/ should serve interactive Swagger UI HTML", async () => {
    const res = await request(app).get("/api/docs/");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/text\/html/);
    expect(res.text).toContain("swagger-ui");
  });

  it("GET /api/docs should redirect or serve Swagger UI", async () => {
    const res = await request(app).get("/api/docs");
    expect([200, 301, 302]).toContain(res.status);
  });
});
