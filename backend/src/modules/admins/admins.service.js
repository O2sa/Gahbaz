import Admin from "../../models/Admin.js";
import { NotFoundError } from "../../core/errors/customErrors.js";
import { generateSecurePassword, hashPassword } from "../../core/utils/password.utils.js";
import sendMail from "../../config/mailer.js";

export const getAdminsService = async (universityId) => {
  return Admin.find({ university: universityId }).select("-password");
};

export const getAdminByIdService = async (id, universityId) => {
  const admin = await Admin.findOne({ _id: id, university: universityId }).select("-password");
  if (!admin) throw new NotFoundError("Admin not found");
  return admin;
};

export const createAdminService = async (data, universityId) => {
  const tempPassword = generateSecurePassword(8);
  const hashedPassword = await hashPassword(tempPassword);

  const admin = await Admin.create({
    ...data,
    university: universityId,
    role: "admin",
    password: hashedPassword,
  });

  await sendMail(
    admin.email,
    "Gahbaz Admin Account Created",
    `Your admin account has been created with temporary password: ${tempPassword}\nPlease change it upon login.`
  );

  return Admin.findById(admin._id).select("-password");
};

export const updateAdminService = async (id, data, universityId) => {
  const updatedAdmin = await Admin.findOneAndUpdate(
    { _id: id, university: universityId },
    data,
    { new: true }
  ).select("-password");
  if (!updatedAdmin) throw new NotFoundError("Admin not found");
  return updatedAdmin;
};

export const deleteAdminService = async (id, universityId) => {
  const removed = await Admin.findOneAndDelete({ _id: id, university: universityId }).select("-password");
  if (!removed) throw new NotFoundError("Admin not found");
  return removed;
};
