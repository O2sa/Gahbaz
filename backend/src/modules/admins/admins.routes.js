import { Router } from "express";
import * as ctrl from "./admins.controller.js";
import { requireRoles, enforceDemoReadOnly } from "../../core/middleware/rbac.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { createAdminSchema, updateAdminSchema } from "./admins.validator.js";

const router = Router();

router
  .route("/")
  .get(requireRoles("super-admin"), ctrl.getAllAdmins)
  .post(
    requireRoles("super-admin"),
    enforceDemoReadOnly,
    validateRequest({ body: createAdminSchema }),
    ctrl.createAdmin
  );

router
  .route("/:id")
  .get(requireRoles("super-admin"), ctrl.getAdmin)
  .patch(
    requireRoles("super-admin"),
    enforceDemoReadOnly,
    validateRequest({ body: updateAdminSchema }),
    ctrl.updateAdmin
  )
  .delete(requireRoles("super-admin"), enforceDemoReadOnly, ctrl.deleteAdmin);

export default router;
