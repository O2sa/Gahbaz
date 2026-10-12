import Subject from "../../models/Subject.js";
import { NotFoundError } from "../../core/errors/customErrors.js";

export const createSubjectService = async (data, universityId) => {
  return Subject.create({ ...data, university: universityId });
};

export const getSubjectsService = async (filter = {}) => {
  return Subject.find(filter).populate("teachers");
};

export const getSubjectByIdService = async (id) => {
  const subject = await Subject.findById(id).populate("teachers");
  if (!subject) throw new NotFoundError("Subject not found");
  return subject;
};

export const updateSubjectService = async (id, data) => {
  const subject = await Subject.findByIdAndUpdate(id, data, { new: true });
  if (!subject) throw new NotFoundError("Subject not found");
  return subject;
};

export const deleteSubjectService = async (id) => {
  const subject = await Subject.findByIdAndDelete(id);
  if (!subject) throw new NotFoundError("Subject not found");
  return subject;
};
