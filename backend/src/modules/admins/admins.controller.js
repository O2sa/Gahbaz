import * as svc from "./admins.service.js";
import { sendPaginated, sendSuccess, sendCreated, sendNoContent } from "../../core/utils/response.utils.js";

export const getAllAdmins = async (req, res) => {
  const { data, meta } = await svc.getAdminsService(req.user.universityId, req.query);
  sendPaginated(res, data, meta);
};

export const getAdmin = async (req, res) => {
  const data = await svc.getAdminByIdService(req.params.id, req.user.universityId);
  sendSuccess(res, data);
};

export const createAdmin = async (req, res) => {
  const { admin, tempPassword } = await svc.createAdminService(req.body, req.user.universityId);
  return res.status(201).json({
    success: true,
    data: admin,
    tempPassword,
  });
};

export const updateAdmin = async (req, res) => {
  const data = await svc.updateAdminService(req.params.id, req.body, req.user.universityId);
  sendSuccess(res, data);
};

export const deleteAdmin = async (req, res) => {
  await svc.deleteAdminService(req.params.id, req.user.universityId);
  sendNoContent(res);
};
