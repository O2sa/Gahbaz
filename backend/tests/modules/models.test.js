import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import User from "../../src/models/User.js";
import Admin from "../../src/models/Admin.js";
import Teacher from "../../src/models/Teacher.js";
import Student from "../../src/models/Student.js";
import College from "../../src/models/College.js";
import Major from "../../src/models/Major.js";
import Subject from "../../src/models/Subject.js";
import Course from "../../src/models/Course.js";
import Section from "../../src/models/Section.js";
import SemesterTemplate from "../../src/models/SemesterTemplate.js";
import Semester from "../../src/models/Semester.js";
import Grade from "../../src/models/Grade.js";
import Chat from "../../src/models/Chat.js";
import Message from "../../src/models/Message.js";
import University from "../../src/models/University.js";
import AuditLog from "../../src/models/AuditLog.js";
import PerformanceMetric from "../../src/models/PerformanceMetric.js";

describe("Standardized Mongoose 8 Domain Models", () => {
  it("should have correct model names and explicit collections", () => {
    expect(User.modelName).toBe("User");
    expect(College.collection.name).toBe("colleges");
    expect(SemesterTemplate.collection.name).toBe("semester_templates");
    expect(Chat.collection.name).toBe("chats");
    expect(Message.collection.name).toBe("messages");
    expect(AuditLog.collection.name).toBe("audit_logs");
    expect(PerformanceMetric.collection.name).toBe("performance_metrics");
  });

  it("should support discriminators on User", () => {
    expect(Admin.modelName).toBe("Admin");
    expect(Teacher.modelName).toBe("Teacher");
    expect(Student.modelName).toBe("Student");
  });

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
