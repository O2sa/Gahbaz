import mongoose, { Types } from "mongoose";
import Major, { IMajor } from "../../models/Major.js";
import College from "../../models/College.js";
import SemesterTemplate from "../../models/SemesterTemplate.js";
import { NotFoundError } from "../../core/errors/customErrors.js";
import { paginateQuery, parsePagination } from "../../core/utils/pagination.utils.js";
import { CreateMajorInput, UpdateMajorInput } from "./majors.validator.js";

export const createMajorService = async (data: CreateMajorInput, universityId?: string) => {
  const collegeId = data.college || (data as any).collage;
  const college = await College.findById(collegeId);
  const effectiveUnivId = universityId || college?.university;

  const newMajor = await Major.create({ ...data, university: effectiveUnivId });
  if (college) {
    const templatePromises = [];
    for (let s = 0; s < college.numberOfSemesters; s++) {
      templatePromises.push(
        SemesterTemplate.create({
          name: `الفصل ${s + 1}, ${newMajor.name}`,
          major: newMajor._id,
          index: s,
        })
      );
    }
    const createdTemplates = await Promise.all(templatePromises);
    newMajor.semesterTemplates = createdTemplates.map((t) => t._id as Types.ObjectId);
    await newMajor.save();
  }
  return newMajor;
};

export const getMajorsService = async (
  filter: Record<string, any> = {},
  query: Record<string, any> = {}
) => {
  const { page, limit } = parsePagination(query);
  return paginateQuery<IMajor>(Major, filter, {
    page,
    limit,
    populate: ["semesterTemplates", "college"],
  });
};

export const getMajorByIdService = async (id: string, universityId?: string | null) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError("Major not found");
  }
  const major = await Major.findById(id).populate(["semesterTemplates", "college"]);
  if (!major) throw new NotFoundError("Major not found");
  if (universityId) {
    const college: any = major.college;
    const majorUniv = major.university?.toString() || (college && (college.university?._id || college.university)?.toString());
    if (majorUniv && majorUniv !== universityId.toString()) {
      throw new NotFoundError("Major not found");
    }
  }
  return major;
};

export const updateMajorService = async (
  id: string,
  data: UpdateMajorInput,
  universityId?: string | null
) => {
  if (universityId) {
    await getMajorByIdService(id, universityId);
  }
  const major = await Major.findByIdAndUpdate(id, data, { new: true });
  if (!major) throw new NotFoundError("Major not found");
  return major;
};

export const deleteMajorService = async (id: string, universityId?: string | null) => {
  if (universityId) {
    await getMajorByIdService(id, universityId);
  }
  const major = await Major.findByIdAndDelete(id);
  if (!major) throw new NotFoundError("Major not found");
  await SemesterTemplate.deleteMany({ major: major._id });
  return major;
};
