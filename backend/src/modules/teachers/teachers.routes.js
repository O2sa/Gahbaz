import { Router } from "express";
import * as ctrl from "./teachers.controller.js";
import { requireRoles, enforceDemoReadOnly } from "../../core/middleware/rbac.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { createTeacherSchema, updateTeacherSchema } from "./teachers.validator.js";

const router = Router();

router
  .route("/")
  .get(ctrl.getAllTeachers)
  .post(
    requireRoles("admin", "super-admin"),
    enforceDemoReadOnly,
    validateRequest({ body: createTeacherSchema }),
    ctrl.createTeacher
  );

router
  .route("/:id")
  .get(ctrl.getTeacher)
  .patch(
    requireRoles("admin", "super-admin"),
    enforceDemoReadOnly,
    validateRequest({ body: updateTeacherSchema }),
    ctrl.updateTeacher
  )
  .delete(requireRoles("admin", "super-admin"), enforceDemoReadOnly, ctrl.deleteTeacher);

export default router;
