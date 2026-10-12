import { Router } from "express";
import * as ctrl from "./students.controller.js";
import { requireRoles } from "../../core/middleware/rbac.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { createStudentSchema, updateStudentSchema } from "./students.validator.js";
import { paginationQuerySchema } from "../../core/utils/pagination.utils.js";

const router = Router();

router
  .route("/")
  .get(validateRequest({ query: paginationQuerySchema }), ctrl.getAllStudents)
  .post(
    requireRoles("admin", "super-admin"),
    validateRequest({ body: createStudentSchema }),
    ctrl.createStudent
  );

router
  .route("/:id")
  .get(ctrl.getStudent)
  .patch(
    requireRoles("admin", "super-admin"),
    validateRequest({ body: updateStudentSchema }),
    ctrl.updateStudent
  )
  .delete(requireRoles("admin", "super-admin"), ctrl.deleteStudent);

export default router;
