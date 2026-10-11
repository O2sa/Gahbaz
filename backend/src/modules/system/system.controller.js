import * as svc from "./system.service.js";

export const getAdminDashData = async (req, res) => {
  const data = await svc.getAdminDashboardStatsService(req.user.universityId);
  res.status(200).json(data);
};

export const search = async (req, res) => {
  const data = await svc.searchEntitiesService(req.query.q, req.user);
  res.status(200).json(data);
};
