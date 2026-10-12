import Teacher from "../../models/Teacher.js";
import { NotFoundError } from "../../core/errors/customErrors.js";
import { generateSecurePassword, hashPassword } from "../../core/utils/password.utils.js";
import sendMail from "../../config/mailer.js";

export const getTeachersService = async (universityId) => {
  return Teacher.find({ university: universityId }).select("-password");
};

export const getTeacherByIdService = async (id, universityId) => {
  const teacher = await Teacher.findOne({ _id: id, university: universityId }).select("-password");
  if (!teacher) throw new NotFoundError("Teacher not found");
  return teacher;
};

export const createTeacherService = async (data, universityId) => {
  const tempPassword = generateSecurePassword(8);
  const hashedPassword = await hashPassword(tempPassword);

  const teacher = await Teacher.create({
    ...data,
    university: universityId,
    password: hashedPassword,
  });

  await sendMail(
    teacher.email,
    "Gahbaz Teacher Account Created",
    `Your teacher account has been created with temporary password: ${tempPassword}\nPlease change it upon login.`
  );

  return Teacher.findById(teacher._id).select("-password");
};

export const updateTeacherService = async (id, data, universityId) => {
  const updatedTeacher = await Teacher.findOneAndUpdate(
    { _id: id, university: universityId },
    data,
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
