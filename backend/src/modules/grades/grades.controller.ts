import { Request, Response } from "express";
import * as svc from "./grades.service.js";
import { sendSuccess } from "../../core/utils/response.utils.js";

export const getGrade = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.getGradeByIdService(req.params.gradeId || req.params.id, req.user);
  sendSuccess(res, data);
};

export const getCourseGrades = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.getGradesByCourseService(req.params.courseId, req.query);
  sendSuccess(res, data);
};

export const getStudentGrades = async (req: Request, res: Response): Promise<void> => {
  let studentId = req.params.studentId || req.user!.userId;
  if (req.user?.role === "student") {
    studentId = req.user.userId;
  }
  const data = await svc.getStudentGradesService(studentId);
  sendSuccess(res, data);
};

export const updateGrade = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.updateGradeService(
    req.params.gradeId || req.params.id,
    req.body.grade || req.body
  );
  sendSuccess(res, data);
};
