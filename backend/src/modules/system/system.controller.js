import * as svc from "./system.service.js";
import { sendSuccess } from "../../core/utils/response.utils.js";

export const getAdminDashData = async (req, res) => {
  const data = await svc.getAdminDashboardStatsService(req.user.universityId);
  sendSuccess(res, data);
};

export const search = async (req, res) => {
  const data = await svc.searchEntitiesService(req.query.q, req.user);
  sendSuccess(res, data);
};
