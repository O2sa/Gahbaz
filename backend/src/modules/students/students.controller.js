import * as svc from "./students.service.js";
import { sendSuccess, sendCreated, sendNoContent } from "../../core/utils/response.utils.js";

export const getAllStudents = async (req, res) => {
  const data = await svc.getStudentsService(req.user.universityId);
  sendSuccess(res, data);
};

export const getStudent = async (req, res) => {
  const data = await svc.getStudentByIdService(req.params.id, req.user.universityId);
  sendSuccess(res, data);
};

export const createStudent = async (req, res) => {
  const data = await svc.createStudentService(req.body, req.user.universityId);
  sendCreated(res, data);
};

export const updateStudent = async (req, res) => {
  const data = await svc.updateStudentService(req.params.id, req.body, req.user.universityId);
  sendSuccess(res, data);
};

export const deleteStudent = async (req, res) => {
  await svc.deleteStudentService(req.params.id, req.user.universityId);
  sendNoContent(res);
};
