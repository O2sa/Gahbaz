import * as svc from "./assignments.service.js";
import { sendSuccess, sendCreated, sendPaginated, sendNoContent } from "../../core/utils/response.utils.js";

export const createAssignment = async (req, res) => {
  const teacherId = req.user.userId || req.user.id;
  const universityId = req.user.role === "super-admin" ? req.body.university : req.user.universityId;
  const data = await svc.createAssignmentService({
    courseId: req.params.courseId,
    data: req.body,
    teacherId,
    universityId,
  });
  sendCreated(res, data);
};

export const getCourseAssignments = async (req, res) => {
  const universityId = req.user.role === "super-admin" ? null : req.user.universityId;
  const { data, meta } = await svc.getCourseAssignmentsService(req.params.courseId, universityId, req.query);
  sendPaginated(res, data, meta);
};

export const getAssignment = async (req, res) => {
  const universityId = req.user.role === "super-admin" ? null : req.user.universityId;
  const data = await svc.getAssignmentByIdService(req.params.id, universityId);
  sendSuccess(res, data);
};

export const updateAssignment = async (req, res) => {
  const universityId = req.user.role === "super-admin" ? null : req.user.universityId;
  const data = await svc.updateAssignmentService(req.params.id, req.body, universityId);
  sendSuccess(res, data);
};

export const deleteAssignment = async (req, res) => {
  const universityId = req.user.role === "super-admin" ? null : req.user.universityId;
  await svc.deleteAssignmentService(req.params.id, universityId);
  sendNoContent(res);
};

export const submitAssignment = async (req, res) => {
  const studentId = req.user.userId || req.user.id;
  const universityId = req.user.role === "super-admin" ? null : req.user.universityId;
  const data = await svc.submitAssignmentService({
    assignmentId: req.params.id,
    studentId,
    universityId,
    data: req.body,
  });
  sendCreated(res, data);
};

export const getAssignmentSubmissions = async (req, res) => {
  const universityId = req.user.role === "super-admin" ? null : req.user.universityId;
  const data = await svc.getAssignmentSubmissionsService(req.params.id, universityId);
  sendSuccess(res, data);
};

export const getMySubmission = async (req, res) => {
  const studentId = req.user.userId || req.user.id;
  const data = await svc.getStudentSubmissionService(req.params.id, studentId);
  sendSuccess(res, data);
};

export const gradeSubmission = async (req, res) => {
  const teacherId = req.user.userId || req.user.id;
  const universityId = req.user.role === "super-admin" ? null : req.user.universityId;
  const data = await svc.gradeSubmissionService({
    submissionId: req.params.submissionId,
    grade: req.body.grade,
    feedback: req.body.feedback,
    teacherId,
    universityId,
  });
  sendSuccess(res, data);
};
