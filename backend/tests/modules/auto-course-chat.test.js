import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { createJWT } from "../../src/core/utils/token.utils.js";
import {
  ensureCourseChatChannel,
  syncCourseStudentRoster,
} from "../../src/modules/chat/chat.service.js";
import { deleteCourseService } from "../../src/modules/courses/courses.service.js";
import Chat from "../../src/models/Chat.js";
import Course from "../../src/models/Course.js";
import Section from "../../src/models/Section.js";
import Grade from "../../src/models/Grade.js";
import Semester from "../../src/models/Semester.js";

describe("Automated Course Chat Channels Synchronization (Task 4.2)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("ensureCourseChatChannel should provision a discussion room with instructor as admin", async () => {
    const courseId = "64f1a2b3c4d5e6f7a8b9c0d1";
    const teacherId = "64f1a2b3c4d5e6f7a8b9c0d2";
    const student1Id = "64f1a2b3c4d5e6f7a8b9c0d3";

    const mockCourse = {
      _id: courseId,
      name: "Operating Systems",
      teachers: [{ _id: teacherId }],
      students: [{ student: student1Id }],
      university: "univ123",
    };

    vi.spyOn(Course, "findById").mockReturnValue({
      populate: vi.fn().mockResolvedValue(mockCourse),
    });
    vi.spyOn(Chat, "findOne").mockResolvedValue(null);
    const createChatSpy = vi.spyOn(Chat, "create").mockResolvedValue({
      _id: "chat123",
      chatName: "دورة Operating Systems",
      isGroupChat: true,
      users: [teacherId, student1Id],
      groupAdmin: teacherId,
    });

    const result = await ensureCourseChatChannel(courseId);

    expect(createChatSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        course: courseId,
        chatName: "دورة Operating Systems",
        isGroupChat: true,
        groupAdmin: teacherId,
        university: "univ123",
      })
    );
    expect(result._id).toBe("chat123");
  });

  it("ensureCourseChatChannel should synchronize roster if channel already exists", async () => {
    const courseId = "64f1a2b3c4d5e6f7a8b9c0d1";
    const teacherId = "64f1a2b3c4d5e6f7a8b9c0d2";
    const student1Id = "64f1a2b3c4d5e6f7a8b9c0d3";
    const student2Id = "64f1a2b3c4d5e6f7a8b9c0d4";

    const mockCourse = {
      _id: courseId,
      name: "Operating Systems",
      teachers: [{ _id: teacherId }],
      students: [{ student: student1Id }, { student: student2Id }],
      university: "univ123",
    };

    vi.spyOn(Course, "findById").mockReturnValue({
      populate: vi.fn().mockResolvedValue(mockCourse),
    });

    const existingChat = {
      _id: "chat123",
      users: [teacherId, student1Id],
      save: vi.fn().mockResolvedValue(true),
    };
    vi.spyOn(Chat, "findOne").mockResolvedValue(existingChat);

    const result = await ensureCourseChatChannel(courseId);

    expect(existingChat.save).toHaveBeenCalled();
    expect(result.users).toContain(student2Id);
  });

  it("syncCourseStudentRoster should add student to chat on enrollment", async () => {
    const courseId = "64f1a2b3c4d5e6f7a8b9c0d1";
    const studentId = "64f1a2b3c4d5e6f7a8b9c0d5";

    const findOneAndUpdateSpy = vi.spyOn(Chat, "findOneAndUpdate").mockResolvedValue({ _id: "chat1" });

    await syncCourseStudentRoster({ courseId, studentId, action: "add" });

    expect(findOneAndUpdateSpy).toHaveBeenCalledWith(
      { course: courseId },
      { $addToSet: { users: studentId } },
      { new: true }
    );
  });

  it("syncCourseStudentRoster should remove student from chat on drop", async () => {
    const courseId = "64f1a2b3c4d5e6f7a8b9c0d1";
    const studentId = "64f1a2b3c4d5e6f7a8b9c0d5";

    const findOneAndUpdateSpy = vi.spyOn(Chat, "findOneAndUpdate").mockResolvedValue({ _id: "chat1" });

    await syncCourseStudentRoster({ courseId, studentId, action: "drop" });

    expect(findOneAndUpdateSpy).toHaveBeenCalledWith(
      { course: courseId },
      { $pull: { users: studentId } },
      { new: true }
    );
  });

  it("deleteCourseService should remove corresponding course chat channel", async () => {
    const courseId = "64f1a2b3c4d5e6f7a8b9c0d1";
    const mockCourse = { _id: courseId, name: "OS", university: "univ123" };

    vi.spyOn(Course, "findOneAndDelete").mockResolvedValue(mockCourse);
    vi.spyOn(Section, "deleteMany").mockResolvedValue({ deletedCount: 0 });
    vi.spyOn(Grade, "deleteMany").mockResolvedValue({ deletedCount: 0 });
    vi.spyOn(Semester, "updateMany").mockResolvedValue({ modifiedCount: 0 });
    const deleteChatSpy = vi.spyOn(Chat, "deleteMany").mockResolvedValue({ deletedCount: 1 });

    await deleteCourseService(courseId, "univ123");

    expect(deleteChatSpy).toHaveBeenCalledWith({ course: courseId });
  });

  it("GET /api/v1/chats/course/:courseId should return populated course discussion channel", async () => {
    const courseId = "64f1a2b3c4d5e6f7a8b9c0d1";
    const teacherId = "64f1a2b3c4d5e6f7a8b9c0d2";
    const teacherToken = createJWT({
      userId: teacherId,
      role: "teacher",
      universityId: "univ123",
    });

    const mockCourse = {
      _id: courseId,
      name: "Operating Systems",
      teachers: [{ _id: teacherId }],
      students: [],
      university: "univ123",
    };

    vi.spyOn(Course, "findById").mockReturnValue({
      populate: vi.fn().mockResolvedValue(mockCourse),
    });

    const mockChannel = {
      _id: "chat123",
      chatName: "دورة Operating Systems",
      course: courseId,
      users: [teacherId],
      save: vi.fn().mockResolvedValue(true),
    };

    vi.spyOn(Chat, "findOne").mockResolvedValue(mockChannel);

    const mockPopulatedChat = {
      ...mockChannel,
      isGroupChat: true,
      course: { _id: courseId, name: "Operating Systems", code: "CS301" },
      users: [{ _id: teacherId, name: "د. علي أحمد" }],
      groupAdmin: { _id: teacherId, name: "د. علي أحمد" },
    };

    vi.spyOn(Chat, "findById").mockReturnValue({
      populate: vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          populate: vi.fn().mockReturnValue({
            populate: vi.fn().mockResolvedValue(mockPopulatedChat),
          }),
        }),
      }),
    });

    const res = await request(app)
      .get(`/api/v1/chats/course/${courseId}`)
      .set("Cookie", [`token=${teacherToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.chatName).toBe("دورة Operating Systems");
  });
});
