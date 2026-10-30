import mongoose, { Model, Schema } from "mongoose";
import User, { IUser } from "./User.js";

export interface IAdmin extends IUser {
  role: "admin" | "super-admin";
}

const AdminSchema = new Schema<IAdmin>({
  role: {
    type: String,
    enum: ["admin", "super-admin"],
    default: "admin",
  },
});

export default (User.discriminators?.Admin as Model<IAdmin>) ||
  User.discriminator<IAdmin>("Admin", AdminSchema);
