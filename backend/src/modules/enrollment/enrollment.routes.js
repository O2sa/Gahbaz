import { Router } from "express";
import * as ctrl from "./enrollment.controller.js";
import { requireRoles } from "../../core/middleware/rbac.middleware.js";

const router = Router();

router.get(
  "/available-courses",
  requireRoles("student", "admin", "super-admin"),
  ctrl.getAvailableCourses
);

router.get(
  "/my-courses",
  requireRoles("student", "admin", "super-admin"),
  ctrl.getMyEnrolledCourses
);

router.post(
  "/register",
  requireRoles("student", "admin", "super-admin"),
  ctrl.registerCourse
);

router.post(
  "/drop",
  requireRoles("student", "admin", "super-admin"),
  ctrl.dropCourse
);

export default router;
