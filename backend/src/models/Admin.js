import mongoose from "mongoose";
import User from "./User.js";
import { PERMISSIONS } from "../config/constants.js";

const AdminSchema = new mongoose.Schema({
  permissions: {
    type: String,
    enum: PERMISSIONS,
    default: "r",
  },
  role: {
    type: String,
    enum: ["admin", "super-admin", "user"],
    default: "admin",
  },
});

export default User.discriminators?.Admin || User.discriminator("Admin", AdminSchema);
