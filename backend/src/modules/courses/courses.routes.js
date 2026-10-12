import { Router } from "express";
import * as ctrl from "./courses.controller.js";
import { requireRoles, enforceDemoReadOnly } from "../../core/middleware/rbac.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { createSectionSchema, createLessonSchema } from "./courses.validator.js";

const router = Router();

// ======================== COURSES ========================
router
  .route("/")
  .get(ctrl.getUserCourses)
  .post(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.createCourse);

router
  .route("/:id")
  .get(ctrl.getCourse)
  .patch(requireRoles("teacher", "admin", "super-admin"), enforceDemoReadOnly, ctrl.updateCourse)
  .delete(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.deleteCourse);

// ======================== SECTIONS & LESSONS ========================
router.post(
  "/sections",
  requireRoles("teacher", "admin", "super-admin"),
  enforceDemoReadOnly,
  validateRequest({ body: createSectionSchema }),
  ctrl.createSection
);

router
  .route("/sections/:id")
  .get(ctrl.getSection)
  .patch(requireRoles("teacher", "admin", "super-admin"), enforceDemoReadOnly, ctrl.updateSection)
  .delete(requireRoles("teacher", "admin", "super-admin"), enforceDemoReadOnly, ctrl.deleteSection);

router.post(
  "/sections/:sectionId/lessons",
  requireRoles("teacher", "admin", "super-admin"),
  enforceDemoReadOnly,
  validateRequest({ body: createLessonSchema }),
  ctrl.addLesson
);

router
  .route("/sections/:sectionId/lessons/:lessonId")
  .patch(requireRoles("teacher", "admin", "super-admin"), enforceDemoReadOnly, ctrl.updateLesson)
  .delete(requireRoles("teacher", "admin", "super-admin"), enforceDemoReadOnly, ctrl.deleteLesson);

export default router;
