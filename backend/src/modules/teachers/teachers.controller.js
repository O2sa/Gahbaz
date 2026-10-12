import * as svc from "./teachers.service.js";
import { sendPaginated, sendSuccess, sendCreated, sendNoContent } from "../../core/utils/response.utils.js";

export const getAllTeachers = async (req, res) => {
  const { data, meta } = await svc.getTeachersService(req.user.universityId, req.query);
  sendPaginated(res, data, meta);
};

export const getTeacher = async (req, res) => {
  const data = await svc.getTeacherByIdService(req.params.id, req.user.universityId);
  sendSuccess(res, data);
};

export const createTeacher = async (req, res) => {
  const data = await svc.createTeacherService(req.body, req.user.universityId);
  sendCreated(res, data);
};

export const updateTeacher = async (req, res) => {
  const data = await svc.updateTeacherService(req.params.id, req.body, req.user.universityId);
  sendSuccess(res, data);
};

export const deleteTeacher = async (req, res) => {
  await svc.deleteTeacherService(req.params.id, req.user.universityId);
  sendNoContent(res);
};
