import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { createJWT } from "../../src/core/utils/token.utils.js";
import SemesterTemplate from "../../src/models/SemesterTemplate.js";
import Major from "../../src/models/Major.js";

describe("Semester Templates & Route Aliases (Task 1.2)", () => {
  const adminToken = createJWT({
    userId: "admin123",
    role: "admin",
    universityId: "univ123",
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("GET /api/v1/semester-templates/:majorId should return templates for that major", async () => {
    const majorId = "64f1a2b3c4d5e6f7a8b9c0d1";
    vi.spyOn(Major, "exists").mockResolvedValue({ _id: majorId });
    vi.spyOn(SemesterTemplate, "countDocuments").mockResolvedValue(1);
    vi.spyOn(SemesterTemplate, "find").mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            populate: vi.fn().mockResolvedValue([
              { _id: "tmpl1", name: "Semester 1", major: majorId, subjects: [] },
            ]),
          }),
        }),
      }),
    });

    const res = await request(app)
      .get(`/api/v1/semester-templates/${majorId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].name).toBe("Semester 1");
  });

  it("GET /api/v1/semesters/semester-template/:id should return single semester template", async () => {
    const templateId = "64f1a2b3c4d5e6f7a8b9c0d2";
    vi.spyOn(SemesterTemplate, "findById").mockReturnValue({
      populate: vi.fn().mockResolvedValue({
        _id: templateId,
        name: "Semester 2",
        subjects: [{ _id: "sub1", name: "Calculus" }],
      }),
    });

    const res = await request(app)
      .get(`/api/v1/semesters/semester-template/${templateId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Semester 2");
    expect(res.body.data.subjects.length).toBe(1);
  });

  it("POST /api/v1/semester-templates should create template and default name if omitted", async () => {
    const majorId = "64f1a2b3c4d5e6f7a8b9c0d1";
    vi.spyOn(SemesterTemplate, "create").mockImplementation(async (data) => ({
      _id: "newTmpl1",
      ...data,
    }));

    const res = await request(app)
      .post("/api/v1/semester-templates")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        major: majorId,
        index: 3,
        subjects: [],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Semester 3");
  });

  it("PATCH /api/v1/semester-templates/:id should update template", async () => {
    const templateId = "64f1a2b3c4d5e6f7a8b9c0d2";
    vi.spyOn(SemesterTemplate, "findByIdAndUpdate").mockResolvedValue({
      _id: templateId,
      name: "Updated Semester",
    });

    const res = await request(app)
      .patch(`/api/v1/semester-templates/${templateId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Updated Semester" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Updated Semester");
  });

  it("DELETE /api/v1/semester-templates/:id should delete template", async () => {
    const templateId = "64f1a2b3c4d5e6f7a8b9c0d2";
    vi.spyOn(SemesterTemplate, "findByIdAndDelete").mockResolvedValue({
      _id: templateId,
    });

    const res = await request(app)
      .delete(`/api/v1/semester-templates/${templateId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(204);
  });
});
