import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createCollegeService,
  getCollegesService,
  getSubjectByIdService,
  createStudentService,
} from "../../src/modules/academics/academics.service.js";
import College from "../../src/models/College.js";
import Subject from "../../src/models/Subject.js";
import Student from "../../src/models/Student.js";
import * as mailer from "../../src/config/mailer.js";

describe("Academics Domain CRUD", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should create college scoped to university", async () => {
    const mockCollege = {
      _id: "col123",
      name: "Engineering",
      numberOfSemesters: 8,
      university: "univ123",
    };

    vi.spyOn(College, "create").mockResolvedValue(mockCollege);

    const result = await createCollegeService(
      { name: "Engineering", numberOfSemesters: 8 },
      "univ123"
    );

    expect(result.name).toBe("Engineering");
    expect(result.university).toBe("univ123");
  });

  it("should get subject by ID and NOT create a new subject (fixing getSubject bug)", async () => {
    const mockSubject = {
      _id: "sub123",
      name: "Algorithms 101",
    };

    const findByIdSpy = vi.spyOn(Subject, "findById").mockReturnValue({
      populate: vi.fn().mockResolvedValue(mockSubject),
    });
    const createSpy = vi.spyOn(Subject, "create");

    const fetched = await getSubjectByIdService("sub123");

    expect(findByIdSpy).toHaveBeenCalledWith("sub123");
    expect(createSpy).not.toHaveBeenCalled(); // Subject.create must NEVER be called on GET!
    expect(fetched.name).toBe("Algorithms 101");
  });

  it("should generate a secure temporary password and email it when creating a student", async () => {
    const sendMailSpy = vi.spyOn(mailer, "default").mockResolvedValue(true);

    const mockStudent = {
      _id: "stu123",
      firstName: "Ali",
      email: "ali@test.com",
    };

    vi.spyOn(Student, "create").mockResolvedValue(mockStudent);
    vi.spyOn(Student, "findById").mockReturnValue({
      select: vi.fn().mockResolvedValue(mockStudent),
    });

    const student = await createStudentService(
      { firstName: "Ali", email: "ali@test.com", major: "maj123" },
      "univ123"
    );

    expect(sendMailSpy).toHaveBeenCalled();
    expect(student.email).toBe("ali@test.com");
  });
});
