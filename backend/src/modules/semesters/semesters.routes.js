import { Router } from "express";
import * as ctrl from "./semesters.controller.js";
import { requireRoles, enforceDemoReadOnly } from "../../core/middleware/rbac.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import {
  startSemesterSchema,
  createSemesterTemplateSchema,
  updateSemesterTemplateSchema,
} from "./semesters.validator.js";

const router = Router();

// ======================== SEMESTER TEMPLATES ========================
router
  .route("/templates")
  .get(ctrl.getSemesterTemplates)
  .post(
    requireRoles("admin", "super-admin"),
    enforceDemoReadOnly,
    validateRequest({ body: createSemesterTemplateSchema }),
    ctrl.createSemesterTemplate
  );

router
  .route("/templates/:id")
  .get(ctrl.getSemesterTemplate)
  .patch(
    requireRoles("admin", "super-admin"),
    enforceDemoReadOnly,
    validateRequest({ body: updateSemesterTemplateSchema }),
    ctrl.updateSemesterTemplate
  )
  .delete(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.deleteSemesterTemplate);

// ======================== SEMESTERS ========================
router
  .route("/")
  .get(ctrl.getAllSemesters)
  .post(
    requireRoles("admin", "super-admin"),
    enforceDemoReadOnly,
    validateRequest({ body: startSemesterSchema }),
    ctrl.startSemester
  );

router.post(
  "/start",
  requireRoles("admin", "super-admin"),
  enforceDemoReadOnly,
  validateRequest({ body: startSemesterSchema }),
  ctrl.startSemester
);

router.post(
  "/start-semester",
  requireRoles("admin", "super-admin"),
  enforceDemoReadOnly,
  validateRequest({ body: startSemesterSchema }),
  ctrl.startSemester
);

router
  .route("/:id")
  .get(ctrl.getSemester)
  .patch(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.updateSemester)
  .delete(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.deleteSemester);

router.patch(
  "/:id/end",
  requireRoles("admin", "super-admin"),
  enforceDemoReadOnly,
  ctrl.endSemester
);

router.patch(
  "/:id/end-semester",
  requireRoles("admin", "super-admin"),
  enforceDemoReadOnly,
  ctrl.endSemester
);

export default router;
