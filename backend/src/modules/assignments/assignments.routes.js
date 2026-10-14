import { Router } from "express";
import * as ctrl from "./assignments.controller.js";
import { requireRoles } from "../../core/middleware/rbac.middleware.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import {
  createAssignmentSchema,
  updateAssignmentSchema,
  submitAssignmentSchema,
  gradeSubmissionSchema,
} from "./assignments.validator.js";
import { paginationQuerySchema } from "../../core/utils/pagination.utils.js";

const router = Router({ mergeParams: true });

// Submissions grading route
router.patch(
  "/submissions/:submissionId/grade",
  requireRoles("teacher", "admin", "super-admin"),
  validateRequest({ body: gradeSubmissionSchema }),
  ctrl.gradeSubmission
);

// Course assignments route: /assignments/course/:courseId or mounted under courses
router
  .route("/course/:courseId")
  .get(validateRequest({ query: paginationQuerySchema }), ctrl.getCourseAssignments)
  .post(
    requireRoles("teacher", "admin", "super-admin"),
    validateRequest({ body: createAssignmentSchema }),
    ctrl.createAssignment
  );

// Direct root route if mounted under /courses/:courseId/assignments
router
  .route("/")
  .get(validateRequest({ query: paginationQuerySchema }), ctrl.getCourseAssignments)
  .post(
    requireRoles("teacher", "admin", "super-admin"),
    validateRequest({ body: createAssignmentSchema }),
    ctrl.createAssignment
  );

// Individual assignment routes
router
  .route("/:id")
  .get(ctrl.getAssignment)
  .patch(
    requireRoles("teacher", "admin", "super-admin"),
    validateRequest({ body: updateAssignmentSchema }),
    ctrl.updateAssignment
  )
  .delete(requireRoles("teacher", "admin", "super-admin"), ctrl.deleteAssignment);

// Submissions
router
  .route("/:id/submissions")
  .get(requireRoles("teacher", "admin", "super-admin"), ctrl.getAssignmentSubmissions)
  .post(
    requireRoles("student"),
    validateRequest({ body: submitAssignmentSchema }),
    ctrl.submitAssignment
  );

router.get("/:id/my-submission", requireRoles("student"), ctrl.getMySubmission);

export default router;
