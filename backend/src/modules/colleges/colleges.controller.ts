import { Request, Response } from "express";
import * as svc from "./colleges.service.js";
import {
  sendPaginated,
  sendSuccess,
  sendCreated,
  sendNoContent,
} from "../../core/utils/response.utils.js";

export const getColleges = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin"
      ? (req.query.university as string) || req.user?.universityId
      : req.user?.universityId;
  const { data, meta } = await svc.getCollegesService(universityId, req.query);
  sendPaginated(res, data, meta);
};

export const getCollege = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin"
      ? (req.query.university as string) || req.user?.universityId
      : req.user?.universityId;
  const data = await svc.getCollegeByIdService(req.params.id as string, universityId);
  sendSuccess(res, data);
};

export const createCollege = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin"
      ? (req.user?.universityId || req.body.university)
      : req.user?.universityId;
  const data = await svc.createCollegeService(req.body, universityId);
  sendCreated(res, data);
};

export const updateCollege = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin"
      ? (req.query.university as string) || req.user?.universityId
      : req.user?.universityId;
  const data = await svc.updateCollegeService(
    req.params.id as string,
    req.body,
    universityId
  );
  sendSuccess(res, data);
};

export const deleteCollege = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin"
      ? (req.query.university as string) || req.user?.universityId
      : req.user?.universityId;
  await svc.deleteCollegeService(req.params.id as string, universityId);
  sendNoContent(res);
};
