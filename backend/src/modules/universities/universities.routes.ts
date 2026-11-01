import { Router } from "express";
import * as ctrl from "./universities.controller.js";
import { authenticateUser } from "../../core/middleware/auth.middleware.js";
import { requireRoles } from "../../core/middleware/rbac.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import {
  createUniversitySchema,
  updateUniversitySchema,
  universityQuerySchema,
} from "./universities.validator.js";

const router = Router();

// Strictly restricted to super-admin
router.use(authenticateUser, requireRoles("super-admin"));

router
  .route("/")
  .get(validateRequest({ query: universityQuerySchema }), ctrl.getUniversities)
  .post(validateRequest({ body: createUniversitySchema }), ctrl.provisionUniversity);

router
  .route("/:id")
  .get(ctrl.getUniversity)
  .patch(validateRequest({ body: updateUniversitySchema }), ctrl.updateUniversity);

export default router;
