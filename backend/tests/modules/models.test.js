import { describe, it, expect } from "vitest";
import Grade from "../../models/Grade.js";
import Section from "../../models/Section.js";
import Subject from "../../models/Subject.js";
import mongoose from "mongoose";

describe("Mongoose Models Validation & Methods", () => {
  it("should calculate grade totals and percentages accurately with recalculateTotal", () => {
    const courseId = new mongoose.Types.ObjectId();
    const studentId = new mongoose.Types.ObjectId();
    const gradeDoc = new Grade({
      course: courseId,
      student: studentId,
      grades: [
        { key: "midterm", name: "Midterm", maxValue: 30, value: 25 },
        { key: "final", name: "Final", maxValue: 50, value: 45 },
      ],
    });

    gradeDoc.recalculateTotal();
    expect(gradeDoc.total).toBe(70);
    expect(gradeDoc.percent).toBe((70 / 80) * 100);
  });

  it("should reject grade update exceeding schema maximums", () => {
    const courseId = new mongoose.Types.ObjectId();
    const studentId = new mongoose.Types.ObjectId();
    const gradeDoc = new Grade({
      course: courseId,
      student: studentId,
    });

    const mockSchema = {
      total: 100,
      grade: {
        0: { name: "تكاليف", value: 20 },
      },
    };

    expect(() =>
      gradeDoc.updateGrade({ 0: { value: 25 } }, mockSchema)
    ).toThrow("Grade value cannot exceed maximum allowed score of 20");
  });

  it("should update grade schema total properly in Subject", () => {
    const subject = new Subject({
      name: "Computer Science",
      gradeSchema: {
        total: 0,
        grade: {
          0: { name: "Quiz", value: 0 },
          1: { name: "Final", value: 0 },
        },
      },
    });

    // Mock save
    subject.save = function () {
      return this;
    };

    subject.updateGradeSchema({
      grade: {
        0: { value: 30 },
        1: { value: 70 },
      },
    });

    expect(subject.gradeSchema.total).toBe(100);
    expect(subject.gradeSchema.grade[0].value).toBe(30);
    expect(subject.gradeSchema.grade[1].value).toBe(70);
  });
});
