import { Request, Response } from "express";
import * as svc from "./semesters.service.js";
import {
  sendPaginated,
  sendSuccess,
  sendCreated,
  sendNoContent,
} from "../../core/utils/response.utils.js";

// Semester Templates
export const getSemesterTemplates = async (req: Request, res: Response): Promise<void> => {
  const majorId = (req.params.majorId || req.query.major) as string;
  const filter: Record<string, any> = majorId ? { major: majorId } : {};
  const { data, meta } = await svc.getSemesterTemplatesService(filter, req.query);
  sendPaginated(res, data, meta);
};

export const getSemesterTemplatesByMajorOrId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id || req.params.majorId;
  const result: any = await svc.getSemesterTemplatesByMajorOrIdService(id, req.query);
  if (result && Array.isArray(result.data)) {
    return sendPaginated(res, result.data, result.meta);
  }
  return sendSuccess(res, result);
};

export const getSemesterTemplate = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.getSemesterTemplateByIdService(req.params.id);
  sendSuccess(res, data);
};

export const createSemesterTemplate = async (req: Request, res: Response): Promise<void> => {
  const payload = { ...req.body };
  if (req.params.majorId && !payload.major) {
    payload.major = req.params.majorId;
  }
  const data = await svc.createSemesterTemplateService(payload);
  sendCreated(res, data);
};

export const updateSemesterTemplate = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.updateSemesterTemplateService(req.params.id, req.body);
  sendSuccess(res, data);
};

export const deleteSemesterTemplate = async (req: Request, res: Response): Promise<void> => {
  await svc.deleteSemesterTemplateService(req.params.id);
  sendNoContent(res);
};

// Semesters
export const getAllSemesters = async (req: Request, res: Response): Promise<void> => {
  const { data, meta } = await svc.getAllSemestersService(req.user!.universityId, req.query);
  sendPaginated(res, data, meta);
};

export const getSemester = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.getSemesterByIdService(req.params.id);
  sendSuccess(res, data);
};

export const updateSemester = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.updateSemesterService(req.params.id, req.body);
  sendSuccess(res, data);
};

export const deleteSemester = async (req: Request, res: Response): Promise<void> => {
  await svc.deleteSemesterService(req.params.id);
  sendNoContent(res);
};

export const startSemester = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.startSemesterService(req.body, req.user!.universityId);
  sendSuccess(res, data);
};

export const endSemester = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.endSemesterService(req.params.id);
  sendSuccess(res, data);
};
