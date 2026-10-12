import { Router } from "express";
import * as ctrl from "./academics.controller.js";
import { requireRoles, enforceDemoReadOnly } from "../../core/middleware/rbac.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import * as val from "./academics.validator.js";

const router = Router();

// ======================== COLLEGES ========================
router
  .route("/colleges")
  .get(ctrl.getColleges)
  .post(
    requireRoles("admin", "super-admin"),
    enforceDemoReadOnly,
    validateRequest({ body: val.createCollageSchema }),
    ctrl.createCollege
  );

router
  .route("/colleges/:id")
  .get(ctrl.getCollege)
  .patch(
    requireRoles("admin", "super-admin"),
    enforceDemoReadOnly,
    validateRequest({ body: val.updateCollageSchema }),
    ctrl.updateCollege
  )
  .delete(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.deleteCollege);

// Legacy collages aliases
router.route("/collages").get(ctrl.getColleges).post(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.createCollege);
router.route("/collages/:id").get(ctrl.getCollege).patch(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.updateCollege).delete(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.deleteCollege);

// ======================== MAJORS ========================
router
  .route("/majors")
  .get(ctrl.getMajors)
  .post(
    requireRoles("admin", "super-admin"),
    enforceDemoReadOnly,
    validateRequest({ body: val.createMajorSchema }),
    ctrl.createMajor
  );

router
  .route("/majors/:id")
  .get(ctrl.getMajor)
  .patch(
    requireRoles("admin", "super-admin"),
    enforceDemoReadOnly,
    validateRequest({ body: val.updateMajorSchema }),
    ctrl.updateMajor
  )
  .delete(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.deleteMajor);

// ======================== SEMESTER TEMPLATES ========================
router
  .route("/semester-templates")
  .get(ctrl.getSemesterTemplates)
  .post(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.createSemesterTemplate);

router
  .route("/semester-templates/:id")
  .get(ctrl.getSemesterTemplate)
  .patch(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.updateSemesterTemplate)
  .delete(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.deleteSemesterTemplate);

// ======================== SUBJECTS ========================
router
  .route("/subjects")
  .get(ctrl.getSubjects)
  .post(
    requireRoles("admin", "super-admin"),
    enforceDemoReadOnly,
    validateRequest({ body: val.createSubjectSchema }),
    ctrl.createSubject
  );

router
  .route("/subjects/:id")
  .get(ctrl.getSubject)
  .patch(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.updateSubject)
  .delete(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.deleteSubject);

// ======================== ADMINS ========================
router
  .route("/admins")
  .get(requireRoles("super-admin"), ctrl.getAllAdmins)
  .post(
    requireRoles("super-admin"),
    enforceDemoReadOnly,
    validateRequest({ body: val.createAdminSchema }),
    ctrl.createAdmin
  );

router
  .route("/admins/:id")
  .get(requireRoles("super-admin"), ctrl.getAdmin)
  .patch(requireRoles("super-admin"), enforceDemoReadOnly, ctrl.updateAdmin)
  .delete(requireRoles("super-admin"), enforceDemoReadOnly, ctrl.deleteAdmin);

// ======================== TEACHERS ========================
router
  .route("/teachers")
  .get(ctrl.getAllTeachers)
  .post(
    requireRoles("admin", "super-admin"),
    enforceDemoReadOnly,
    validateRequest({ body: val.createTeacherSchema }),
    ctrl.createTeacher
  );

router
  .route("/teachers/:id")
  .get(ctrl.getTeacher)
  .patch(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.updateTeacher)
  .delete(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.deleteTeacher);

// ======================== STUDENTS ========================
router
  .route("/students")
  .get(ctrl.getAllStudents)
  .post(
    requireRoles("admin", "super-admin"),
    enforceDemoReadOnly,
    validateRequest({ body: val.createStudentSchema }),
    ctrl.createStudent
  );

router
  .route("/students/:id")
  .get(ctrl.getStudent)
  .patch(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.updateStudent)
  .delete(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.deleteStudent);

// ======================== SEMESTERS ========================
router
  .route("/semesters")
  .get(ctrl.getAllSemesters)
  .post(
    requireRoles("admin", "super-admin"),
    enforceDemoReadOnly,
    validateRequest({ body: val.startSemesterSchema }),
    ctrl.startSemester
  );

router.post(
  "/semesters/start-semester",
  requireRoles("admin", "super-admin"),
  enforceDemoReadOnly,
  validateRequest({ body: val.startSemesterSchema }),
  ctrl.startSemester
);

router
  .route("/semesters/:id")
  .get(ctrl.getSemester)
  .patch(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.updateSemester)
  .delete(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.deleteSemester);

router.patch(
  "/semesters/:id/end-semester",
  requireRoles("admin", "super-admin"),
  enforceDemoReadOnly,
  ctrl.endSemester
);

// ======================== COURSES ========================
router.route("/courses").get(ctrl.getUserCourses).post(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.createCourse);
router
  .route("/courses/:id")
  .get(ctrl.getCourse)
  .patch(requireRoles("teacher", "admin", "super-admin"), enforceDemoReadOnly, ctrl.updateCourse)
  .delete(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.deleteCourse);

// ======================== SECTIONS & LESSONS ========================
router.route("/sections").post(requireRoles("teacher", "admin", "super-admin"), enforceDemoReadOnly, ctrl.createSection);
router
  .route("/sections/:id")
  .get(ctrl.getSection)
  .patch(requireRoles("teacher", "admin", "super-admin"), enforceDemoReadOnly, ctrl.updateSection)
  .delete(requireRoles("teacher", "admin", "super-admin"), enforceDemoReadOnly, ctrl.deleteSection);

router.post(
  "/sections/:sectionId/lessons",
  requireRoles("teacher", "admin", "super-admin"),
  enforceDemoReadOnly,
  validateRequest({ body: val.createLessonSchema }),
  ctrl.addLesson
);

router
  .route("/sections/:sectionId/lessons/:lessonId")
  .patch(requireRoles("teacher", "admin", "super-admin"), enforceDemoReadOnly, ctrl.updateLesson)
  .delete(requireRoles("teacher", "admin", "super-admin"), enforceDemoReadOnly, ctrl.deleteLesson);

// ======================== GRADES ========================
router.get("/grades/courses/:courseId", ctrl.getCourseGrades);
router.get("/grades/students/:studentId?", ctrl.getStudentGrades);
router
  .route("/grades/:gradeId")
  .get(ctrl.getGrade)
  .patch(requireRoles("teacher", "admin", "super-admin"), enforceDemoReadOnly, ctrl.updateGrade);

export default router;
