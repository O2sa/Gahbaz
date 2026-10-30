import { Request, Response } from "express";
import * as svc from "./system.service.js";
import { sendSuccess } from "../../core/utils/response.utils.js";

export const getAdminDashData = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.getAdminDashboardStatsService(req.user!.universityId);
  sendSuccess(res, data);
};

export const search = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.searchEntitiesService(req.query.q, req.user);
  sendSuccess(res, data);
};
