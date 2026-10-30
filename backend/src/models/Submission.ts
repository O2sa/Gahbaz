import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ISubmission extends Document {
  assignment: Types.ObjectId;
  course: Types.ObjectId;
  student: Types.ObjectId;
  university: Types.ObjectId;
  fileUrl: string;
  notes?: string;
  submittedAt: Date;
  grade?: number | null;
  feedback?: string;
  gradedBy?: Types.ObjectId;
  gradedAt?: Date;
  status: "submitted" | "graded" | "late";
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    assignment: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: [true, "Assignment reference is required"],
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course reference is required"],
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student reference is required"],
      index: true,
    },
    university: {
      type: Schema.Types.ObjectId,
      ref: "University",
      required: [true, "University reference is required"],
      index: true,
    },
    fileUrl: {
      type: String,
      required: [true, "Submitted file URL is required"],
    },
    notes: {
      type: String,
      default: "",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    grade: {
      type: Number,
      min: 0,
      default: null,
    },
    feedback: {
      type: String,
      default: "",
    },
    gradedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    gradedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["submitted", "graded", "late"],
      default: "submitted",
    },
  },
  {
    timestamps: true,
    collection: "submissions",
  }
);

SubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export default (mongoose.models.Submission as Model<ISubmission>) ||
  mongoose.model<ISubmission>("Submission", SubmissionSchema, "submissions");
