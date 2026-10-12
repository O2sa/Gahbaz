import { Router } from "express";
import * as ctrl from "./majors.controller.js";
import { requireRoles } from "../../core/middleware/rbac.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { createMajorSchema, updateMajorSchema } from "./majors.validator.js";
import { paginationQuerySchema } from "../../core/utils/pagination.utils.js";

const router = Router();

router
  .route("/")
  .get(validateRequest({ query: paginationQuerySchema }), ctrl.getMajors)
  .post(
    requireRoles("admin", "super-admin"),
    validateRequest({ body: createMajorSchema }),
    ctrl.createMajor
  );

router
  .route("/:id")
  .get(ctrl.getMajor)
  .patch(
    requireRoles("admin", "super-admin"),
    validateRequest({ body: updateMajorSchema }),
    ctrl.updateMajor
  )
  .delete(requireRoles("admin", "super-admin"), ctrl.deleteMajor);

export default router;
