import Student from "../../models/Student.js";
import Semester from "../../models/Semester.js";
import Grade from "../../models/Grade.js";
import { NotFoundError } from "../../core/errors/customErrors.js";
import { generateSecurePassword, hashPassword } from "../../core/utils/password.utils.js";
import sendMail from "../../config/mailer.js";

export const getStudentsService = async (universityId) => {
  return Student.find({ university: universityId })
    .select("-password")
    .populate("major");
};

export const getStudentByIdService = async (id, universityId) => {
  const student = await Student.findOne({ _id: id, university: universityId })
    .select("-password")
    .populate("major");
  if (!student) throw new NotFoundError("Student not found");
  return student;
};

export const createStudentService = async (data, universityId) => {
  const tempPassword = generateSecurePassword(8);
  const hashedPassword = await hashPassword(tempPassword);

  const student = await Student.create({
    ...data,
    university: universityId,
    password: hashedPassword,
  });

  await sendMail(
    student.email,
    "Welcome to Gahbaz - Your Temporary Password",
    `Hello ${student.firstName},\n\nYour account has been created with temporary password: ${tempPassword}\nPlease change it after logging in.`
  );

  return Student.findById(student._id).select("-password");
};

export const updateStudentService = async (id, data, universityId) => {
  const student = await Student.findOneAndUpdate(
    { _id: id, university: universityId },
    data,
    { new: true }
  ).select("-password");
  if (!student) throw new NotFoundError("Student not found");
  return student;
};

export const deleteStudentService = async (id, universityId) => {
  const student = await Student.findOneAndDelete({ _id: id, university: universityId });
  if (!student) throw new NotFoundError("Student not found");

  await Semester.updateMany({ students: student._id }, { $pull: { students: student._id } });
  await Grade.deleteMany({ student: student._id });
  return student;
};
