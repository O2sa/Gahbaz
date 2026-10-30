import Course, { ICourse } from "../../models/Course.js";
import Semester, { ISemester } from "../../models/Semester.js";
import Student, { IStudent } from "../../models/Student.js";
import Grade, { IGrade } from "../../models/Grade.js";
import Subject, { ISubject } from "../../models/Subject.js";
import { NotFoundError, BadRequestError } from "../../core/errors/customErrors.js";
import { syncCourseStudentRoster } from "../chat/chat.service.js";

export const MIN_CREDIT_HOURS = 12;
export const MAX_CREDIT_HOURS = 19;

/**
 * Checks whether the Add/Drop window is currently open for the given semester.
 */
export const isAddDropWindowOpen = (semester?: ISemester | null): boolean => {
  if (!semester || semester.completed) {
    return false;
  }
  if (semester.addDropDeadline) {
    return new Date() <= new Date(semester.addDropDeadline);
  }
  if (semester.startDate) {
    const twoWeeksAfter = new Date(new Date(semester.startDate).getTime() + 14 * 24 * 60 * 60 * 1000);
    return new Date() <= twoWeeksAfter;
  }
  return true;
};

export interface PrerequisiteResult {
  eligible: boolean;
  missingPrerequisites: { _id: string; name: string }[];
}

/**
 * Validates whether the student has completed and passed all prerequisites for a course.
 */
export const evaluateCoursePrerequisites = (
  course: any,
  studentGrades: any[] = [],
  prereqSubjects: any[] = []
): PrerequisiteResult => {
  if (!course.prerequisites || course.prerequisites.length === 0) {
    return { eligible: true, missingPrerequisites: [] };
  }

  const missingPrerequisites: { _id: string; name: string }[] = [];

  for (const prereqId of course.prerequisites) {
    const prereqIdStr = (prereqId._id || prereqId).toString();
    const prereqSubject = prereqSubjects.find(
      (s) => s._id?.toString() === prereqIdStr
    );

    // Student must have a Grade in a course matching this prerequisite with percent >= 60
    const passed = studentGrades.some((grade) => {
      const gradeCourse = grade.course;
      if (!gradeCourse) return false;
      const isMatchingCourse =
        gradeCourse._id?.toString() === prereqIdStr ||
        (prereqSubject &&
          (gradeCourse.name === prereqSubject.name ||
            (gradeCourse.code && prereqSubject.code && gradeCourse.code === prereqSubject.code)));

      const score = Number(grade.percent ?? grade.total ?? 0);
      return isMatchingCourse && score >= 60;
    });

    if (!passed) {
      missingPrerequisites.push({
        _id: prereqIdStr,
        name: prereqSubject?.name || "Prerequisite Subject",
      });
    }
  }

  return {
    eligible: missingPrerequisites.length === 0,
    missingPrerequisites,
  };
};

/**
 * Returns available courses for the student in the active or specified semester.
 */
export const getAvailableCoursesService = async (
  studentId: string,
  { semesterId = null }: { semesterId?: string | null } = {}
) => {
  const student = await Student.findById(studentId);
  if (!student) throw new NotFoundError("Student not found");

  let semester: any;
  if (semesterId) {
    semester = await Semester.findById(semesterId);
  } else {
    // Look up active semester
    semester = await Semester.findOne({
      $or: [
        { _id: { $in: student.semesters || [] }, completed: false },
        { major: student.major, completed: false },
        { completed: false },
      ],
    }).sort({ createdAt: -1 });
  }

  if (!semester) {
    throw new NotFoundError("Active semester not found");
  }

  const isAddDropOpen = isAddDropWindowOpen(semester);

  // Fetch courses in this semester
  const coursesQuery = Course.find({ semester: semester._id });
  const courses = typeof (coursesQuery as any).populate === "function"
    ? await (coursesQuery as any).populate("teachers")
    : await coursesQuery;

  // Fetch student's grades to check prerequisites
  const gradesQuery = Grade.find({ student: studentId });
  const studentGrades = typeof (gradesQuery as any).populate === "function"
    ? await (gradesQuery as any).populate("course")
    : await gradesQuery;

  // Collect prerequisite subject details
  const prereqIds = [
    ...new Set(
      courses
        .flatMap((c: any) => c.prerequisites || [])
        .map((id: any) => (id._id || id).toString())
    ),
  ];
  const prereqSubjects = prereqIds.length > 0 ? await Subject.find({ _id: { $in: prereqIds } }) : [];

  // Calculate current credit hours
  let currentCreditHours = 0;
  const processedCourses = courses.map((course: any) => {
    const isEnrolled =
      course.students?.some(
        (s: any) => (s.student?._id || s.student)?.toString() === studentId.toString()
      ) || false;

    const courseCredits = Number(course.creditHours || 3);
    if (isEnrolled) {
      currentCreditHours += courseCredits;
    }

    const { eligible, missingPrerequisites } = evaluateCoursePrerequisites(
      course,
      studentGrades,
      prereqSubjects
    );

    return {
      _id: course._id,
      name: course.name,
      subtitle: course.subtitle,
      code: course.code,
      creditHours: courseCredits,
      teachers: course.teachers,
      prerequisites: course.prerequisites || [],
      isEnrolled,
      eligible,
      missingPrerequisites,
    };
  });

  return {
    semester: {
      _id: semester._id,
      name: semester.name,
      startDate: semester.startDate,
      endDate: semester.endDate,
      addDropDeadline: semester.addDropDeadline,
      isAddDropOpen,
    },
    currentCreditHours,
    minCreditHours: MIN_CREDIT_HOURS,
    maxCreditHours: MAX_CREDIT_HOURS,
    isAddDropOpen,
    courses: processedCourses,
  };
};

/**
 * Registers student for a course during open Add/Drop window enforcing limits.
 */
export const registerCourseService = async (studentId: string, courseId: string) => {
  const course: any = await Course.findById(courseId);
  if (!course) throw new NotFoundError("Course not found");

  const semester: any = await Semester.findById(course.semester);
  if (!semester) throw new NotFoundError("Semester not found for this course");

  if (!isAddDropWindowOpen(semester)) {
    throw new BadRequestError("Add/Drop window has closed for this semester");
  }

  const isAlreadyEnrolled = course.students?.some(
    (s: any) => (s.student?._id || s.student)?.toString() === studentId.toString()
  );
  if (isAlreadyEnrolled) {
    throw new BadRequestError("Student is already registered in this course");
  }

  const student: any = await Student.findById(studentId);
  if (!student) throw new NotFoundError("Student not found");

  // Validate prerequisites
  if (course.prerequisites && course.prerequisites.length > 0) {
    const gradesQuery = Grade.find({ student: studentId });
    const studentGrades = typeof (gradesQuery as any).populate === "function"
      ? await (gradesQuery as any).populate("course")
      : await gradesQuery;
    const prereqIds = course.prerequisites.map((id: any) => (id._id || id).toString());
    const prereqSubjects = await Subject.find({ _id: { $in: prereqIds } });
    const { eligible, missingPrerequisites } = evaluateCoursePrerequisites(
      course,
      studentGrades,
      prereqSubjects
    );

    if (!eligible) {
      const missingNames = missingPrerequisites.map((p) => p.name).join(", ");
      throw new BadRequestError(`Prerequisite requirements not satisfied: Missing [${missingNames}]`);
    }
  }

  // Calculate current credit hours in semester
  const enrolledCourses: any[] = await Course.find({
    semester: course.semester,
    "students.student": studentId,
  });

  const currentCreditHours = enrolledCourses.reduce(
    (sum, c) => sum + Number(c.creditHours || 3),
    0
  );
  const courseCredits = Number(course.creditHours || 3);
  const newTotalCredits = currentCreditHours + courseCredits;

  if (newTotalCredits > MAX_CREDIT_HOURS) {
    throw new BadRequestError(
      `Registration exceeds maximum allowed limit of ${MAX_CREDIT_HOURS} credit hours (Current: ${currentCreditHours}, Course: ${courseCredits})`
    );
  }

  // Create Grade record
  const grade = await Grade.create({
    course: course._id,
    student: student._id,
  });

  // Update Course students
  course.students = course.students || [];
  course.students.push({
    student: student._id,
    grade: grade._id,
  });
  await course.save();

  // Update Student grades and semesters
  student.grades = student.grades || [];
  student.grades.push(grade._id);
  if (!student.semesters?.some((s: any) => s.toString() === semester._id.toString())) {
    student.semesters = student.semesters || [];
    student.semesters.push(semester._id);
  }
  await student.save();

  // Update Semester students
  await Semester.findByIdAndUpdate(semester._id, {
    $addToSet: { students: student._id },
  });

  // Synchronize chat channel roster
  try {
    await syncCourseStudentRoster({
      courseId: course._id,
      studentId: student._id,
      action: "add",
    });
  } catch (err) {
    // Non-fatal if chat sync encounters issues
  }

  return {
    courseId: course._id,
    currentCreditHours: newTotalCredits,
  };
};

/**
 * Drops course for student during open Add/Drop window enforcing limits.
 */
export const dropCourseService = async (studentId: string, courseId: string) => {
  const course: any = await Course.findById(courseId);
  if (!course) throw new NotFoundError("Course not found");

  const semester: any = await Semester.findById(course.semester);
  if (!semester) throw new NotFoundError("Semester not found for this course");

  if (!isAddDropWindowOpen(semester)) {
    throw new BadRequestError("Add/Drop window has closed for this semester");
  }

  const isEnrolled = course.students?.some(
    (s: any) => (s.student?._id || s.student)?.toString() === studentId.toString()
  );
  if (!isEnrolled) {
    throw new BadRequestError("Student is not registered in this course");
  }

  // Calculate current and remaining credits
  const enrolledCourses: any[] = await Course.find({
    semester: course.semester,
    "students.student": studentId,
  });

  const currentCreditHours = enrolledCourses.reduce(
    (sum, c) => sum + Number(c.creditHours || 3),
    0
  );
  const courseCredits = Number(course.creditHours || 3);
  const newTotalCredits = currentCreditHours - courseCredits;

  if (newTotalCredits < MIN_CREDIT_HOURS) {
    throw new BadRequestError(
      `Cannot drop course: Enrolled credits would drop below minimum of ${MIN_CREDIT_HOURS} credit hours (Current: ${currentCreditHours}, After drop: ${newTotalCredits})`
    );
  }

  // Remove from course students
  course.students = course.students.filter(
    (s: any) => (s.student?._id || s.student)?.toString() !== studentId.toString()
  );
  await course.save();

  // Delete student grade for this course
  await Grade.deleteMany({
    course: course._id,
    student: studentId,
  });

  // Synchronize chat channel roster
  try {
    await syncCourseStudentRoster({
      courseId: course._id,
      studentId,
      action: "remove",
    });
  } catch (err) {
    // Non-fatal if chat sync encounters issues
  }

  return {
    courseId: course._id,
    currentCreditHours: newTotalCredits,
  };
};

/**
 * Retrieves student's enrolled courses in the active or specified semester.
 */
export const getMyEnrolledCoursesService = async (
  studentId: string,
  { semesterId = null }: { semesterId?: string | null } = {}
) => {
  const result = await getAvailableCoursesService(studentId, { semesterId });
  const enrolledCourses = result.courses.filter((c: any) => c.isEnrolled);
  return {
    ...result,
    courses: enrolledCourses,
  };
};
