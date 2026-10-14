import Subject from "../../models/Subject.js";
import Major from "../../models/Major.js";
import { NotFoundError } from "../../core/errors/customErrors.js";
import { paginateQuery, parsePagination } from "../../core/utils/pagination.utils.js";

export const createSubjectService = async (data, universityId) => {
  return Subject.create({ ...data, university: universityId });
};

export const getSubjectsService = async (filter = {}, query = {}) => {
  const { page, limit } = parsePagination(query);
  return paginateQuery(Subject, filter, { page, limit, populate: "teachers" });
};

export const getCollageSubjectsService = async (id, query = {}) => {
  const major = await Major.findById(id);
  const collegeId = major?.college || id;
  return getSubjectsService({ college: collegeId }, query);
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
