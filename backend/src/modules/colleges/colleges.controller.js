import * as svc from "./colleges.service.js";
import { sendSuccess, sendCreated, sendNoContent } from "../../core/utils/response.utils.js";

export const getColleges = async (req, res) => {
  const data = await svc.getCollegesService(req.user.universityId);
  sendSuccess(res, data);
};

export const getCollege = async (req, res) => {
  const data = await svc.getCollegeByIdService(req.params.id, req.user.universityId);
  sendSuccess(res, data);
};

export const createCollege = async (req, res) => {
  const data = await svc.createCollegeService(req.body, req.user.universityId);
  sendCreated(res, data);
};

export const updateCollege = async (req, res) => {
  const data = await svc.updateCollegeService(req.params.id, req.body, req.user.universityId);
  sendSuccess(res, data);
};

export const deleteCollege = async (req, res) => {
  await svc.deleteCollegeService(req.params.id, req.user.universityId);
  sendNoContent(res);
};
