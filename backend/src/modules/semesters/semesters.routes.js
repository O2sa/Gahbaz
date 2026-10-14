import { Router } from "express";
import * as ctrl from "./semesters.controller.js";
import { requireRoles } from "../../core/middleware/rbac.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import {
  startSemesterSchema,
  createSemesterTemplateSchema,
  updateSemesterTemplateSchema,
} from "./semesters.validator.js";
import { paginationQuerySchema } from "../../core/utils/pagination.utils.js";

const router = Router();

// ======================== SEMESTER TEMPLATES ========================
router
  .route("/templates")
  .get(validateRequest({ query: paginationQuerySchema }), ctrl.getSemesterTemplates)
  .post(
    requireRoles("admin", "super-admin"),
    validateRequest({ body: createSemesterTemplateSchema }),
    ctrl.createSemesterTemplate
  );

router
  .route("/templates/:id")
  .get(ctrl.getSemesterTemplate)
  .patch(
    requireRoles("admin", "super-admin"),
    validateRequest({ body: updateSemesterTemplateSchema }),
    ctrl.updateSemesterTemplate
  )
  .delete(requireRoles("admin", "super-admin"), ctrl.deleteSemesterTemplate);

// Client alias for SemesterTemplateDetails.jsx
router.get("/semester-template/:id", ctrl.getSemesterTemplate);

// ======================== SEMESTERS ========================
router
  .route("/")
  .get(validateRequest({ query: paginationQuerySchema }), ctrl.getAllSemesters)
  .post(
    requireRoles("admin", "super-admin"),
    validateRequest({ body: startSemesterSchema }),
    ctrl.startSemester
  );

router.post(
  "/start",
  requireRoles("admin", "super-admin"),
  validateRequest({ body: startSemesterSchema }),
  ctrl.startSemester
);

router.post(
  "/start-semester",
  requireRoles("admin", "super-admin"),
  validateRequest({ body: startSemesterSchema }),
  ctrl.startSemester
);

router
  .route("/:id")
  .get(ctrl.getSemester)
  .patch(requireRoles("admin", "super-admin"), ctrl.updateSemester)
  .delete(requireRoles("admin", "super-admin"), ctrl.deleteSemester);

router.patch(
  "/:id/end",
  requireRoles("admin", "super-admin"),
  ctrl.endSemester
);

router.patch(
  "/:id/end-semester",
  requireRoles("admin", "super-admin"),
  ctrl.endSemester
);

export default router;
