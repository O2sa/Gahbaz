import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IAssignment extends Document {
  course: Types.ObjectId;
  teacher: Types.ObjectId;
  university: Types.ObjectId;
  title: string;
  description: string;
  dueDate: Date;
  maxScore: number;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
      index: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Teacher is required"],
    },
    university: {
      type: Schema.Types.ObjectId,
      ref: "University",
      required: [true, "University reference is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Assignment title is required"],
      minlength: 2,
      maxlength: 200,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    maxScore: {
      type: Number,
      default: 100,
      min: 1,
    },
    fileUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "assignments",
  }
);

export default (mongoose.models.Assignment as Model<IAssignment>) ||
  mongoose.model<IAssignment>("Assignment", AssignmentSchema, "assignments");
