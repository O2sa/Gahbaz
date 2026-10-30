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
  return paginateQuery<ICollege>(College, { university: universityId }, { page, limit });
};

export const getCollegeByIdService = async (id: string, universityId?: string) => {
  const college = await College.findOne({ _id: id, university: universityId }).populate("majors");
  if (!college) throw new NotFoundError("College not found");
  return college;
};

export const updateCollegeService = async (
  id: string,
  data: UpdateCollegeInput,
  universityId?: string
) => {
  const college = await College.findOneAndUpdate(
    { _id: id, university: universityId },
    data,
    { new: true, runValidators: true }
  );
  if (!college) throw new NotFoundError("College not found");
  return college;
};

export const deleteCollegeService = async (id: string, universityId?: string) => {
  const college = await College.findOneAndDelete({ _id: id, university: universityId });
  if (!college) throw new NotFoundError("College not found");

  const majors = await Major.find({ college: college._id });
  for (const m of majors) {
    await SemesterTemplate.deleteMany({ major: m._id });
  }
  await Major.deleteMany({ college: college._id });
  await Subject.deleteMany({ college: college._id });
  return college;
};
