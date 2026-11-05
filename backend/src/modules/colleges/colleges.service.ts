import College, { ICollege } from "../../models/College.js";
import Major from "../../models/Major.js";
import Subject from "../../models/Subject.js";
import SemesterTemplate from "../../models/SemesterTemplate.js";
import { NotFoundError } from "../../core/errors/customErrors.js";
import { paginateQuery, parsePagination } from "../../core/utils/pagination.utils.js";
import { CreateCollegeInput, UpdateCollegeInput } from "./colleges.validator.js";

export const createCollegeService = async (data: CreateCollegeInput, universityId?: string) => {
  return College.create({ ...data, university: universityId });
};

export const getCollegesService = async (universityId?: string, query: Record<string, any> = {}) => {
  const { page, limit } = parsePagination(query);
  const filter: Record<string, any> = universityId ? { university: universityId } : {};
  if (query.search) {
    filter.name = { $regex: query.search as string, $options: "i" };
  }
  return paginateQuery<ICollege>(College, filter, { page, limit });
};

export const getCollegeByIdService = async (id: string, universityId?: string) => {
  const query = universityId ? { _id: id, university: universityId } : { _id: id };
  const college = await College.findOne(query).populate("majors");
  if (!college) throw new NotFoundError("College not found");
  return college;
};

export const updateCollegeService = async (
  id: string,
  data: UpdateCollegeInput,
  universityId?: string
) => {
  const query = universityId ? { _id: id, university: universityId } : { _id: id };
  const college = await College.findOneAndUpdate(
    query,
    data,
    { new: true, runValidators: true }
  );
  if (!college) throw new NotFoundError("College not found");
  return college;
};

export const deleteCollegeService = async (id: string, universityId?: string) => {
  const query = universityId ? { _id: id, university: universityId } : { _id: id };
  const college = await College.findOneAndDelete(query);
  if (!college) throw new NotFoundError("College not found");

  const majors = await Major.find({ college: college._id });
  for (const m of majors) {
    await SemesterTemplate.deleteMany({ major: m._id });
  }
  await Major.deleteMany({ college: college._id });
  await Subject.deleteMany({ college: college._id });
  return college;
};
