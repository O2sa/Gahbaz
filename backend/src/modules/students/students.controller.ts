import { Request, Response } from "express";
import * as svc from "./students.service.js";
import {
  sendPaginated,
  sendSuccess,
  sendNoContent,
} from "../../core/utils/response.utils.js";

export const getAllStudents = async (req: Request, res: Response): Promise<void> => {
  const { data, meta } = await svc.getStudentsService(req.user!.universityId, req.query);
  sendPaginated(res, data, meta);
};

export const getStudent = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.getStudentByIdService(req.params.id, req.user!.universityId);
  sendSuccess(res, data);
};

export const createStudent = async (req: Request, res: Response) => {
  const { student, tempPassword } = await svc.createStudentService(
    req.body,
    req.user!.universityId
  );
  return res.status(201).json({
    success: true,
    data: student,
    tempPassword,
  });
};

export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.updateStudentService(
    req.params.id,
    req.body,
    req.user!.universityId
  );
  sendSuccess(res, data);
};

export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  await svc.deleteStudentService(req.params.id, req.user!.universityId);
  sendNoContent(res);
};
