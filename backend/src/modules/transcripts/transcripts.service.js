import Student from "../../models/Student.js";
import Semester from "../../models/Semester.js";
import Course from "../../models/Course.js";
import Grade from "../../models/Grade.js";
import { NotFoundError } from "../../core/errors/customErrors.js";
import {
  calculateCourseQualityPoints,
  getAcademicStanding,
} from "../../core/utils/gpa.utils.js";

/**
 * Compiles official student academic record and calculates GPA across terms and cumulatively.
 * @param {string} studentId
 */
export const getStudentTranscriptService = async (studentId) => {
  const studentQuery = Student.findById(studentId);
  const student = typeof studentQuery?.populate === "function"
    ? await studentQuery
        .populate({
          path: "major",
          populate: { path: "college" },
        })
        .populate("university")
    : await studentQuery;

  if (!student) {
    throw new NotFoundError("Student not found");
  }

  // Fetch enrolled semesters
  const semesterIds = student.semesters || [];
  const semesterQuery = Semester.find({ _id: { $in: semesterIds } });
  const semesters = typeof semesterQuery.sort === "function"
    ? await semesterQuery.sort({ startDate: 1, createdAt: 1 })
    : await semesterQuery;

  // Fetch all grades for student
  const grades = await Grade.find({ student: studentId });
  const gradesMap = new Map();
  for (const g of grades) {
    const cId = (g.course?._id || g.course)?.toString();
    if (cId) {
      gradesMap.set(cId, g);
    }
  }

  let cumulativeQualityPoints = 0;
  let cumulativeAttemptedCredits = 0;
  let cumulativeEarnedCredits = 0;

  const processedSemesters = [];

  for (const sem of semesters) {
    // Find courses student is enrolled in for this semester
    const enrolledCourses = await Course.find({
      semester: sem._id,
      "students.student": studentId,
    });

    let termQualityPoints = 0;
    let termAttemptedCredits = 0;
    let termEarnedCredits = 0;

    const courseRecords = enrolledCourses.map((c) => {
      const g = gradesMap.get(c._id.toString());
      const numericGrade = g ? Number(g.percent ?? g.total ?? 0) : 0;
      const credits = Number(c.creditHours || 3);
      const { letter, points, qualityPoints, passed } = calculateCourseQualityPoints(
        numericGrade,
        credits
      );

      termAttemptedCredits += credits;
      termQualityPoints += qualityPoints;
      if (passed) {
        termEarnedCredits += credits;
      }

      return {
        courseId: c._id,
        name: c.name,
        code: c.code || "",
        creditHours: credits,
        numericGrade,
        letterGrade: letter,
        gradePoints: points,
        qualityPoints,
        passed,
      };
    });

    const semesterGPA =
      termAttemptedCredits > 0
        ? Number((termQualityPoints / termAttemptedCredits).toFixed(2))
        : 0;

    cumulativeQualityPoints += termQualityPoints;
    cumulativeAttemptedCredits += termAttemptedCredits;
    cumulativeEarnedCredits += termEarnedCredits;

    processedSemesters.push({
      semesterId: sem._id,
      name: sem.name,
      semesterGPA,
      creditsAttempted: termAttemptedCredits,
      creditsEarned: termEarnedCredits,
      courses: courseRecords,
    });
  }

  const cumulativeGPA =
    cumulativeAttemptedCredits > 0
      ? Number((cumulativeQualityPoints / cumulativeAttemptedCredits).toFixed(2))
      : 0;

  const academicStanding = getAcademicStanding(cumulativeGPA);

  return {
    student: {
      _id: student._id,
      name:
        student.name ||
        `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
        "Student",
      email: student.email,
      major: student.major?.name || "General",
      college: student.major?.college?.name || "",
      university: student.university?.name || "",
    },
    summary: {
      totalCreditsAttempted: cumulativeAttemptedCredits,
      totalCreditsEarned: cumulativeEarnedCredits,
      cumulativeGPA,
      academicStanding,
    },
    semesters: processedSemesters,
  };
};
