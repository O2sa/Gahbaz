import mongoose from "mongoose";
import Major from "../../models/Major.js";
import College from "../../models/College.js";
import SemesterTemplate from "../../models/SemesterTemplate.js";
import { NotFoundError } from "../../core/errors/customErrors.js";
import { paginateQuery, parsePagination } from "../../core/utils/pagination.utils.js";

export const createMajorService = async (data, universityId) => {
  const newMajor = await Major.create(data);
  const collegeId = newMajor.college || newMajor.collage;
  const college = await College.findById(collegeId);
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
    newMajor.semesterTemplates = createdTemplates.map((t) => t._id);
    await newMajor.save();
  }
  return newMajor;
};

export const getMajorsService = async (filter = {}, query = {}) => {
  const { page, limit } = parsePagination(query);
  return paginateQuery(Major, filter, { page, limit, populate: ["semesterTemplates", "college"] });
};

export const getMajorByIdService = async (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError("Major not found");
  }
  const major = await Major.findById(id).populate(["semesterTemplates", "college"]);
  if (!major) throw new NotFoundError("Major not found");
  return major;
};

export const updateMajorService = async (id, data) => {
  const major = await Major.findByIdAndUpdate(id, data, { new: true });
  if (!major) throw new NotFoundError("Major not found");
  return major;
};

export const deleteMajorService = async (id) => {
  const major = await Major.findByIdAndDelete(id);
  if (!major) throw new NotFoundError("Major not found");
  await SemesterTemplate.deleteMany({ major: major._id });
  return major;
};
