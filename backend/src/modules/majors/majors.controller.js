import * as svc from "./majors.service.js";
import { sendSuccess, sendCreated, sendNoContent } from "../../core/utils/response.utils.js";

export const getMajors = async (req, res) => {
  const collegeId = req.query.college || req.query.collage;
  const filter = collegeId ? { college: collegeId } : {};
  const data = await svc.getMajorsService(filter);
  sendSuccess(res, data);
};

export const getMajor = async (req, res) => {
  const data = await svc.getMajorByIdService(req.params.id);
  sendSuccess(res, data);
};

export const createMajor = async (req, res) => {
  const data = await svc.createMajorService(req.body, req.user.universityId);
  sendCreated(res, data);
};

export const updateMajor = async (req, res) => {
  const data = await svc.updateMajorService(req.params.id, req.body);
  sendSuccess(res, data);
};

export const deleteMajor = async (req, res) => {
  await svc.deleteMajorService(req.params.id);
  sendNoContent(res);
};
