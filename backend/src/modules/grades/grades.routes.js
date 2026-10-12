import { Router } from "express";
import * as ctrl from "./grades.controller.js";
import { requireRoles } from "../../core/middleware/rbac.middleware.js";

const router = Router();

router.get("/course/:courseId", ctrl.getCourseGrades);
router.get("/courses/:courseId", ctrl.getCourseGrades);
router.get("/student/:studentId?", ctrl.getStudentGrades);
router.get("/students/:studentId?", ctrl.getStudentGrades);

router
  .route("/:gradeId")
  .get(ctrl.getGrade)
  .patch(requireRoles("teacher", "admin", "super-admin"), ctrl.updateGrade);

export default router;
