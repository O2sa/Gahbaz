import { Router } from "express";
import * as ctrl from "./semesters.controller.js";
import { requireRoles } from "../../core/middleware/rbac.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import {
  createSemesterTemplateSchema,
  updateSemesterTemplateSchema,
} from "./semesters.validator.js";
import { paginationQuerySchema } from "../../core/utils/pagination.utils.js";

const router = Router();

router
  .route("/")
  .get(validateRequest({ query: paginationQuerySchema }), ctrl.getSemesterTemplates)
  .post(
    requireRoles("admin", "super-admin"),
    validateRequest({ body: createSemesterTemplateSchema }),
    ctrl.createSemesterTemplate
  );

router
  .route("/:id")
  .get(ctrl.getSemesterTemplatesByMajorOrId)
  .post(
    requireRoles("admin", "super-admin"),
    validateRequest({ body: createSemesterTemplateSchema }),
    ctrl.createSemesterTemplate
  )
  .patch(
    requireRoles("admin", "super-admin"),
    validateRequest({ body: updateSemesterTemplateSchema }),
    ctrl.updateSemesterTemplate
  )
  .delete(requireRoles("admin", "super-admin"), ctrl.deleteSemesterTemplate);

export default router;
