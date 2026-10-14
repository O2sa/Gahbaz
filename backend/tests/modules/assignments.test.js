import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { createJWT } from "../../src/core/utils/token.utils.js";
import Assignment from "../../src/models/Assignment.js";
import Submission from "../../src/models/Submission.js";
import Course from "../../src/models/Course.js";

describe("Assignment & Submissions Engine (Task 4.1)", () => {
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

  it("POST /api/v1/courses/:courseId/assignments should allow instructor to publish assignment", async () => {
    const courseId = "64f1a2b3c4d5e6f7a8b9c0d1";

    vi.spyOn(Course, "findOne").mockResolvedValue({
      _id: courseId,
      name: "Distributed Systems",
      university: "univ123",
    });

    vi.spyOn(Assignment, "create").mockImplementation(async (data) => ({
      _id: "assign123",
      ...data,
    }));

    const res = await request(app)
      .post(`/api/v1/courses/${courseId}/assignments`)
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        title: "Homework 1: Raft Consensus",
        description: "Implement leader election",
        dueDate: "2026-12-01T23:59:59.000Z",
        maxScore: 100,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Homework 1: Raft Consensus");
    expect(res.body.data.course).toBe(courseId);
  });

  it("GET /api/v1/courses/:courseId/assignments should return paginated list of assignments", async () => {
    const courseId = "64f1a2b3c4d5e6f7a8b9c0d1";
    const mockAssignments = [
      { _id: "a1", title: "HW 1", dueDate: new Date() },
      { _id: "a2", title: "HW 2", dueDate: new Date() },
    ];

    vi.spyOn(Assignment, "find").mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue(mockAssignments),
        }),
      }),
    });
    vi.spyOn(Assignment, "countDocuments").mockResolvedValue(2);

    const res = await request(app)
      .get(`/api/v1/courses/${courseId}/assignments`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].title).toBe("HW 1");
  });

  it("POST /api/v1/assignments/:id/submissions should allow student to submit work", async () => {
    const assignmentId = "64f1a2b3c4d5e6f7a8b9c0d2";
    const mockAssignment = {
      _id: assignmentId,
      course: "c1",
      university: "univ123",
      dueDate: new Date(Date.now() + 86400000), // tomorrow
    };

    vi.spyOn(Assignment, "findById").mockResolvedValue(mockAssignment);
    vi.spyOn(Submission, "findOneAndUpdate").mockResolvedValue({
      _id: "sub123",
      assignment: assignmentId,
      student: "student123",
      fileUrl: "http://example.com/raft_implementation.zip",
      status: "submitted",
    });

    const res = await request(app)
      .post(`/api/v1/assignments/${assignmentId}/submissions`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        fileUrl: "http://example.com/raft_implementation.zip",
        notes: "Included tests in readme",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("submitted");
    expect(res.body.data.fileUrl).toBe("http://example.com/raft_implementation.zip");
  });

  it("GET /api/v1/assignments/:id/submissions should allow teacher to view submissions", async () => {
    const assignmentId = "64f1a2b3c4d5e6f7a8b9c0d2";
    const mockSubmissions = [
      {
        _id: "sub1",
        student: { firstName: "Ali", lastName: "Ahmed", email: "ali@test.com" },
        fileUrl: "http://example.com/file1.zip",
        status: "submitted",
      },
    ];

    vi.spyOn(Submission, "find").mockReturnValue({
      populate: vi.fn().mockReturnValue({
        sort: vi.fn().mockResolvedValue(mockSubmissions),
      }),
    });

    const res = await request(app)
      .get(`/api/v1/assignments/${assignmentId}/submissions`)
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].student.firstName).toBe("Ali");
  });

  it("PATCH /api/v1/assignments/submissions/:submissionId/grade should allow teacher to grade submission", async () => {
    const submissionId = "64f1a2b3c4d5e6f7a8b9c0d3";
    const mockSubmission = {
      _id: submissionId,
      assignment: "a1",
      student: "s1",
      save: vi.fn().mockResolvedValue(true),
    };

    vi.spyOn(Submission, "findOne").mockResolvedValue(mockSubmission);

    const res = await request(app)
      .patch(`/api/v1/assignments/submissions/${submissionId}/grade`)
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        grade: 95,
        feedback: "Excellent raft state machine design",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockSubmission.grade).toBe(95);
    expect(mockSubmission.status).toBe("graded");
  });
});
