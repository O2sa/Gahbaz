import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: [true, "Assignment reference is required"],
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course reference is required"],
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student reference is required"],
      index: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
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
      type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema, "submissions");
