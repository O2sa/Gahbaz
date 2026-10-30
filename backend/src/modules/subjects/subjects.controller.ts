import { Request, Response } from "express";
import * as svc from "./subjects.service.js";
import {
  sendPaginated,
  sendSuccess,
  sendCreated,
  sendNoContent,
} from "../../core/utils/response.utils.js";

export const getSubjects = async (req: Request, res: Response): Promise<void> => {
  const collegeId = (req.query.college || req.query.collage) as string;
  const filter: Record<string, any> = collegeId ? { college: collegeId } : {};
  if (req.query.search) {
    const searchRegex = { $regex: req.query.search as string, $options: "i" };
    filter.$or = [{ name: searchRegex }, { code: searchRegex }];
  }
  const { data, meta } = await svc.getSubjectsService(filter, req.query);
  sendPaginated(res, data, meta);
};

export const getCollageSubjects = async (req: Request, res: Response): Promise<void> => {
  const { data, meta } = await svc.getCollageSubjectsService(req.params.id, req.query);
  sendPaginated(res, data, meta);
};

export const getSubject = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin" ? null : req.user?.universityId || null;
  const data = await svc.getSubjectByIdService(req.params.id, universityId);
  sendSuccess(res, data);
};

export const createSubject = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin"
      ? req.body.university
      : req.user?.universityId;
  const data = await svc.createSubjectService(req.body, universityId);
  sendCreated(res, data);
};

export const updateSubject = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin" ? null : req.user?.universityId || null;
  const data = await svc.updateSubjectService(req.params.id, req.body, universityId);
  sendSuccess(res, data);
};

export const deleteSubject = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin" ? null : req.user?.universityId || null;
  await svc.deleteSubjectService(req.params.id, universityId);
  sendNoContent(res);
};
