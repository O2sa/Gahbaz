import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { createJWT } from "../../src/core/utils/token.utils.js";
import Student from "../../src/models/Student.js";
import Semester from "../../src/models/Semester.js";
import Course from "../../src/models/Course.js";
import Grade from "../../src/models/Grade.js";

describe("Cumulative GPA & Official Academic Transcript Engine (Task 4.4)", () => {
  const studentId = "64f1a2b3c4d5e6f7a8b9c111";
  const universityId = "64f1a2b3c4d5e6f7a8b9c222";
  const semesterId = "64f1a2b3c4d5e6f7a8b9c333";
  const course1Id = "64f1a2b3c4d5e6f7a8b9c444";
  const course2Id = "64f1a2b3c4d5e6f7a8b9c555";

  const studentToken = createJWT({
    userId: studentId,
    role: "student",
    universityId: universityId,
  });

  const adminToken = createJWT({
    userId: "admin123",
    role: "admin",
    universityId: universityId,
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("GET /api/v1/transcripts/my-transcript should calculate weighted GPA, letter grades and credit totals", async () => {
    const mockStudent = {
      _id: studentId,
      name: "Ahmed Ali",
      email: "ahmed@example.com",
      major: {
        _id: "major123",
        name: "Software Engineering",
        college: { name: "Faculty of Computing" },
      },
      university: { name: "Gahbaz University" },
      semesters: [semesterId],
    };

    const mockSemester = {
      _id: semesterId,
      name: "Fall Semester 2025/2026",
      completed: true,
      startDate: new Date("2025-09-01"),
    };

    // Course 1: 3 credits, grade 92% -> Letter A (3.75), Quality points = 3 * 3.75 = 11.25
    // Course 2: 4 credits, grade 86% -> Letter B+ (3.50), Quality points = 4 * 3.50 = 14.00
    // Total Credits = 7, Total Quality Points = 25.25 -> GPA = 25.25 / 7 = 3.61
    const mockCourses = [
      {
        _id: course1Id,
        name: "Object Oriented Programming",
        code: "CS201",
        creditHours: 3,
        semester: semesterId,
        students: [{ student: studentId }],
      },
      {
        _id: course2Id,
        name: "Data Structures & Algorithms",
        code: "CS202",
        creditHours: 4,
        semester: semesterId,
        students: [{ student: studentId }],
      },
    ];

    const mockGrades = [
      {
        student: studentId,
        course: course1Id,
        percent: 92,
        total: 92,
      },
      {
        student: studentId,
        course: course2Id,
        percent: 86,
        total: 86,
      },
    ];

    vi.spyOn(Student, "findById").mockReturnValue({
      populate: () => ({
        populate: () => Promise.resolve(mockStudent),
      }),
    });

    vi.spyOn(Semester, "find").mockReturnValue({
      sort: () => Promise.resolve([mockSemester]),
    });

    vi.spyOn(Course, "find").mockResolvedValue(mockCourses);
    vi.spyOn(Grade, "find").mockResolvedValue(mockGrades);

    const res = await request(app)
      .get("/api/v1/transcripts/my-transcript")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const { summary, semesters, student } = res.body.data;
    expect(student.name).toBe("Ahmed Ali");
    expect(student.major).toBe("Software Engineering");

    expect(summary.totalCreditsAttempted).toBe(7);
    expect(summary.totalCreditsEarned).toBe(7);
    expect(summary.cumulativeGPA).toBe(3.61);
    expect(summary.academicStanding).toBe("امتياز");

    expect(semesters).toHaveLength(1);
    const term = semesters[0];
    expect(term.semesterGPA).toBe(3.61);
    expect(term.creditsAttempted).toBe(7);
    expect(term.creditsEarned).toBe(7);
    expect(term.courses).toHaveLength(2);

    const c1 = term.courses.find((c) => c.code === "CS201");
    expect(c1.letterGrade).toBe("A");
    expect(c1.gradePoints).toBe(3.75);
    expect(c1.passed).toBe(true);

    const c2 = term.courses.find((c) => c.code === "CS202");
    expect(c2.letterGrade).toBe("B+");
    expect(c2.gradePoints).toBe(3.5);
    expect(c2.passed).toBe(true);
  });

  it("GET /api/v1/transcripts/student/:studentId should allow admin to view any student transcript", async () => {
    const mockStudent = {
      _id: studentId,
      name: "Sara Mohamed",
      email: "sara@example.com",
      major: { name: "Information Systems" },
      semesters: [],
    };

    vi.spyOn(Student, "findById").mockReturnValue({
      populate: () => ({
        populate: () => Promise.resolve(mockStudent),
      }),
    });
    vi.spyOn(Semester, "find").mockReturnValue({
      sort: () => Promise.resolve([]),
    });
    vi.spyOn(Course, "find").mockResolvedValue([]);
    vi.spyOn(Grade, "find").mockResolvedValue([]);

    const res = await request(app)
      .get(`/api/v1/transcripts/student/${studentId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.student.name).toBe("Sara Mohamed");
    expect(res.body.data.summary.cumulativeGPA).toBe(0);
    expect(res.body.data.summary.totalCreditsAttempted).toBe(0);
  });

  it("GET /api/v1/transcripts/student/:studentId should forbid unauthorized student from accessing another transcript", async () => {
    const otherStudentToken = createJWT({
      userId: "intruderStudentId",
      role: "student",
      universityId: universityId,
    });

    const res = await request(app)
      .get(`/api/v1/transcripts/student/${studentId}`)
      .set("Authorization", `Bearer ${otherStudentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
