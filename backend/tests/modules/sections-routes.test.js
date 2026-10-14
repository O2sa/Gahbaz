import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { createJWT } from "../../src/core/utils/token.utils.js";
import Section from "../../src/models/Section.js";

describe("First-Class /api/v1/sections & Lessons Routes (Task 1.1)", () => {
  const adminToken = createJWT({
    userId: "admin123",
    role: "admin",
    universityId: "univ123",
  });

  const teacherToken = createJWT({
    userId: "teacher123",
    role: "teacher",
    universityId: "univ123",
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("GET /api/v1/sections/:id should return a single section", async () => {
    const mockSection = {
      _id: "sec123",
      name: "Introduction to Networks",
      course: "course123",
      lessons: [],
    };

    vi.spyOn(Section, "findById").mockResolvedValue(mockSection);

    const res = await request(app)
      .get("/api/v1/sections/sec123")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Introduction to Networks");
  });

  it("GET /api/v1/sections/:courseId should fallback to sections array if passed courseId", async () => {
    vi.spyOn(Section, "findById").mockResolvedValue(null);
    vi.spyOn(Section, "find").mockResolvedValue([
      { _id: "sec1", name: "Section 1", course: "course123" },
      { _id: "sec2", name: "Section 2", course: "course123" },
    ]);

    const res = await request(app)
      .get("/api/v1/sections/course123")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it("GET /api/v1/sections/:sectionId/lessons/:lessonId should return the single lesson", async () => {
    const mockLesson = {
      _id: "les123",
      name: "Lesson 1: IP Addressing",
      video: { url: "http://example.com/video.mp4", duration: 15 },
      topic: { data: "<p>Text content</p>", readingTime: 5 },
    };

    const mockSection = {
      _id: "sec123",
      name: "Section 1",
      lessons: {
        id: vi.fn().mockReturnValue(mockLesson),
      },
    };

    vi.spyOn(Section, "findById").mockResolvedValue(mockSection);

    const res = await request(app)
      .get("/api/v1/sections/sec123/lessons/les123")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Lesson 1: IP Addressing");
  });

  it("POST /api/v1/sections/:sectionId/lessons should allow teachers to add a lesson", async () => {
    const mockSection = {
      _id: "sec123",
      name: "Section 1",
      addLesson: vi.fn().mockResolvedValue(true),
    };

    vi.spyOn(Section, "findById").mockResolvedValue(mockSection);

    const res = await request(app)
      .post("/api/v1/sections/sec123/lessons")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        name: "New Lesson",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(mockSection.addLesson).toHaveBeenCalled();
  });
});
