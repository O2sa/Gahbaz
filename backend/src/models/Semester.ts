import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ISemester extends Document {
  name: string;
  major: Types.ObjectId;
  template: Types.ObjectId;
  university: Types.ObjectId;
  courses: Types.ObjectId[];
  students: Types.ObjectId[];
  startDate: Date;
  endDate: Date;
  completed: boolean;
  addDropDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SemesterSchema = new Schema<ISemester>(
  {
    name: {
      type: String,
      required: [true, "Semester name is required"],
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    major: {
      type: Schema.Types.ObjectId,
      ref: "Major",
      required: [true, "Major is required"],
      index: true,
    },
    template: {
      type: Schema.Types.ObjectId,
      ref: "SemesterTemplate",
      required: [true, "Template is required"],
    },
    university: {
      type: Schema.Types.ObjectId,
      ref: "University",
      required: [true, "University is required"],
      index: true,
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    addDropDeadline: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default (mongoose.models.Semester as Model<ISemester>) ||
  mongoose.model<ISemester>("Semester", SemesterSchema);
