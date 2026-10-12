import { Router } from "express";
import * as ctrl from "./colleges.controller.js";
import { requireRoles } from "../../core/middleware/rbac.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { createCollegeSchema, updateCollegeSchema } from "./colleges.validator.js";

const router = Router();

router
  .route("/")
  .get(ctrl.getColleges)
  .post(
    requireRoles("admin", "super-admin"),
    validateRequest({ body: createCollegeSchema }),
    ctrl.createCollege
  );

router
  .route("/:id")
  .get(ctrl.getCollege)
  .patch(
    requireRoles("admin", "super-admin"),
    validateRequest({ body: updateCollegeSchema }),
    ctrl.updateCollege
  )
  .delete(requireRoles("admin", "super-admin"), ctrl.deleteCollege);

export default router;
