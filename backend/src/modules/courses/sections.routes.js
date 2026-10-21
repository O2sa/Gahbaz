import { Router } from "express";
import * as ctrl from "./courses.controller.js";
import { requireRoles } from "../../core/middleware/rbac.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { createSectionSchema, createLessonSchema } from "./courses.validator.js";

const router = Router();

// ======================== SECTIONS ========================
router.post(
  "/",
  requireRoles("teacher", "admin", "super-admin"),
  validateRequest({ body: createSectionSchema }),
  ctrl.createSection
);

router
  .route("/:id")
  .get(ctrl.getSection)
  .patch(requireRoles("teacher", "admin", "super-admin"), ctrl.updateSection)
  .delete(requireRoles("teacher", "admin", "super-admin"), ctrl.deleteSection);

// ======================== LESSONS ========================
router.post(
  "/:sectionId/lessons",
  requireRoles("teacher", "admin", "super-admin"),
  validateRequest({ body: createLessonSchema }),
  ctrl.addLesson
);

router
  .route("/:sectionId/lessons/:lessonId")
  .get(ctrl.getLesson)
  .patch(requireRoles("teacher", "admin", "super-admin"), ctrl.updateLesson)
  .delete(requireRoles("teacher", "admin", "super-admin"), ctrl.deleteLesson);

export default router;
