import mongoose from "mongoose";
import User from "./User.js";
import { PERMISSIONS } from "../utils/constants.js";

const AdminSchema = new mongoose.Schema({
  permissions: { type: String, enum: PERMISSIONS, default: "rw-" },
  role: {
    type: String,
    enum: ["admin", "super-admin"],
    default: "admin",
  },
});

export default User.discriminator("Admin", AdminSchema);
