import { Router } from "express";
import * as ctrl from "./transcripts.controller.js";
import { requireRoles } from "../../core/middleware/rbac.middleware.js";

const router = Router();

router.get(
  "/my-transcript",
  requireRoles("student", "admin", "super-admin"),
  ctrl.getMyTranscript
);

router.get(
  "/student/:studentId",
  requireRoles("student", "teacher", "admin", "super-admin"),
  ctrl.getStudentTranscript
);

export default router;
