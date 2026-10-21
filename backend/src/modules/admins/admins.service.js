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
  const name = data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || "مدير الجامعة";
  const rawPassword = data.password || generateSecurePassword(8);
  const hashedPassword = await hashPassword(rawPassword);

  const admin = await Admin.create({
    ...data,
    name,
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

  const saved = await Admin.findById(admin._id).select("-password");
  const target = saved || admin;
  const obj = typeof target.toObject === "function" ? target.toObject() : target;
  return {
    ...obj,
    admin: obj,
    tempPassword: rawPassword,
  };
};

export const updateAdminService = async (id, data, universityId) => {
  let updateData = { ...data };
  if (updateData.name) {
    updateData.name = updateData.name.trim();
  } else if (updateData.firstName || updateData.lastName) {
    updateData.name = `${updateData.firstName || ''} ${updateData.lastName || ''}`.trim();
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
