import mongoose, { Model, Schema } from "mongoose";
import User, { IUser } from "./User.js";

export interface ITeacher extends IUser {
  title?: string;
  courses?: any[];
  subjects?: any[];
}

const TeacherSchema = new Schema<ITeacher>(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual references for reverse population
TeacherSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "teachers",
});

TeacherSchema.virtual("subjects", {
  ref: "Subject",
  localField: "_id",
  foreignField: "teachers",
});

export default (User.discriminators?.Teacher as Model<ITeacher>) ||
  User.discriminator<ITeacher>("Teacher", TeacherSchema);
