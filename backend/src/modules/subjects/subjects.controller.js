import * as svc from "./subjects.service.js";
import { sendSuccess, sendCreated, sendNoContent } from "../../core/utils/response.utils.js";

export const getSubjects = async (req, res) => {
  const collegeId = req.query.college || req.query.collage;
  const filter = collegeId ? { college: collegeId } : {};
  const data = await svc.getSubjectsService(filter);
  sendSuccess(res, data);
};

export const getSubject = async (req, res) => {
  const data = await svc.getSubjectByIdService(req.params.id);
  sendSuccess(res, data);
};

export const createSubject = async (req, res) => {
  const data = await svc.createSubjectService(req.body, req.user.universityId);
  sendCreated(res, data);
};

export const updateSubject = async (req, res) => {
  const data = await svc.updateSubjectService(req.params.id, req.body);
  sendSuccess(res, data);
};

export const deleteSubject = async (req, res) => {
  await svc.deleteSubjectService(req.params.id);
  sendNoContent(res);
};
