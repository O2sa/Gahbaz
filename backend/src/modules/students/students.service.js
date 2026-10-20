import Student from "../../models/Student.js";
import Semester from "../../models/Semester.js";
import Grade from "../../models/Grade.js";
import { NotFoundError } from "../../core/errors/customErrors.js";
import { generateSecurePassword, hashPassword } from "../../core/utils/password.utils.js";
import { paginateQuery, parsePagination } from "../../core/utils/pagination.utils.js";
import sendMail from "../../config/mailer.js";

export const getStudentsService = async (universityId, query = {}) => {
  const { page, limit } = parsePagination(query);
  return paginateQuery(Student, { university: universityId }, {
    page,
    limit,
    select: "-password",
    populate: "major",
  });
};

export const getStudentByIdService = async (id, universityId) => {
  const student = await Student.findOne({ _id: id, university: universityId })
    .select("-password")
    .populate("major");
  if (!student) throw new NotFoundError("Student not found");
  return student;
};

export const createStudentService = async (data, universityId) => {
  const name = data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim();
  const rawPassword = data.password || generateSecurePassword(8);
  const hashedPassword = await hashPassword(rawPassword);

  const studentData = {
    ...data,
    name,
    university: universityId,
    password: hashedPassword,
    role: "student",
  };
  if (!studentData.major) delete studentData.major;

  const student = await Student.create(studentData);

  try {
    await sendMail(
      student.email,
      "Welcome to Gahbaz - Your Temporary Password",
      `Hello ${student.name || name},\n\nYour account has been created with temporary password: ${rawPassword}\nPlease change it after logging in.`
    );
  } catch {
    // Non-blocking mail failure
  }

  const query = Student.findById(student._id).select("-password");
  const saved = query && typeof query.populate === "function" ? await query.populate("major") : await query;
  const target = saved || student;
  const obj = typeof target.toObject === "function" ? target.toObject() : target;
  return {
    ...obj,
    student: obj,
    tempPassword: rawPassword,
  };
};

export const updateStudentService = async (id, data, universityId) => {
  const updatePayload = { ...data };
  if (data.name) {
    updatePayload.name = data.name.trim();
  } else if (data.firstName || data.lastName) {
    updatePayload.name = `${data.firstName || ''} ${data.lastName || ''}`.trim();
  }
  if (updatePayload.major === "") updatePayload.major = null;

  const student = await Student.findOneAndUpdate(
    { _id: id, university: universityId },
    updatePayload,
    { new: true }
  ).select("-password").populate("major");
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
