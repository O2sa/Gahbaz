import * as svc from "./subjects.service.js";
import { sendPaginated, sendSuccess, sendCreated, sendNoContent } from "../../core/utils/response.utils.js";

export const getSubjects = async (req, res) => {
  const collegeId = req.query.college || req.query.collage;
  const filter = collegeId ? { college: collegeId } : {};
  const { data, meta } = await svc.getSubjectsService(filter, req.query);
  sendPaginated(res, data, meta);
};

export const getCollageSubjects = async (req, res) => {
  const { data, meta } = await svc.getCollageSubjectsService(req.params.id, req.query);
  sendPaginated(res, data, meta);
};

export const getSubject = async (req, res) => {
  const universityId = req.user?.role === "super-admin" ? null : req.user?.universityId;
  const data = await svc.getSubjectByIdService(req.params.id, universityId);
  sendSuccess(res, data);
};

export const createSubject = async (req, res) => {
  const universityId = req.user?.role === "super-admin" ? req.body.university : req.user?.universityId;
  const data = await svc.createSubjectService(req.body, universityId);
  sendCreated(res, data);
};

export const updateSubject = async (req, res) => {
  const universityId = req.user?.role === "super-admin" ? null : req.user?.universityId;
  const data = await svc.updateSubjectService(req.params.id, req.body, universityId);
  sendSuccess(res, data);
};

export const deleteSubject = async (req, res) => {
  const universityId = req.user?.role === "super-admin" ? null : req.user?.universityId;
  await svc.deleteSubjectService(req.params.id, universityId);
  sendNoContent(res);
};
