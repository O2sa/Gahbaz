import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { createJWT } from "../../src/core/utils/token.utils.js";
import Grade from "../../src/models/Grade.js";
import Course from "../../src/models/Course.js";

describe("Course Gradebook Collision & Fallback (Task 1.4)", () => {
  const teacherToken = createJWT({
    userId: "teacher123",
    role: "teacher",
    universityId: "univ123",
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("GET /api/v1/grades/:courseId should return grades array if id is a course with grades", async () => {
    const courseId = "64f1a2b3c4d5e6f7a8b9c0d1";
    const mockGrades = [
      { _id: "grade1", course: courseId, student: { name: "Alice" }, total: 85 },
      { _id: "grade2", course: courseId, student: { name: "Bob" }, total: 92 },
    ];

    vi.spyOn(Course, "exists").mockResolvedValue({ _id: courseId });
    vi.spyOn(Grade, "find").mockReturnValue({
      populate: vi.fn().mockResolvedValue(mockGrades),
    });

    const res = await request(app)
      .get(`/api/v1/grades/${courseId}`)
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(2);
  });

  it("GET /api/v1/grades/:courseId should return empty array if course has no grades yet (NOT 404)", async () => {
    const courseId = "64f1a2b3c4d5e6f7a8b9c0d2";

    vi.spyOn(Course, "exists").mockResolvedValue({ _id: courseId });
    vi.spyOn(Grade, "find").mockReturnValue({
      populate: vi.fn().mockResolvedValue([]),
    });

    const res = await request(app)
      .get(`/api/v1/grades/${courseId}`)
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(0);
  });

  it("GET /api/v1/grades/:gradeId should return single grade if id is a Grade document", async () => {
    const gradeId = "64f1a2b3c4d5e6f7a8b9c0d3";
    const mockGrade = {
      _id: gradeId,
      course: "c1",
      student: "s1",
      total: 95,
    };

    vi.spyOn(Course, "exists").mockResolvedValue(null);
    vi.spyOn(Grade, "findById").mockResolvedValue(mockGrade);

    const res = await request(app)
      .get(`/api/v1/grades/${gradeId}`)
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.total).toBe(95);
  });

  it("GET /api/v1/grades/:id should return 404 if neither course nor grade exists", async () => {
    const nonExistentId = "64f1a2b3c4d5e6f7a8b9c0d4";

    vi.spyOn(Course, "exists").mockResolvedValue(null);
    vi.spyOn(Grade, "findById").mockResolvedValue(null);
    vi.spyOn(Grade, "find").mockReturnValue({
      populate: vi.fn().mockResolvedValue([]),
    });

    const res = await request(app)
      .get(`/api/v1/grades/${nonExistentId}`)
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
