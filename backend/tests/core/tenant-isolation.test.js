import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { createJWT } from "../../src/core/utils/token.utils.js";
import Course from "../../src/models/Course.js";
import Subject from "../../src/models/Subject.js";
import Section from "../../src/models/Section.js";

describe("Tenant Isolation Enforcement (Task 2.1)", () => {
  const univAToken = createJWT({
    userId: "adminA",
    role: "admin",
    universityId: "univ_AAA",
  });

  const superAdminToken = createJWT({
    userId: "superAdmin1",
    role: "super-admin",
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(Section, "find").mockResolvedValue([]);
  });

  it("GET /api/v1/courses/:id should query with university scoping and return 404 if not found", async () => {
    const courseId = "64f1a2b3c4d5e6f7a8b9c0d1";

    const findOneSpy = vi.spyOn(Course, "findOne").mockReturnValue({
      populate: vi.fn().mockReturnValue({
        populate: vi.fn().mockResolvedValue(null),
      }),
    });

    const res = await request(app)
      .get(`/api/v1/courses/${courseId}`)
      .set("Authorization", `Bearer ${univAToken}`);

    expect(findOneSpy).toHaveBeenCalledWith({ _id: courseId, university: "univ_AAA" });
    expect(res.status).toBe(404);
  });

  it("PATCH /api/v1/courses/:id should scope update to university and return 404 if not in tenant", async () => {
    const courseId = "64f1a2b3c4d5e6f7a8b9c0d1";

    const updateSpy = vi.spyOn(Course, "findOneAndUpdate").mockResolvedValue(null);

    const res = await request(app)
      .patch(`/api/v1/courses/${courseId}`)
      .set("Authorization", `Bearer ${univAToken}`)
      .send({ description: "Updated description" });

    expect(updateSpy).toHaveBeenCalledWith(
      { _id: courseId, university: "univ_AAA" },
      expect.any(Object),
      { new: true }
    );
    expect(res.status).toBe(404);
  });

  it("DELETE /api/v1/courses/:id should scope delete to university and return 404 if not in tenant", async () => {
    const courseId = "64f1a2b3c4d5e6f7a8b9c0d1";

    const deleteSpy = vi.spyOn(Course, "findOneAndDelete").mockResolvedValue(null);

    const res = await request(app)
      .delete(`/api/v1/courses/${courseId}`)
      .set("Authorization", `Bearer ${univAToken}`);

    expect(deleteSpy).toHaveBeenCalledWith({ _id: courseId, university: "univ_AAA" });
    expect(res.status).toBe(404);
  });

  it("GET /api/v1/subjects/:id should scope query to university and return 404 if not found", async () => {
    const subjectId = "64f1a2b3c4d5e6f7a8b9c0d2";

    const findOneSpy = vi.spyOn(Subject, "findOne").mockReturnValue({
      populate: vi.fn().mockResolvedValue(null),
    });

    const res = await request(app)
      .get(`/api/v1/subjects/${subjectId}`)
      .set("Authorization", `Bearer ${univAToken}`);

    expect(findOneSpy).toHaveBeenCalledWith({ _id: subjectId, university: "univ_AAA" });
    expect(res.status).toBe(404);
  });

  it("PATCH /api/v1/subjects/:id should scope update to university and return 404 if not in tenant", async () => {
    const subjectId = "64f1a2b3c4d5e6f7a8b9c0d2";

    const updateSpy = vi.spyOn(Subject, "findOneAndUpdate").mockResolvedValue(null);

    const res = await request(app)
      .patch(`/api/v1/subjects/${subjectId}`)
      .set("Authorization", `Bearer ${univAToken}`)
      .send({ name: "Updated Subject" });

    expect(updateSpy).toHaveBeenCalledWith(
      { _id: subjectId, university: "univ_AAA" },
      expect.any(Object),
      { new: true }
    );
    expect(res.status).toBe(404);
  });

  it("Super-admin can access course regardless of university scoping", async () => {
    const courseId = "64f1a2b3c4d5e6f7a8b9c0d1";
    const mockCourse = {
      _id: courseId,
      name: "Global Course",
      sections: [],
    };

    vi.spyOn(Course, "findById").mockReturnValue({
      populate: vi.fn().mockReturnValue({
        populate: vi.fn().mockResolvedValue(mockCourse),
      }),
    });

    const res = await request(app)
      .get(`/api/v1/courses/${courseId}`)
      .set("Authorization", `Bearer ${superAdminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Global Course");
  });
});
