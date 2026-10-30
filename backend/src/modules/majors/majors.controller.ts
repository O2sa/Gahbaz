import { Request, Response } from "express";
import * as svc from "./majors.service.js";
import {
  sendPaginated,
  sendSuccess,
  sendCreated,
  sendNoContent,
} from "../../core/utils/response.utils.js";

export const getMajors = async (req: Request, res: Response): Promise<void> => {
  const collegeId = (req.query.college || req.query.collage) as string;
  const filter: Record<string, any> = collegeId ? { college: collegeId } : {};
  if (req.query.search) {
    filter.name = { $regex: req.query.search as string, $options: "i" };
  }
  const { data, meta } = await svc.getMajorsService(filter, req.query);
  sendPaginated(res, data, meta);
};

export const getMajor = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.getMajorByIdService(req.params.id);
  sendSuccess(res, data);
};

export const createMajor = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.createMajorService(req.body, req.user!.universityId);
  sendCreated(res, data);
};

export const updateMajor = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.updateMajorService(req.params.id, req.body);
  sendSuccess(res, data);
};

export const deleteMajor = async (req: Request, res: Response): Promise<void> => {
  await svc.deleteMajorService(req.params.id);
  sendNoContent(res);
};
