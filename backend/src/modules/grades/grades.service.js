import Grade from "../../models/Grade.js";
import Course from "../../models/Course.js";
import Student from "../../models/Student.js";
import { NotFoundError, BadRequestError } from "../../core/errors/customErrors.js";
import { parsePagination } from "../../core/utils/pagination.utils.js";

export const getGradesByCourseService = async (courseId, query = {}) => {
  const course = await Course.findById(courseId);
  if (!course) throw new NotFoundError("Course not found");

  const { page, limit } = parsePagination(query);
  const gradesQuery = Grade.find({ course: courseId });
  const grades = typeof gradesQuery.populate === "function"
    ? await gradesQuery.populate("student")
    : await gradesQuery;

  const gradeSchema = course.gradeSchema || {
    total: 100,
    grade: {
      0: { name: "تكاليف", value: 20 },
      1: { name: "نصفي", value: 30 },
      2: { name: "نهائي", value: 50 },
    },
  };

  const totalStudents = grades.length;
  let sumScore = 0;
  let maxScore = 0;
  let passingCount = 0;

  for (const g of grades) {
    const s = Number(g.total ?? g.percent ?? 0);
    sumScore += s;
    if (s > maxScore) maxScore = s;
    if (s >= 60) passingCount++;
  }

  const averageScore = totalStudents > 0 ? Math.round((sumScore / totalStudents) * 10) / 10 : 0;
  const passingRate = totalStudents > 0 ? Math.round((passingCount / totalStudents) * 100) : 0;

  return {
    course: {
      _id: course._id,
      name: course.name,
      code: course.code,
      creditHours: course.creditHours,
    },
    gradeSchema,
    metrics: {
      totalStudents,
      averageScore,
      maxScore,
      passingCount,
      failingCount: totalStudents - passingCount,
      passingRate,
    },
    grades,
    meta: {
      page: Number(page) || 1,
      limit: Number(limit) || 50,
      total: totalStudents,
    },
  };
};

export const getGradeByIdService = async (id) => {
  const isCourse = await Course.exists({ _id: id });
  if (isCourse) {
    const grades = await Grade.find({ course: id }).populate("student");
    return grades;
  }

  const grade = await Grade.findById(id);
  if (grade) {
    return grade;
  }

  const courseGrades = await Grade.find({ course: id }).populate("student");
  if (courseGrades && courseGrades.length > 0) {
    return courseGrades;
  }

  throw new NotFoundError("Grade not found");
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
  const gradeSchema = course?.gradeSchema || {
    total: 100,
    grade: {
      0: { name: "تكاليف", value: 20 },
      1: { name: "نصفي", value: 30 },
      2: { name: "نهائي", value: 50 },
    },
  };

  const payload = gradeData.grade || gradeData;

  for (const key in payload) {
    const val = typeof payload[key] === "object" ? Number(payload[key].value) : Number(payload[key]);
    if (isNaN(val)) continue;

    const maxAllowed = gradeSchema.grade?.[key]?.value ?? 100;
    if (val < 0 || val > maxAllowed) {
      throw new BadRequestError(`Grade value cannot exceed maximum allowed score of ${maxAllowed}`);
    }
  }

  await gradeDoc.updateGrade(payload, gradeSchema);
  return gradeDoc;
};
