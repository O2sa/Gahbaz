import Admin from "../../models/Admin.js";
import { NotFoundError } from "../../core/errors/customErrors.js";
import { generateSecurePassword, hashPassword } from "../../core/utils/password.utils.js";
import { paginateQuery, parsePagination } from "../../core/utils/pagination.utils.js";
import sendMail from "../../config/mailer.js";

export const getAdminsService = async (universityId, query = {}) => {
  const { page, limit } = parsePagination(query);
  return paginateQuery(Admin, { university: universityId }, {
    page,
    limit,
    select: "-password",
  });
};

export const getAdminByIdService = async (id, universityId) => {
  const admin = await Admin.findOne({ _id: id, university: universityId }).select("-password");
  if (!admin) throw new NotFoundError("Admin not found");
  return admin;
};

export const createAdminService = async (data, universityId) => {
  let firstName = data.firstName;
  let lastName = data.lastName;
  if (!firstName && data.name) {
    const parts = data.name.trim().split(/\s+/);
    firstName = parts[0] || "مدير";
    lastName = parts.slice(1).join(" ") || "جامعي";
  }

  const rawPassword = data.password || generateSecurePassword(8);
  const hashedPassword = await hashPassword(rawPassword);

  const admin = await Admin.create({
    ...data,
    firstName: firstName || "مدير",
    lastName: lastName || "الجامعة",
    university: universityId,
    role: "admin",
    isAdmin: true,
    kind: "Admin",
    permissions: data.permissions || "rw",
    password: hashedPassword,
  });

  try {
    await sendMail(
      admin.email,
      "Gahbaz Admin Account Created",
      `Your admin account has been created with temporary password: ${rawPassword}\nPlease change it upon login.`
    );
  } catch (err) {
    console.warn("[Admin Service] Mail sending skipped:", err.message);
  }

  return Admin.findById(admin._id).select("-password");
};

export const updateAdminService = async (id, data, universityId) => {
  let updateData = { ...data };
  if (!updateData.firstName && updateData.name) {
    const parts = updateData.name.trim().split(/\s+/);
    updateData.firstName = parts[0];
    updateData.lastName = parts.slice(1).join(" ") || updateData.lastName;
    delete updateData.name;
  }

  const updatedAdmin = await Admin.findOneAndUpdate(
    { _id: id, university: universityId },
    updateData,
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
