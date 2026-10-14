import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteCourseService } from "../../src/modules/courses/courses.service.js";
import { deleteCollegeService } from "../../src/modules/colleges/colleges.service.js";
import Course from "../../src/models/Course.js";
import Section from "../../src/models/Section.js";
import Grade from "../../src/models/Grade.js";
import Semester from "../../src/models/Semester.js";
import College from "../../src/models/College.js";
import Major from "../../src/models/Major.js";
import Subject from "../../src/models/Subject.js";
import SemesterTemplate from "../../src/models/SemesterTemplate.js";

describe("Cascade Deletion Safeguards (Task 3.2)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("deleteCourseService should delete sections, grades, and pull from semester", async () => {
    const courseId = "64f1a2b3c4d5e6f7a8b9c0d1";
    const mockCourse = {
      _id: courseId,
      name: "Calculus I",
      university: "univ123",
    };

    vi.spyOn(Course, "findOneAndDelete").mockResolvedValue(mockCourse);
    const deleteSectionsSpy = vi.spyOn(Section, "deleteMany").mockResolvedValue({ deletedCount: 3 });
    const deleteGradesSpy = vi.spyOn(Grade, "deleteMany").mockResolvedValue({ deletedCount: 15 });
    const updateSemesterSpy = vi.spyOn(Semester, "updateMany").mockResolvedValue({ modifiedCount: 1 });

    const deleted = await deleteCourseService(courseId, "univ123");

    expect(deleted._id).toBe(courseId);
    expect(deleteSectionsSpy).toHaveBeenCalledWith({ course: courseId });
    expect(deleteGradesSpy).toHaveBeenCalledWith({ course: courseId });
    expect(updateSemesterSpy).toHaveBeenCalledWith(
      { courses: courseId },
      { $pull: { courses: courseId } }
    );
  });

  it("deleteCollegeService should cascade delete majors, templates, and subjects", async () => {
    const collegeId = "64f1a2b3c4d5e6f7a8b9c0d2";
    const mockCollege = { _id: collegeId, name: "College of Science" };

    vi.spyOn(College, "findOneAndDelete").mockResolvedValue(mockCollege);
    vi.spyOn(Major, "find").mockResolvedValue([{ _id: "major1" }]);
    const deleteTemplatesSpy = vi.spyOn(SemesterTemplate, "deleteMany").mockResolvedValue({ deletedCount: 2 });
    const deleteMajorsSpy = vi.spyOn(Major, "deleteMany").mockResolvedValue({ deletedCount: 1 });
    const deleteSubjectsSpy = vi.spyOn(Subject, "deleteMany").mockResolvedValue({ deletedCount: 5 });

    const deleted = await deleteCollegeService(collegeId, "univ123");

    expect(deleted._id).toBe(collegeId);
    expect(deleteTemplatesSpy).toHaveBeenCalledWith({ major: "major1" });
    expect(deleteMajorsSpy).toHaveBeenCalledWith({ college: collegeId });
    expect(deleteSubjectsSpy).toHaveBeenCalledWith({ college: collegeId });
  });
});
