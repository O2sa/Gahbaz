import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { createJWT } from "../../src/core/utils/token.utils.js";
import Course from "../../src/models/Course.js";
import Semester from "../../src/models/Semester.js";
import Student from "../../src/models/Student.js";
import Grade from "../../src/models/Grade.js";
import Subject from "../../src/models/Subject.js";
import * as chatService from "../../src/modules/chat/chat.service.js";

describe("Student Course Enrollment & Add/Drop Portal (Task 4.3)", () => {
  const studentId = "64f1a2b3c4d5e6f7a8b9c0d1";
  const universityId = "64f1a2b3c4d5e6f7a8b9c0d2";
  const semesterId = "64f1a2b3c4d5e6f7a8b9c0d3";
  const prereqSubjectId = "64f1a2b3c4d5e6f7a8b9c0d4";
  const advancedCourseId = "64f1a2b3c4d5e6f7a8b9c0d5";
  const normalCourseId = "64f1a2b3c4d5e6f7a8b9c0d6";

  const studentToken = createJWT({
    userId: studentId,
    role: "student",
    universityId: universityId,
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("GET /api/v1/enrollment/available-courses should return available courses with eligibility & credit summary", async () => {
    const mockStudent = {
      _id: studentId,
      major: "major123",
      semesters: [semesterId],
      grades: ["gradePrereqPassed"],
    };

    const mockSemester = {
      _id: semesterId,
      name: "Fall 2026",
      completed: false,
      startDate: new Date(),
      addDropDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // open
    };

    const mockCourses = [
      {
        _id: normalCourseId,
        name: "Introduction to Computer Science",
        creditHours: 3,
        prerequisites: [],
        semester: semesterId,
        students: [{ student: studentId }],
      },
      {
        _id: advancedCourseId,
        name: "Advanced Operating Systems",
        creditHours: 4,
        prerequisites: [prereqSubjectId],
        semester: semesterId,
        students: [],
      },
    ];

    vi.spyOn(Student, "findById").mockResolvedValue(mockStudent);
    vi.spyOn(Semester, "findOne").mockReturnValue({
      sort: () => Promise.resolve(mockSemester),
    });
    vi.spyOn(Semester, "findById").mockResolvedValue(mockSemester);
    vi.spyOn(Course, "find").mockReturnValue({
      populate: () => Promise.resolve(mockCourses),
    });
    vi.spyOn(Grade, "find").mockResolvedValue([
      {
        _id: "gradePrereqPassed",
        student: studentId,
        course: { _id: "courseOld", name: "Operating Systems Basics" },
        percent: 85,
      },
    ]);
    vi.spyOn(Subject, "find").mockResolvedValue([
      { _id: prereqSubjectId, name: "Operating Systems Basics" },
    ]);

    const res = await request(app)
      .get("/api/v1/enrollment/available-courses")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.currentCreditHours).toBe(3);
    expect(res.body.data.minCreditHours).toBe(12);
    expect(res.body.data.maxCreditHours).toBe(19);
    expect(res.body.data.isAddDropOpen).toBe(true);
    expect(res.body.data.courses).toHaveLength(2);

    const enrolledCourse = res.body.data.courses.find((c) => c._id === normalCourseId);
    expect(enrolledCourse.isEnrolled).toBe(true);

    const advancedCourse = res.body.data.courses.find((c) => c._id === advancedCourseId);
    expect(advancedCourse.isEnrolled).toBe(false);
    expect(advancedCourse.eligible).toBe(true);
  });

  it("POST /api/v1/enrollment/register should successfully register student, create Grade and sync chat roster", async () => {
    const mockStudent = {
      _id: studentId,
      major: "major123",
      semesters: [semesterId],
      grades: [],
      save: vi.fn().mockResolvedValue(true),
    };

    const mockSemester = {
      _id: semesterId,
      completed: false,
      addDropDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    };

    const mockCourseToRegister = {
      _id: normalCourseId,
      name: "Linear Algebra",
      creditHours: 3,
      prerequisites: [],
      semester: semesterId,
      students: [],
      save: vi.fn().mockResolvedValue(true),
    };

    // Student already has 12 credits enrolled in semester
    const enrolledCourses = [
      { _id: "c1", creditHours: 3, students: [{ student: studentId }] },
      { _id: "c2", creditHours: 3, students: [{ student: studentId }] },
      { _id: "c3", creditHours: 3, students: [{ student: studentId }] },
      { _id: "c4", creditHours: 3, students: [{ student: studentId }] },
    ];

    vi.spyOn(Student, "findById").mockResolvedValue(mockStudent);
    vi.spyOn(Course, "findById").mockResolvedValue(mockCourseToRegister);
    vi.spyOn(Semester, "findById").mockResolvedValue(mockSemester);
    vi.spyOn(Course, "find").mockResolvedValue(enrolledCourses);
    vi.spyOn(Grade, "create").mockResolvedValue({ _id: "gradeNew123" });
    vi.spyOn(Semester, "findByIdAndUpdate").mockResolvedValue({});
    const chatSyncSpy = vi.spyOn(chatService, "syncCourseStudentRoster").mockResolvedValue({});

    const res = await request(app)
      .post("/api/v1/enrollment/register")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ courseId: normalCourseId });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.currentCreditHours).toBe(15);
    expect(mockCourseToRegister.students).toEqual(
      expect.arrayContaining([expect.objectContaining({ student: studentId })])
    );
    expect(chatSyncSpy).toHaveBeenCalledWith({
      courseId: normalCourseId,
      studentId: studentId,
      action: "add",
    });
  });

  it("POST /api/v1/enrollment/register should reject if total credits exceed 19 credit hours", async () => {
    const mockStudent = {
      _id: studentId,
      semesters: [semesterId],
    };

    const mockSemester = {
      _id: semesterId,
      completed: false,
      addDropDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    };

    const mockCourseToRegister = {
      _id: normalCourseId,
      name: "Compilers",
      creditHours: 4,
      prerequisites: [],
      semester: semesterId,
      students: [],
    };

    // Student already has 17 credits enrolled (17 + 4 = 21 > 19)
    const enrolledCourses = [
      { _id: "c1", creditHours: 5, students: [{ student: studentId }] },
      { _id: "c2", creditHours: 6, students: [{ student: studentId }] },
      { _id: "c3", creditHours: 6, students: [{ student: studentId }] },
    ];

    vi.spyOn(Student, "findById").mockResolvedValue(mockStudent);
    vi.spyOn(Course, "findById").mockResolvedValue(mockCourseToRegister);
    vi.spyOn(Semester, "findById").mockResolvedValue(mockSemester);
    vi.spyOn(Course, "find").mockResolvedValue(enrolledCourses);

    const res = await request(app)
      .post("/api/v1/enrollment/register")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ courseId: normalCourseId });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error?.message || res.body.message).toMatch(/exceeds maximum allowed.*19/i);
  });

  it("POST /api/v1/enrollment/register should reject if prerequisites are not satisfied", async () => {
    const mockStudent = {
      _id: studentId,
      semesters: [semesterId],
      grades: [],
    };

    const mockSemester = {
      _id: semesterId,
      completed: false,
      addDropDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    };

    const mockCourseToRegister = {
      _id: advancedCourseId,
      name: "Advanced Database Systems",
      creditHours: 3,
      prerequisites: [prereqSubjectId],
      semester: semesterId,
      students: [],
    };

    vi.spyOn(Student, "findById").mockResolvedValue(mockStudent);
    vi.spyOn(Course, "findById").mockResolvedValue(mockCourseToRegister);
    vi.spyOn(Semester, "findById").mockResolvedValue(mockSemester);
    vi.spyOn(Course, "find").mockResolvedValue([]);
    vi.spyOn(Grade, "find").mockReturnValue({
      populate: () => Promise.resolve([]),
    });
    vi.spyOn(Subject, "find").mockResolvedValue([
      { _id: prereqSubjectId, name: "Database Fundamentals" },
    ]);

    const res = await request(app)
      .post("/api/v1/enrollment/register")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ courseId: advancedCourseId });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error?.message || res.body.message).toMatch(/prerequisite.*Database Fundamentals/i);
  });

  it("POST /api/v1/enrollment/register should reject if Add/Drop window has closed", async () => {
    const mockStudent = {
      _id: studentId,
      semesters: [semesterId],
    };

    const mockSemester = {
      _id: semesterId,
      completed: false,
      addDropDeadline: new Date(Date.now() - 24 * 60 * 60 * 1000), // expired yesterday
    };

    const mockCourse = {
      _id: normalCourseId,
      creditHours: 3,
      semester: semesterId,
      students: [],
    };

    vi.spyOn(Student, "findById").mockResolvedValue(mockStudent);
    vi.spyOn(Course, "findById").mockResolvedValue(mockCourse);
    vi.spyOn(Semester, "findById").mockResolvedValue(mockSemester);

    const res = await request(app)
      .post("/api/v1/enrollment/register")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ courseId: normalCourseId });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error?.message || res.body.message).toMatch(/add\/drop window.*closed/i);
  });

  it("POST /api/v1/enrollment/drop should successfully drop course and sync chat roster", async () => {
    const mockStudent = {
      _id: studentId,
      semesters: [semesterId],
      grades: ["grade123"],
      save: vi.fn().mockResolvedValue(true),
    };

    const mockSemester = {
      _id: semesterId,
      completed: false,
      addDropDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    };

    const mockCourseToDrop = {
      _id: normalCourseId,
      name: "Elective Course",
      creditHours: 3,
      semester: semesterId,
      students: [{ student: studentId, grade: "grade123" }],
      save: vi.fn().mockResolvedValue(true),
    };

    // Current total = 16 credits. Dropping 3 credits gives 13 credits (>= 12 allowed)
    const enrolledCourses = [
      mockCourseToDrop,
      { _id: "c1", creditHours: 5, students: [{ student: studentId }] },
      { _id: "c2", creditHours: 4, students: [{ student: studentId }] },
      { _id: "c3", creditHours: 4, students: [{ student: studentId }] },
    ];

    vi.spyOn(Student, "findById").mockResolvedValue(mockStudent);
    vi.spyOn(Course, "findById").mockResolvedValue(mockCourseToDrop);
    vi.spyOn(Semester, "findById").mockResolvedValue(mockSemester);
    vi.spyOn(Course, "find").mockResolvedValue(enrolledCourses);
    vi.spyOn(Grade, "deleteMany").mockResolvedValue({ deletedCount: 1 });
    vi.spyOn(Student, "findByIdAndUpdate").mockResolvedValue({});
    const chatSyncSpy = vi.spyOn(chatService, "syncCourseStudentRoster").mockResolvedValue({});

    const res = await request(app)
      .post("/api/v1/enrollment/drop")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ courseId: normalCourseId });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.currentCreditHours).toBe(13);
    expect(mockCourseToDrop.students).toHaveLength(0);
    expect(chatSyncSpy).toHaveBeenCalledWith({
      courseId: normalCourseId,
      studentId: studentId,
      action: "remove",
    });
  });

  it("POST /api/v1/enrollment/drop should reject if dropping course brings total credits below 12", async () => {
    const mockStudent = {
      _id: studentId,
      semesters: [semesterId],
    };

    const mockSemester = {
      _id: semesterId,
      completed: false,
      addDropDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    };

    const mockCourseToDrop = {
      _id: normalCourseId,
      creditHours: 3,
      semester: semesterId,
      students: [{ student: studentId }],
    };

    // Current total = 14 credits. Dropping 3 credits gives 11 credits (< 12 disallowed)
    const enrolledCourses = [
      mockCourseToDrop,
      { _id: "c1", creditHours: 5, students: [{ student: studentId }] },
      { _id: "c2", creditHours: 6, students: [{ student: studentId }] },
    ];

    vi.spyOn(Student, "findById").mockResolvedValue(mockStudent);
    vi.spyOn(Course, "findById").mockResolvedValue(mockCourseToDrop);
    vi.spyOn(Semester, "findById").mockResolvedValue(mockSemester);
    vi.spyOn(Course, "find").mockResolvedValue(enrolledCourses);

    const res = await request(app)
      .post("/api/v1/enrollment/drop")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ courseId: normalCourseId });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error?.message || res.body.message).toMatch(/below minimum.*12/i);
  });
});
