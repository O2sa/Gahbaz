import * as svc from "./academics.service.js";

// Collages
export const getCollages = async (req, res) => {
  const data = await svc.getCollagesService(req.user.universityId);
  res.status(200).json(data);
};

export const getCollage = async (req, res) => {
  const data = await svc.getCollageByIdService(req.params.id, req.user.universityId);
  res.status(200).json(data);
};

export const createCollage = async (req, res) => {
  const data = await svc.createCollageService(req.body, req.user.universityId);
  res.status(201).json(data);
};

export const updateCollage = async (req, res) => {
  const data = await svc.updateCollageService(req.params.id, req.body, req.user.universityId);
  res.status(200).json(data);
};

export const deleteCollage = async (req, res) => {
  await svc.deleteCollageService(req.params.id, req.user.universityId);
  res.status(200).json({ msg: "Collage deleted successfully" });
};

// Majors
export const getMajors = async (req, res) => {
  const data = await svc.getMajorsService(req.query.collage ? { collage: req.query.collage } : {});
  res.status(200).json(data);
};

export const getMajor = async (req, res) => {
  const data = await svc.getMajorByIdService(req.params.id);
  res.status(200).json(data);
};

export const createMajor = async (req, res) => {
  const data = await svc.createMajorService(req.body, req.user.universityId);
  res.status(201).json(data);
};

export const updateMajor = async (req, res) => {
  const data = await svc.updateMajorService(req.params.id, req.body);
  res.status(200).json(data);
};

export const deleteMajor = async (req, res) => {
  await svc.deleteMajorService(req.params.id);
  res.status(200).json({ msg: "Major deleted successfully" });
};

// Subjects
export const getSubjects = async (req, res) => {
  const data = await svc.getSubjectsService(req.query.collage ? { collage: req.query.collage } : {});
  res.status(200).json(data);
};

export const getSubject = async (req, res) => {
  const data = await svc.getSubjectByIdService(req.params.id);
  res.status(200).json(data);
};

export const createSubject = async (req, res) => {
  const data = await svc.createSubjectService(req.body, req.user.universityId);
  res.status(201).json(data);
};

export const updateSubject = async (req, res) => {
  const data = await svc.updateSubjectService(req.params.id, req.body);
  res.status(200).json(data);
};

export const deleteSubject = async (req, res) => {
  await svc.deleteSubjectService(req.params.id);
  res.status(200).json({ msg: "Subject deleted successfully" });
};

// Admins
export const getAllAdmins = async (req, res) => {
  const data = await svc.getAdminsService(req.user.universityId);
  res.status(200).json(data);
};

export const getAdmin = async (req, res) => {
  const data = await svc.getAdminByIdService(req.params.id, req.user.universityId);
  res.status(200).json(data);
};

export const createAdmin = async (req, res) => {
  const data = await svc.createAdminService(req.body, req.user.universityId);
  res.status(201).json(data);
};

export const updateAdmin = async (req, res) => {
  const data = await svc.updateAdminService(req.params.id, req.body, req.user.universityId);
  res.status(200).json(data);
};

export const deleteAdmin = async (req, res) => {
  await svc.deleteAdminService(req.params.id, req.user.universityId);
  res.status(200).json({ msg: "Admin deleted successfully" });
};

// Teachers
export const getAllTeachers = async (req, res) => {
  const data = await svc.getTeachersService(req.user.universityId);
  res.status(200).json(data);
};

export const getTeacher = async (req, res) => {
  const data = await svc.getTeacherByIdService(req.params.id, req.user.universityId);
  res.status(200).json(data);
};

export const createTeacher = async (req, res) => {
  const data = await svc.createTeacherService(req.body, req.user.universityId);
  res.status(201).json(data);
};

export const updateTeacher = async (req, res) => {
  const data = await svc.updateTeacherService(req.params.id, req.body, req.user.universityId);
  res.status(200).json(data);
};

export const deleteTeacher = async (req, res) => {
  await svc.deleteTeacherService(req.params.id, req.user.universityId);
  res.status(200).json({ msg: "Teacher deleted successfully" });
};

// Students
export const getAllStudents = async (req, res) => {
  const data = await svc.getStudentsService(req.user.universityId);
  res.status(200).json(data); // 200 OK (fixed 201 bug on GET)
};

export const getStudent = async (req, res) => {
  const data = await svc.getStudentByIdService(req.params.id, req.user.universityId);
  res.status(200).json(data);
};

export const createStudent = async (req, res) => {
  const data = await svc.createStudentService(req.body, req.user.universityId);
  res.status(201).json(data);
};

export const updateStudent = async (req, res) => {
  const data = await svc.updateStudentService(req.params.id, req.body, req.user.universityId);
  res.status(200).json(data);
};

export const deleteStudent = async (req, res) => {
  await svc.deleteStudentService(req.params.id, req.user.universityId);
  res.status(200).json({ msg: "Student deleted successfully" });
};

// Semesters
export const getAllSemesters = async (req, res) => {
  const data = await svc.getAllSemestersService(req.user.universityId);
  res.status(200).json(data);
};

export const getSemester = async (req, res) => {
  const data = await svc.getSemesterByIdService(req.params.id);
  res.status(200).json(data);
};

export const updateSemester = async (req, res) => {
  const data = await svc.updateSemesterService(req.params.id, req.body);
  res.status(200).json(data);
};

export const deleteSemester = async (req, res) => {
  await svc.deleteSemesterService(req.params.id);
  res.status(200).json({ msg: "Semester deleted successfully" });
};

export const endSemester = async (req, res) => {
  const data = await svc.endSemesterService(req.params.id);
  res.status(200).json(data);
};

export const startSemester = async (req, res) => {
  const data = await svc.startSemesterService(req.body, req.user.universityId);
  res.status(200).json(data);
};

// Courses
export const getCourse = async (req, res) => {
  const data = await svc.getCourseByIdService(req.params.id);
  res.status(200).json(data);
};

export const createCourse = async (req, res) => {
  const data = await svc.createCourseService(req.body);
  res.status(201).json(data);
};

export const updateCourse = async (req, res) => {
  const data = await svc.updateCourseService(req.params.id, req.body);
  res.status(200).json(data);
};

export const deleteCourse = async (req, res) => {
  await svc.deleteCourseService(req.params.id);
  res.status(200).json({ msg: "Course deleted successfully" });
};

export const getUserCourses = async (req, res) => {
  const data = await svc.getUserCoursesService(req.user);
  res.status(200).json(data);
};

// Sections & Lessons
export const getSection = async (req, res) => {
  const data = await svc.getSectionByIdService(req.params.id);
  res.status(200).json(data);
};

export const createSection = async (req, res) => {
  const data = await svc.createSectionService(req.body);
  res.status(201).json(data);
};

export const updateSection = async (req, res) => {
  const data = await svc.updateSectionService(req.params.id, req.body);
  res.status(200).json(data);
};

export const deleteSection = async (req, res) => {
  await svc.deleteSectionService(req.params.id);
  res.status(200).json({ msg: "Section deleted successfully" });
};

export const addLesson = async (req, res) => {
  const data = await svc.addLessonService(req.params.sectionId, req.body);
  res.status(201).json(data);
};

export const updateLesson = async (req, res) => {
  const data = await svc.updateLessonService(req.params.sectionId, req.params.lessonId, req.body);
  res.status(200).json(data);
};

export const deleteLesson = async (req, res) => {
  const data = await svc.deleteLessonService(req.params.sectionId, req.params.lessonId);
  res.status(200).json(data);
};

// Grades
export const getGrade = async (req, res) => {
  const data = await svc.getGradeByIdService(req.params.gradeId || req.params.id);
  res.status(200).json(data);
};

export const getCourseGrades = async (req, res) => {
  const data = await svc.getGradesByCourseService(req.params.courseId);
  res.status(200).json(data);
};

export const getStudentGrades = async (req, res) => {
  const data = await svc.getStudentGradesService(req.params.studentId || req.user.id);
  res.status(200).json(data);
};

export const updateGrade = async (req, res) => {
  const data = await svc.updateGradeService(req.params.gradeId, req.body.grade);
  res.status(200).json(data);
};
