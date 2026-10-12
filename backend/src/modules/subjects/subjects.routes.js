import { Router } from "express";
import * as ctrl from "./subjects.controller.js";
import { requireRoles, enforceDemoReadOnly } from "../../core/middleware/rbac.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { createSubjectSchema, updateSubjectSchema } from "./subjects.validator.js";

const router = Router();

router
  .route("/")
  .get(ctrl.getSubjects)
  .post(
    requireRoles("admin", "super-admin"),
    enforceDemoReadOnly,
    validateRequest({ body: createSubjectSchema }),
    ctrl.createSubject
  );

router
  .route("/:id")
  .get(ctrl.getSubject)
  .patch(
    requireRoles("admin", "super-admin"),
    enforceDemoReadOnly,
    validateRequest({ body: updateSubjectSchema }),
    ctrl.updateSubject
  )
  .delete(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.deleteSubject);

export default router;
