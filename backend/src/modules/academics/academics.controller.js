import * as svc from "./academics.service.js";
import {
  sendSuccess,
  sendCreated,
  sendNoContent,
} from "../../core/utils/response.utils.js";

// Colleges
export const getColleges = async (req, res) => {
  const data = await svc.getCollegesService(req.user.universityId);
  sendSuccess(res, data);
};

export const getCollege = async (req, res) => {
  const data = await svc.getCollegeByIdService(req.params.id, req.user.universityId);
  sendSuccess(res, data);
};

export const createCollege = async (req, res) => {
  const data = await svc.createCollegeService(req.body, req.user.universityId);
  sendCreated(res, data);
};

export const updateCollege = async (req, res) => {
  const data = await svc.updateCollegeService(req.params.id, req.body, req.user.universityId);
  sendSuccess(res, data);
};

export const deleteCollege = async (req, res) => {
  await svc.deleteCollegeService(req.params.id, req.user.universityId);
  sendNoContent(res);
};

// Aliases for college controller
export const getCollages = getColleges;
export const getCollage = getCollege;
export const createCollage = createCollege;
export const updateCollage = updateCollege;
export const deleteCollage = deleteCollege;

// Majors
export const getMajors = async (req, res) => {
  const collegeId = req.query.college || req.query.collage;
  const filter = collegeId ? { college: collegeId } : {};
  const data = await svc.getMajorsService(filter);
  sendSuccess(res, data);
};

export const getMajor = async (req, res) => {
  const data = await svc.getMajorByIdService(req.params.id);
  sendSuccess(res, data);
};

export const createMajor = async (req, res) => {
  const data = await svc.createMajorService(req.body, req.user.universityId);
  sendCreated(res, data);
};

export const updateMajor = async (req, res) => {
  const data = await svc.updateMajorService(req.params.id, req.body);
  sendSuccess(res, data);
};

export const deleteMajor = async (req, res) => {
  await svc.deleteMajorService(req.params.id);
  sendNoContent(res);
};

// Semester Templates
export const getSemesterTemplates = async (req, res) => {
  const filter = req.query.major ? { major: req.query.major } : {};
  const data = await svc.getSemesterTemplatesService(filter);
  sendSuccess(res, data);
};

export const getSemesterTemplate = async (req, res) => {
  const data = await svc.getSemesterTemplateByIdService(req.params.id);
  sendSuccess(res, data);
};

export const createSemesterTemplate = async (req, res) => {
  const data = await svc.createSemesterTemplateService(req.body);
  sendCreated(res, data);
};

export const updateSemesterTemplate = async (req, res) => {
  const data = await svc.updateSemesterTemplateService(req.params.id, req.body);
  sendSuccess(res, data);
};

export const deleteSemesterTemplate = async (req, res) => {
  await svc.deleteSemesterTemplateService(req.params.id);
  sendNoContent(res);
};

// Subjects
export const getSubjects = async (req, res) => {
  const collegeId = req.query.college || req.query.collage;
  const filter = collegeId ? { college: collegeId } : {};
  const data = await svc.getSubjectsService(filter);
  sendSuccess(res, data);
};

export const getSubject = async (req, res) => {
  const data = await svc.getSubjectByIdService(req.params.id);
  sendSuccess(res, data);
};

export const createSubject = async (req, res) => {
  const data = await svc.createSubjectService(req.body, req.user.universityId);
  sendCreated(res, data);
};

export const updateSubject = async (req, res) => {
  const data = await svc.updateSubjectService(req.params.id, req.body);
  sendSuccess(res, data);
};

export const deleteSubject = async (req, res) => {
  await svc.deleteSubjectService(req.params.id);
  sendNoContent(res);
};

// Admins
export const getAllAdmins = async (req, res) => {
  const data = await svc.getAdminsService(req.user.universityId);
  sendSuccess(res, data);
};

export const getAdmin = async (req, res) => {
  const data = await svc.getAdminByIdService(req.params.id, req.user.universityId);
  sendSuccess(res, data);
};

export const createAdmin = async (req, res) => {
  const data = await svc.createAdminService(req.body, req.user.universityId);
  sendCreated(res, data);
};

export const updateAdmin = async (req, res) => {
  const data = await svc.updateAdminService(req.params.id, req.body, req.user.universityId);
  sendSuccess(res, data);
};

export const deleteAdmin = async (req, res) => {
  await svc.deleteAdminService(req.params.id, req.user.universityId);
  sendNoContent(res);
};

// Teachers
export const getAllTeachers = async (req, res) => {
  const data = await svc.getTeachersService(req.user.universityId);
  sendSuccess(res, data);
};

export const getTeacher = async (req, res) => {
  const data = await svc.getTeacherByIdService(req.params.id, req.user.universityId);
  sendSuccess(res, data);
};

export const createTeacher = async (req, res) => {
  const data = await svc.createTeacherService(req.body, req.user.universityId);
  sendCreated(res, data);
};

export const updateTeacher = async (req, res) => {
  const data = await svc.updateTeacherService(req.params.id, req.body, req.user.universityId);
  sendSuccess(res, data);
};

export const deleteTeacher = async (req, res) => {
  await svc.deleteTeacherService(req.params.id, req.user.universityId);
  sendNoContent(res);
};

// Students
export const getAllStudents = async (req, res) => {
  const data = await svc.getStudentsService(req.user.universityId);
  sendSuccess(res, data);
};

export const getStudent = async (req, res) => {
  const data = await svc.getStudentByIdService(req.params.id, req.user.universityId);
  sendSuccess(res, data);
};

export const createStudent = async (req, res) => {
  const data = await svc.createStudentService(req.body, req.user.universityId);
  sendCreated(res, data);
};

export const updateStudent = async (req, res) => {
  const data = await svc.updateStudentService(req.params.id, req.body, req.user.universityId);
  sendSuccess(res, data);
};

export const deleteStudent = async (req, res) => {
  await svc.deleteStudentService(req.params.id, req.user.universityId);
  sendNoContent(res);
};

// Semesters
export const getAllSemesters = async (req, res) => {
  const data = await svc.getAllSemestersService(req.user.universityId);
  sendSuccess(res, data);
};

export const getSemester = async (req, res) => {
  const data = await svc.getSemesterByIdService(req.params.id);
  sendSuccess(res, data);
};

export const updateSemester = async (req, res) => {
  const data = await svc.updateSemesterService(req.params.id, req.body);
  sendSuccess(res, data);
};

export const deleteSemester = async (req, res) => {
  await svc.deleteSemesterService(req.params.id);
  sendNoContent(res);
};

export const startSemester = async (req, res) => {
  const data = await svc.startSemesterService(req.body, req.user.universityId);
  sendSuccess(res, data);
};

export const endSemester = async (req, res) => {
  const data = await svc.endSemesterService(req.params.id);
  sendSuccess(res, data);
};

// Courses
export const createCourse = async (req, res) => {
  const data = await svc.createCourseService(req.body);
  sendCreated(res, data);
};

export const getCourse = async (req, res) => {
  const data = await svc.getCourseByIdService(req.params.id);
  sendSuccess(res, data);
};

export const updateCourse = async (req, res) => {
  const data = await svc.updateCourseService(req.params.id, req.body);
  sendSuccess(res, data);
};

export const deleteCourse = async (req, res) => {
  await svc.deleteCourseService(req.params.id);
  sendNoContent(res);
};

export const getUserCourses = async (req, res) => {
  const data = await svc.getUserCoursesService(req.user);
  sendSuccess(res, data);
};

// Sections & Lessons
export const createSection = async (req, res) => {
  const data = await svc.createSectionService(req.body);
  sendCreated(res, data);
};

export const getSection = async (req, res) => {
  const data = await svc.getSectionByIdService(req.params.id);
  sendSuccess(res, data);
};

export const updateSection = async (req, res) => {
  const data = await svc.updateSectionService(req.params.id, req.body);
  sendSuccess(res, data);
};

export const deleteSection = async (req, res) => {
  await svc.deleteSectionService(req.params.id);
  sendNoContent(res);
};

export const addLesson = async (req, res) => {
  const data = await svc.addLessonService(req.params.sectionId, req.body);
  sendCreated(res, data);
};

export const updateLesson = async (req, res) => {
  const data = await svc.updateLessonService(req.params.sectionId, req.params.lessonId, req.body);
  sendSuccess(res, data);
};

export const deleteLesson = async (req, res) => {
  await svc.deleteLessonService(req.params.sectionId, req.params.lessonId);
  sendNoContent(res);
};

// Grades
export const getGrade = async (req, res) => {
  const data = await svc.getGradeByIdService(req.params.gradeId || req.params.id);
  sendSuccess(res, data);
};

export const getCourseGrades = async (req, res) => {
  const data = await svc.getGradesByCourseService(req.params.courseId);
  sendSuccess(res, data);
};

export const getStudentGrades = async (req, res) => {
  const studentId = req.params.studentId || req.user.userId || req.user.id;
  const data = await svc.getStudentGradesService(studentId);
  sendSuccess(res, data);
};

export const updateGrade = async (req, res) => {
  const data = await svc.updateGradeService(req.params.gradeId || req.params.id, req.body.grade || req.body);
  sendSuccess(res, data);
};
