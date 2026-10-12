import * as svc from "./semesters.service.js";
import { sendPaginated, sendSuccess, sendCreated, sendNoContent } from "../../core/utils/response.utils.js";

// Semester Templates
export const getSemesterTemplates = async (req, res) => {
  const filter = req.query.major ? { major: req.query.major } : {};
  const { data, meta } = await svc.getSemesterTemplatesService(filter, req.query);
  sendPaginated(res, data, meta);
};

export const getSemesterTemplate = async (req, res) => {
  const data = await svc.getSemesterTemplateByIdService(req.params.id);
  sendSuccess(res, data);
};

export const createSemesterTemplate = async (req, res) => {
  const data = await svc.createSemesterTemplateService(req.body);
  sendCreated(res, data);
};

export const updateSemesterTemplate = async (req, res) => {
  const data = await svc.updateSemesterTemplateService(req.params.id, req.body);
  sendSuccess(res, data);
};

export const deleteSemesterTemplate = async (req, res) => {
  await svc.deleteSemesterTemplateService(req.params.id);
  sendNoContent(res);
};

// Semesters
export const getAllSemesters = async (req, res) => {
  const { data, meta } = await svc.getAllSemestersService(req.user.universityId, req.query);
  sendPaginated(res, data, meta);
};

export const getSemester = async (req, res) => {
  const data = await svc.getSemesterByIdService(req.params.id);
  sendSuccess(res, data);
};

export const updateSemester = async (req, res) => {
  const data = await svc.updateSemesterService(req.params.id, req.body);
  sendSuccess(res, data);
};

export const deleteSemester = async (req, res) => {
  await svc.deleteSemesterService(req.params.id);
  sendNoContent(res);
};

export const startSemester = async (req, res) => {
  const data = await svc.startSemesterService(req.body, req.user.universityId);
  sendSuccess(res, data);
};

export const endSemester = async (req, res) => {
  const data = await svc.endSemesterService(req.params.id);
  sendSuccess(res, data);
};
