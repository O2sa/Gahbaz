import { Router } from "express";
import * as ctrl from "./admins.controller.js";
import { requireRoles } from "../../core/middleware/rbac.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { createAdminSchema, updateAdminSchema } from "./admins.validator.js";
import { paginationQuerySchema } from "../../core/utils/pagination.utils.js";

const router = Router();

// Protect all admin endpoints for admin and super-admin
router.use(requireRoles("admin", "super-admin"));

router
  .route("/")
  .get(validateRequest({ query: paginationQuerySchema }), ctrl.getAllAdmins)
  .post(validateRequest({ body: createAdminSchema }), ctrl.createAdmin);

router
  .route("/:id")
  .get(ctrl.getAdmin)
  .patch(validateRequest({ body: updateAdminSchema }), ctrl.updateAdmin)
  .delete(ctrl.deleteAdmin);

export default router;
