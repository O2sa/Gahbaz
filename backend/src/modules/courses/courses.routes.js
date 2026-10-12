import { Router } from "express";
import * as ctrl from "./courses.controller.js";
import { requireRoles } from "../../core/middleware/rbac.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { createSectionSchema, createLessonSchema } from "./courses.validator.js";
import { paginationQuerySchema } from "../../core/utils/pagination.utils.js";

const router = Router();

// ======================== COURSES ========================
router
  .route("/")
  .get(validateRequest({ query: paginationQuerySchema }), ctrl.getUserCourses)
  .post(requireRoles("admin", "super-admin"), ctrl.createCourse);

router
  .route("/:id")
  .get(ctrl.getCourse)
  .patch(requireRoles("teacher", "admin", "super-admin"), ctrl.updateCourse)
  .delete(requireRoles("admin", "super-admin"), ctrl.deleteCourse);

// ======================== SECTIONS & LESSONS ========================
router.post(
  "/sections",
  requireRoles("teacher", "admin", "super-admin"),
  validateRequest({ body: createSectionSchema }),
  ctrl.createSection
);

router
  .route("/sections/:id")
  .get(ctrl.getSection)
  .patch(requireRoles("teacher", "admin", "super-admin"), ctrl.updateSection)
  .delete(requireRoles("teacher", "admin", "super-admin"), ctrl.deleteSection);

router.post(
  "/sections/:sectionId/lessons",
  requireRoles("teacher", "admin", "super-admin"),
  validateRequest({ body: createLessonSchema }),
  ctrl.addLesson
);

router
  .route("/sections/:sectionId/lessons/:lessonId")
  .patch(requireRoles("teacher", "admin", "super-admin"), ctrl.updateLesson)
  .delete(requireRoles("teacher", "admin", "super-admin"), ctrl.deleteLesson);

export default router;
