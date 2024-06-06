import mongoose from "mongoose";
import User from "./User.js";
import { PERMISSIONS } from "../utils/constants.js";

const AdminSchema = new mongoose.Schema({
  permissions: { type: String, enum: PERMISSIONS, default: "r" },
  role: {
    type: String,
    enum: ["admin", "super-admin", 'user'],
    default: "admin",
  },
  university: {
    type: mongoose.Types.ObjectId,
    ref: "University",
    // required: [true, "لا بد من تحديد عدد الحصص اليومية"],
  },
});

export default User.discriminator("Admin", AdminSchema);
