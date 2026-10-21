import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { createJWT } from "../../src/core/utils/token.utils.js";
import Course from "../../src/models/Course.js";
import Subject from "../../src/models/Subject.js";
import Major from "../../src/models/Major.js";

describe("Academic Query Route Aliases (Task 1.3)", () => {
  const adminToken = createJWT({
    userId: "admin123",
    role: "admin",
    universityId: "univ123",
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("GET /api/v1/courses/semester-courses/:semesterId should return courses in that semester", async () => {
    const semesterId = "64f1a2b3c4d5e6f7a8b9c0d1";
    const mockCourses = [
      { _id: "course1", name: "Data Structures", semester: semesterId },
      { _id: "course2", name: "Algorithms", semester: semesterId },
    ];

    vi.spyOn(Course, "find").mockResolvedValue(mockCourses);

    const res = await request(app)
      .get(`/api/v1/courses/semester-courses/${semesterId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].name).toBe("Data Structures");
  });

  it("GET /api/v1/subjects/collage-subjects/:id should return subjects for major or college", async () => {
    const majorId = "64f1a2b3c4d5e6f7a8b9c0d2";
    const collegeId = "64f1a2b3c4d5e6f7a8b9c0d3";
    const mockSubjects = [
      { _id: "sub1", name: "Physics I", college: collegeId },
    ];

    vi.spyOn(Major, "findById").mockResolvedValue({ _id: majorId, college: collegeId });
    vi.spyOn(Subject, "countDocuments").mockResolvedValue(1);
    vi.spyOn(Subject, "find").mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            populate: vi.fn().mockResolvedValue(mockSubjects),
          }),
        }),
      }),
    });

    const res = await request(app)
      .get(`/api/v1/subjects/collage-subjects/${majorId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].name).toBe("Physics I");
  });

  it("GET /api/v1/majors/major/:id should return major details", async () => {
    const majorId = "64f1a2b3c4d5e6f7a8b9c0d4";
    const mockMajor = {
      _id: majorId,
      name: "Computer Science",
      code: "CS",
      college: "col123",
    };

    vi.spyOn(Major, "findById").mockReturnValue({
      populate: vi.fn().mockResolvedValue(mockMajor),
    });

    const res = await request(app)
      .get(`/api/v1/majors/major/${majorId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Computer Science");
  });
});
