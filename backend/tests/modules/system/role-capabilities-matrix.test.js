import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";
import { createJWT } from "../../../src/core/utils/token.utils.js";
import Course from "../../../src/models/Course.js";
import Grade from "../../../src/models/Grade.js";
import Student from "../../../src/models/Student.js";
import Chat from "../../../src/models/Chat.js";

describe("User-Perspective Role & Capabilities Matrix Guard Tests", () => {
  const superAdminToken = createJWT({
    userId: "superadmin123",
    role: "super-admin",
  });

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

  const studentToken = createJWT({
    userId: "student123",
    role: "student",
    universityId: "univ123",
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // Cap 1: University Provisioning & Licensing (Super Admin only)
  it("Cap 1: Non-super-admin roles are denied access to university provisioning", async () => {
    const resAdmin = await request(app)
      .post("/api/v1/universities")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Hacked Univ", code: "HCK" });
    expect(resAdmin.status).toBe(403);

    const resStudent = await request(app)
      .get("/api/v1/universities")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(resStudent.status).toBe(403);
  });

  // Cap 10 & 11: Assignment Publishing & Deliverable Submission
  it("Cap 10 & 11: Student cannot publish assignments; Teacher cannot submit homework deliverable", async () => {
    const resPublish = await request(app)
      .post("/api/v1/assignments/course/64f1a2b3c4d5e6f7a8b9c0d1")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ title: "Student Assignment", deadline: new Date() });
    expect(resPublish.status).toBe(403);

    const resSubmit = await request(app)
      .post("/api/v1/assignments/64f1a2b3c4d5e6f7a8b9c0d2/submissions")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({ note: "Teacher trying to submit" });
    expect(resSubmit.status).toBe(403);
  });

  // Cap 13: Real-Time Grade Inspection (Student Self-Only & Course Gradebook Denied)
  it("Cap 13: Student cannot view course gradebook, and is locked to self grades", async () => {
    const resCourseGrades = await request(app)
      .get("/api/v1/grades/course/64f1a2b3c4d5e6f7a8b9c0d1")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(resCourseGrades.status).toBe(403);

    vi.spyOn(Student, "findById").mockReturnValue({
      populate: vi.fn().mockResolvedValue({
        _id: "student123",
        semesters: [],
      }),
    });

    const resStudentGrades = await request(app)
      .get("/api/v1/grades/student/other-student-456")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(resStudentGrades.status).toBe(200);
    // Student findById must have been called with student123 (requester id), not other-student-456
    expect(Student.findById).toHaveBeenCalledWith("student123");
  });

  // Cap 14: Course Schedule & Drop Portal (Self-Add Disabled)
  it("Cap 14: Student self-addition is rejected with 403 Forbidden", async () => {
    const resRegister = await request(app)
      .post("/api/v1/enrollment/register")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ courseId: "64f1a2b3c4d5e6f7a8b9c0d1" });
    expect(resRegister.status).toBe(403);
  });

  // Cap 15: Official Printable Academic Transcript
  it("Cap 15: Student cannot inspect another student's transcript; unassigned faculty is rejected", async () => {
    const resOtherStudent = await request(app)
      .get("/api/v1/transcripts/student/different-student-789")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(resOtherStudent.status).toBe(403);

    // Unassigned teacher
    vi.spyOn(Course, "exists").mockResolvedValue(false);
    const resUnassignedTeacher = await request(app)
      .get("/api/v1/transcripts/student/student123")
      .set("Authorization", `Bearer ${teacherToken}`);
    expect(resUnassignedTeacher.status).toBe(403);
  });

  // Cap 16: Course Discussion Channels (Enrolled / Assigned Only)
  it("Cap 16: Student not enrolled in course channel is rejected", async () => {
    const courseId = "64f1a2b3c4d5e6f7a8b9c0d1";
    vi.spyOn(Course, "findById").mockReturnValue({
      populate: vi.fn().mockResolvedValue({
        _id: courseId,
        name: "Database Systems",
        teachers: ["teacher123"],
        students: [{ student: "other-enrolled-student" }],
        university: "univ123",
      }),
    });
    vi.spyOn(Chat, "findOne").mockResolvedValue({
      _id: "chat123",
      course: courseId,
      users: ["teacher123", "other-enrolled-student"],
      save: vi.fn().mockResolvedValue(true),
    });

    const resChat = await request(app)
      .get(`/api/v1/chat/course/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);
    expect(resChat.status).toBe(403);
  });

  // Cap 19: Profile & Password Self-Update (Self Only across all roles)
  it("Cap 19: Changing another user's password is rejected with 403 Forbidden", async () => {
    const resChangePass = await request(app)
      .post("/api/v1/users/another-user-999/change-pass")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        oldPassword: "oldpassword123",
        password: "newpassword123",
        confirmPassword: "newpassword123",
      });
    expect(resChangePass.status).toBe(403);
  });
});
