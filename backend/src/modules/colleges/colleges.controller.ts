import { Request, Response } from "express";
import * as svc from "./colleges.service.js";
import {
  sendPaginated,
  sendSuccess,
  sendCreated,
  sendNoContent,
} from "../../core/utils/response.utils.js";

export const getColleges = async (req: Request, res: Response): Promise<void> => {
  const { data, meta } = await svc.getCollegesService(req.user!.universityId, req.query);
  sendPaginated(res, data, meta);
};

export const getCollege = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.getCollegeByIdService(req.params.id, req.user!.universityId);
  sendSuccess(res, data);
};

export const createCollege = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.createCollegeService(req.body, req.user!.universityId);
  sendCreated(res, data);
};

export const updateCollege = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.updateCollegeService(
    req.params.id,
    req.body,
    req.user!.universityId
  );
  sendSuccess(res, data);
};

export const deleteCollege = async (req: Request, res: Response): Promise<void> => {
  await svc.deleteCollegeService(req.params.id, req.user!.universityId);
  sendNoContent(res);
};
