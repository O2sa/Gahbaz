import Teacher from "../../models/Teacher.js";
import { NotFoundError } from "../../core/errors/customErrors.js";
import { generateSecurePassword, hashPassword } from "../../core/utils/password.utils.js";
import { paginateQuery, parsePagination } from "../../core/utils/pagination.utils.js";
import sendMail from "../../config/mailer.js";

export const getTeachersService = async (universityId, query = {}) => {
  const { page, limit } = parsePagination(query);
  return paginateQuery(Teacher, { university: universityId }, {
    page,
    limit,
    select: "-password",
  });
};

export const getTeacherByIdService = async (id, universityId) => {
  const teacher = await Teacher.findOne({ _id: id, university: universityId }).select("-password");
  if (!teacher) throw new NotFoundError("Teacher not found");
  return teacher;
};

export const createTeacherService = async (data, universityId) => {
  const name = data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim();
  const rawPassword = data.password || generateSecurePassword(8);
  const hashedPassword = await hashPassword(rawPassword);

  const teacher = await Teacher.create({
    ...data,
    name,
    university: universityId,
    password: hashedPassword,
    role: "teacher",
  });

  try {
    await sendMail(
      teacher.email,
      "Gahbaz Teacher Account Created",
      `Your teacher account has been created with temporary password: ${rawPassword}\nPlease change it upon login.`
    );
  } catch {
    // Non-blocking mail failure
  }

  const saved = await Teacher.findById(teacher._id).select("-password");
  return {
    teacher: saved || teacher,
    tempPassword: rawPassword,
  };
};

export const updateTeacherService = async (id, data, universityId) => {
  const updatePayload = { ...data };
  if (data.name) {
    updatePayload.name = data.name.trim();
  } else if (data.firstName || data.lastName) {
    updatePayload.name = `${data.firstName || ''} ${data.lastName || ''}`.trim();
  }

  const updatedTeacher = await Teacher.findOneAndUpdate(
    { _id: id, university: universityId },
    updatePayload,
    { new: true }
  ).select("-password");
  if (!updatedTeacher) throw new NotFoundError("Teacher not found");
  return updatedTeacher;
};

export const deleteTeacherService = async (id, universityId) => {
  const removed = await Teacher.findOneAndDelete({ _id: id, university: universityId });
  if (!removed) throw new NotFoundError("Teacher not found");
  return removed;
};
