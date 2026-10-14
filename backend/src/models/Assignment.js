import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
      index: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Teacher is required"],
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema, "assignments");
