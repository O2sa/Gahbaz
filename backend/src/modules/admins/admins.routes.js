import { Router } from "express";
import * as ctrl from "./admins.controller.js";
import { requireRoles } from "../../core/middleware/rbac.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { createAdminSchema, updateAdminSchema } from "./admins.validator.js";

const router = Router();

// Protect all admin endpoints for super-admin in one place
router.use(requireRoles("super-admin"));

router
  .route("/")
  .get(ctrl.getAllAdmins)
  .post(validateRequest({ body: createAdminSchema }), ctrl.createAdmin);

router
  .route("/:id")
  .get(ctrl.getAdmin)
  .patch(validateRequest({ body: updateAdminSchema }), ctrl.updateAdmin)
  .delete(ctrl.deleteAdmin);

export default router;
