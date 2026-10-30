import mongoose, { Model, Schema, Types } from "mongoose";
import Subject, { ISubject } from "./Subject.js";

export interface ICourseStudent {
  student: Types.ObjectId;
  grade?: Types.ObjectId;
}

export interface ICourse extends ISubject {
  willLearn: string[];
  description: string;
  requirements: string[];
  status: "active" | "done";
  sections: Types.ObjectId[];
  semester?: Types.ObjectId;
  cover?: string;
  students: ICourseStudent[];
}

const CourseSchema = new Schema<ICourse>({
  willLearn: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    default: "",
  },
  requirements: [
    {
      type: String,
    },
  ],
  status: {
    type: String,
    enum: ["active", "done"],
    default: "active",
  },
  sections: [
    {
      type: Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  semester: {
    type: Schema.Types.ObjectId,
    ref: "Semester",
    index: true,
  },
  cover: {
    type: String,
    default: "",
  },
  students: [
    {
      student: {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
      grade: {
        type: Schema.Types.ObjectId,
        ref: "Grade",
      },
    },
  ],
});

export default (Subject.discriminators?.Course as Model<ICourse>) ||
  Subject.discriminator<ICourse>("Course", CourseSchema);
