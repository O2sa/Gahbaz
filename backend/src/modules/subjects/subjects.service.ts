import Subject, { ISubject } from "../../models/Subject.js";
import Major from "../../models/Major.js";
import { NotFoundError } from "../../core/errors/customErrors.js";
import { paginateQuery, parsePagination } from "../../core/utils/pagination.utils.js";
import { CreateSubjectInput, UpdateSubjectInput } from "./subjects.validator.js";

export const createSubjectService = async (data: CreateSubjectInput, universityId?: string) => {
  return Subject.create({ ...data, university: universityId });
};

export const getSubjectsService = async (
  filter: Record<string, any> = {},
  query: Record<string, any> = {}
) => {
  const { page, limit } = parsePagination(query);
  return paginateQuery<ISubject>(Subject, filter, {
    page,
    limit,
    populate: ["teachers", "college"],
  });
};

export const getCollageSubjectsService = async (id: string, query: Record<string, any> = {}) => {
  const major = await Major.findById(id);
  const collegeId = (major as any)?.college || id;
  return getSubjectsService({ college: collegeId }, query);
};

export const getSubjectByIdService = async (id: string, universityId: string | null = null) => {
  let subject: any;
  if (universityId) {
    subject = await Subject.findOne({ _id: id, university: universityId }).populate("teachers");
  } else {
    subject = await Subject.findById(id).populate("teachers");
  }
  if (!subject) throw new NotFoundError("Subject not found");
  return subject;
};

export const updateSubjectService = async (
  id: string,
  data: UpdateSubjectInput,
  universityId: string | null = null
) => {
  const query = universityId ? { _id: id, university: universityId } : { _id: id };
  const subject = await Subject.findOneAndUpdate(query, data, { new: true });
  if (!subject) throw new NotFoundError("Subject not found");
  return subject;
};

export const deleteSubjectService = async (id: string, universityId: string | null = null) => {
  const query = universityId ? { _id: id, university: universityId } : { _id: id };
  const subject = await Subject.findOneAndDelete(query);
  if (!subject) throw new NotFoundError("Subject not found");
  return subject;
};
