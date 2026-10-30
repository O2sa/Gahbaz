import mongoose, { Model, Schema, Types } from "mongoose";
import User, { IUser } from "./User.js";

export interface IStudent extends IUser {
  studentId?: string;
  major?: Types.ObjectId | null;
  comingSemester: number;
  semesters: Types.ObjectId[];
  grades: Types.ObjectId[];
}

const StudentSchema = new Schema<IStudent>({
  studentId: {
    type: String,
    trim: true,
    default: "",
  },
  major: {
    type: Schema.Types.ObjectId,
    ref: "Major",
    default: null,
  },
  comingSemester: {
    type: Number,
    default: 0,
  },
  semesters: [
    {
      type: Schema.Types.ObjectId,
      ref: "Semester",
    },
  ],
  grades: [
    {
      type: Schema.Types.ObjectId,
      ref: "Grade",
    },
  ],
});

export default (User.discriminators?.Student as Model<IStudent>) ||
  User.discriminator<IStudent>("Student", StudentSchema);
