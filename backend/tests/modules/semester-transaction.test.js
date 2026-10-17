import { describe, it, expect, vi, beforeEach } from "vitest";
import mongoose from "mongoose";
import { startSemesterService } from "../../src/modules/semesters/semesters.service.js";
import SemesterTemplate from "../../src/models/SemesterTemplate.js";
import Student from "../../src/models/Student.js";
import Subject from "../../src/models/Subject.js";
import Semester from "../../src/models/Semester.js";
import Course from "../../src/models/Course.js";
import Chat from "../../src/models/Chat.js";
import Grade from "../../src/models/Grade.js";

describe("Semester ACID Transactions (Task 3.1)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should wrap startSemesterService in a MongoDB transaction session and commit on success", async () => {
    const mockSession = {
      withTransaction: vi.fn().mockImplementation(async (callback) => {
        return callback();
      }),
      endSession: vi.fn().mockResolvedValue(true),
    };

    const startSessionSpy = vi.spyOn(mongoose, "startSession").mockResolvedValue(mockSession);

    const mockTemplate = {
      _id: "tmpl1",
      name: "Fall 2026 CS",
      major: "major1",
      index: 1,
      subjects: ["sub1"],
    };

    const mockStudent = {
      _id: "student1",
      comingSemester: 1,
      major: "major1",
      semesters: [],
      save: vi.fn().mockResolvedValue(true),
    };

    const mockSubject = {
      _id: "sub1",
      name: "Computer Architecture",
      teachers: ["teacher1"],
      gradeSchema: {},
    };

    vi.spyOn(SemesterTemplate, "find").mockReturnValue({
      session: vi.fn().mockResolvedValue([mockTemplate]),
    });
    vi.spyOn(Student, "find").mockReturnValue({
      session: vi.fn().mockResolvedValue([mockStudent]),
    });
    vi.spyOn(Subject, "find").mockReturnValue({
      session: vi.fn().mockResolvedValue([mockSubject]),
    });
    vi.spyOn(SemesterTemplate, "findByIdAndUpdate").mockResolvedValue(true);
    vi.spyOn(Semester.prototype, "save").mockResolvedValue(true);
    vi.spyOn(Course.prototype, "save").mockResolvedValue(true);
    vi.spyOn(Grade.prototype, "save").mockResolvedValue(true);
    vi.spyOn(Chat, "create").mockResolvedValue(true);

    const result = await startSemesterService(
      {
        semesterData: { endDate: "2026-12-31" },
        semesters: ["tmpl1"],
      },
      "univ123"
    );

    expect(startSessionSpy).toHaveBeenCalled();
    expect(mockSession.withTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(result.success).toBe(true);
  });

  it("should rollback transaction and end session if an error occurs midway", async () => {
    const mockSession = {
      withTransaction: vi.fn().mockImplementation(async (callback) => {
        return callback();
      }),
      endSession: vi.fn().mockResolvedValue(true),
    };

    vi.spyOn(mongoose, "startSession").mockResolvedValue(mockSession);

    vi.spyOn(SemesterTemplate, "find").mockReturnValue({
      session: vi.fn().mockImplementation(() => {
        throw new Error("Database network partition during template lookup");
      }),
    });

    await expect(
      startSemesterService(
        {
          semesterData: { endDate: "2026-12-31" },
          semesters: ["tmpl1"],
        },
        "univ123"
      )
    ).rejects.toThrow("Database network partition during template lookup");

    expect(mockSession.endSession).toHaveBeenCalled();
  });

  it("should support selecting majors with allSemesters: true", async () => {
    const mockSession = {
      withTransaction: vi.fn().mockImplementation(async (callback) => callback()),
      endSession: vi.fn().mockResolvedValue(true),
    };
    vi.spyOn(mongoose, "startSession").mockResolvedValue(mockSession);

    const mockTemplate1 = {
      _id: "tmpl1",
      name: "Level 1",
      major: "major1",
      index: 1,
      subjects: ["sub1"],
    };

    vi.spyOn(SemesterTemplate, "find")
      .mockReturnValueOnce({
        session: vi.fn().mockResolvedValue([mockTemplate1]),
      })
      .mockReturnValueOnce({
        session: vi.fn().mockResolvedValue([mockTemplate1]),
      });

    vi.spyOn(Student, "find").mockReturnValue({
      session: vi.fn().mockResolvedValue([]),
    });

    const result = await startSemesterService(
      {
        semesterData: { endDate: "2026-12-31" },
        majors: [{ majorId: "major1", allSemesters: true }],
      },
      "univ123"
    );

    expect(result.success).toBe(true);
  });

  it("should support selecting custom subjects per semester template instead of default", async () => {
    const mockSession = {
      withTransaction: vi.fn().mockImplementation(async (callback) => callback()),
      endSession: vi.fn().mockResolvedValue(true),
    };
    vi.spyOn(mongoose, "startSession").mockResolvedValue(mockSession);

    const mockTemplate = {
      _id: "tmpl2",
      name: "Level 2",
      major: "major1",
      index: 2,
      subjects: ["subDefault1", "subDefault2"],
    };

    const mockStudent = {
      _id: "student2",
      comingSemester: 2,
      major: "major1",
      semesters: [],
      save: vi.fn().mockResolvedValue(true),
    };

    const mockCustomSubject = {
      _id: "subCustom1",
      name: "Advanced Web Technologies",
      teachers: ["teacher1"],
      gradeSchema: {},
    };

    vi.spyOn(SemesterTemplate, "find").mockReturnValue({
      session: vi.fn().mockResolvedValue([mockTemplate]),
    });
    vi.spyOn(Student, "find").mockReturnValue({
      session: vi.fn().mockResolvedValue([mockStudent]),
    });
    const subjectFindSpy = vi.spyOn(Subject, "find").mockReturnValue({
      session: vi.fn().mockResolvedValue([mockCustomSubject]),
    });
    vi.spyOn(SemesterTemplate, "findByIdAndUpdate").mockResolvedValue(true);
    vi.spyOn(Semester.prototype, "save").mockResolvedValue(true);
    vi.spyOn(Course.prototype, "save").mockResolvedValue(true);
    vi.spyOn(Grade.prototype, "save").mockResolvedValue(true);
    vi.spyOn(Chat, "create").mockResolvedValue(true);

    const result = await startSemesterService(
      {
        semesterData: { endDate: "2026-12-31" },
        majors: [
          {
            majorId: "major1",
            semesters: [
              {
                templateId: "tmpl2",
                subjects: ["subCustom1"], // override default ["subDefault1", "subDefault2"]
              },
            ],
          },
        ],
      },
      "univ123"
    );

    expect(result.success).toBe(true);
    expect(subjectFindSpy).toHaveBeenCalledWith({
      _id: { $in: ["subCustom1"] },
    });
  });
});
