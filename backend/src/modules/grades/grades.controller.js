import * as svc from "./grades.service.js";
import { sendSuccess } from "../../core/utils/response.utils.js";

export const getGrade = async (req, res) => {
  const data = await svc.getGradeByIdService(req.params.gradeId || req.params.id);
  sendSuccess(res, data);
};

export const getCourseGrades = async (req, res) => {
  const data = await svc.getGradesByCourseService(req.params.courseId, req.query);
  sendSuccess(res, data);
};

export const getStudentGrades = async (req, res) => {
  const studentId = req.params.studentId || req.user.userId || req.user.id;
  const data = await svc.getStudentGradesService(studentId);
  sendSuccess(res, data);
};

export const updateGrade = async (req, res) => {
  const data = await svc.updateGradeService(req.params.gradeId || req.params.id, req.body.grade || req.body);
  sendSuccess(res, data);
};
