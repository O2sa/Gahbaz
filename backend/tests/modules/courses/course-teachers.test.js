import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";
import { createJWT } from "../../../src/core/utils/token.utils.js";
import Course from "../../../src/models/Course.js";
import Subject from "../../../src/models/Subject.js";
import Chat from "../../../src/models/Chat.js";

describe("Course & Subject Teacher Assignment Management", () => {
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

  it("PATCH /api/v1/courses/:id as admin should update teachers and sync course chat", async () => {
    const courseId = "64f1a2b3c4d5e6f7a8b9c0d1";
    const teacherId1 = "64f1a2b3c4d5e6f7a8b9c0d2";
    const teacherId2 = "64f1a2b3c4d5e6f7a8b9c0d3";

    const updatedCourse = {
      _id: courseId,
      name: "Distributed Systems",
      teachers: [
        { _id: teacherId1, name: "Dr. Reem", email: "reem@gahbaz.edu" },
        { _id: teacherId2, name: "Dr. Faisal", email: "faisal@gahbaz.edu" },
      ],
      sections: [],
      populate: vi.fn().mockResolvedValue(true),
    };

    vi.spyOn(Course, "findOneAndUpdate").mockResolvedValue(updatedCourse);

    const mockChat = {
      _id: "chat123",
      course: courseId,
      isGroupChat: true,
      users: [teacherId1],
      groupAdmin: teacherId1,
      save: vi.fn().mockResolvedValue(true),
    };

    vi.spyOn(Chat, "findOne").mockResolvedValue(mockChat);

    const res = await request(app)
      .patch(`/api/v1/courses/${courseId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        teachers: [teacherId1, teacherId2],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.teachers).toHaveLength(2);
    expect(mockChat.users.map((u) => u.toString())).toContain(teacherId2);
    expect(mockChat.save).toHaveBeenCalled();
  });

  it("PATCH /api/v1/courses/:id as teacher should NOT allow changing teachers", async () => {
    const courseId = "64f1a2b3c4d5e6f7a8b9c0d1";
    const teacherIdAttempt = "64f1a2b3c4d5e6f7a8b9c0d9";

    let capturedData = null;
    vi.spyOn(Course, "findOneAndUpdate").mockImplementation((query, data) => {
      capturedData = data;
      return Promise.resolve({
        _id: courseId,
        name: "Distributed Systems",
        description: "Updated description by instructor",
        teachers: [],
        populate: vi.fn().mockResolvedValue(true),
      });
    });

    const res = await request(app)
      .patch(`/api/v1/courses/${courseId}`)
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        description: "Updated description by instructor",
        teachers: [teacherIdAttempt],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // teachers must be stripped for non-admins
    expect(capturedData.teachers).toBeUndefined();
    expect(capturedData.description).toBe("Updated description by instructor");
  });

  it("PATCH /api/v1/subjects/:id as admin should accept and update teachers", async () => {
    const subjectId = "64f1a2b3c4d5e6f7a8b9c0d4";
    const teacherId = "64f1a2b3c4d5e6f7a8b9c0d5";

    const updatedSubject = {
      _id: subjectId,
      name: "Cloud Computing",
      teachers: [{ _id: teacherId, name: "Dr. Reem" }],
      creditHours: 3,
      populate: vi.fn().mockResolvedValue(true),
    };

    vi.spyOn(Subject, "findOneAndUpdate").mockResolvedValue(updatedSubject);

    const res = await request(app)
      .patch(`/api/v1/subjects/${subjectId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        teachers: [teacherId],
        creditHours: 3,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.teachers).toHaveLength(1);
    expect(res.body.data.teachers[0].name).toBe("Dr. Reem");
  });
});
