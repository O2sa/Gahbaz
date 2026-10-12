import Grade from "../../models/Grade.js";
import Course from "../../models/Course.js";
import Student from "../../models/Student.js";
import { NotFoundError } from "../../core/errors/customErrors.js";
import { paginateQuery, parsePagination } from "../../core/utils/pagination.utils.js";

export const getGradeByIdService = async (id) => {
  const grade = await Grade.findById(id);
  if (!grade) throw new NotFoundError("Grade not found");
  return grade;
};

export const getGradesByCourseService = async (courseId, query = {}) => {
  const { page, limit } = parsePagination(query);
  return paginateQuery(Grade, { course: courseId }, { page, limit, populate: "student" });
};

export const getStudentGradesService = async (studentId) => {
  const student = await Student.findById(studentId).populate("semesters");
  if (!student) throw new NotFoundError("Student not found");

  const results = [];
  for (const semester of student.semesters || []) {
    const grades = await Grade.find({
      course: { $in: semester.courses },
      student: studentId,
    }).populate("course");
    results.push({ semester, grades });
  }
  return results;
};

export const updateGradeService = async (gradeId, gradeData) => {
  const gradeDoc = await Grade.findById(gradeId);
  if (!gradeDoc) throw new NotFoundError("Grade not found");

  const course = await Course.findById(gradeDoc.course);
  await gradeDoc.updateGrade(gradeData, course?.gradeSchema);
  return gradeDoc;
};
