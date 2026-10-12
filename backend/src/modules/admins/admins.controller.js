import * as svc from "./admins.service.js";
import { sendSuccess, sendCreated, sendNoContent } from "../../core/utils/response.utils.js";

export const getAllAdmins = async (req, res) => {
  const data = await svc.getAdminsService(req.user.universityId);
  sendSuccess(res, data);
};

export const getAdmin = async (req, res) => {
  const data = await svc.getAdminByIdService(req.params.id, req.user.universityId);
  sendSuccess(res, data);
};

export const createAdmin = async (req, res) => {
  const data = await svc.createAdminService(req.body, req.user.universityId);
  sendCreated(res, data);
};

export const updateAdmin = async (req, res) => {
  const data = await svc.updateAdminService(req.params.id, req.body, req.user.universityId);
  sendSuccess(res, data);
};

export const deleteAdmin = async (req, res) => {
  await svc.deleteAdminService(req.params.id, req.user.universityId);
  sendNoContent(res);
};
