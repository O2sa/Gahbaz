import { describe, it, expect, vi, beforeEach } from "vitest";
import { addLessonService } from "../../src/modules/courses/courses.service.js";
import Section from "../../src/models/Section.js";

describe("Courses & Sections Service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should add and update lessons asynchronously without empty promises", async () => {
    const mockSection = {
      _id: "sec123",
      name: "Chapter 1",
      lessons: [],
      addLesson: vi.fn().mockImplementation(async function (data) {
        this.lessons.push({ _id: "les1", ...data });
        return this;
      }),
    };

    vi.spyOn(Section, "findById").mockResolvedValue(mockSection);

    const updated = await addLessonService("sec123", { name: "Binary Search" });

    expect(mockSection.addLesson).toHaveBeenCalledWith({ name: "Binary Search" });
    expect(updated.lessons.length).toBe(1);
    expect(updated.lessons[0].name).toBe("Binary Search");
  });
});

import request from "supertest";
import app from "../../src/app.js";
import { createJWT } from "../../src/core/utils/token.utils.js";
import * as semestersService from "../../src/modules/semesters/semesters.service.js";

describe("Start Semester API Endpoints", () => {
  const adminToken = createJWT({
    userId: "admin123",
    role: "admin",
    universityId: "univ123",
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("POST /api/v1/semesters/start-semester should accept client payload with majors and semesterData", async () => {
    vi.spyOn(semestersService, "startSemesterService").mockResolvedValue({ success: true, count: 1 });

    const payload = {
      semesterData: {
        name: "فصل الخريف 2026/2027",
        startDate: "2026-10-31",
        endDate: "2027-02-28",
        addDropDeadline: "2026-11-14",
      },
      majors: [
        {
          majorId: "64f1a2b3c4d5e6f7a8b9c0d3",
          allSemesters: true,
        },
      ],
    };

    const res = await request(app)
      .post("/api/v1/semesters/start-semester")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.count).toBe(1);
  });

  it("POST /api/v1/semesters/startSemester should work as alias endpoint", async () => {
    vi.spyOn(semestersService, "startSemesterService").mockResolvedValue({ success: true, count: 2 });

    const payload = {
      semesterData: {
        endDate: "2027-02-28",
      },
      semesters: ["templateId123"],
    };

    const res = await request(app)
      .post("/api/v1/semesters/startSemester")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

