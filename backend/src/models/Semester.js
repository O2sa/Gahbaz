import mongoose from "mongoose";

const SemesterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Semester name is required"],
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    major: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Major",
      required: [true, "Major is required"],
      index: true,
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SemesterTemplate",
      required: [true, "Template is required"],
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: [true, "University is required"],
      index: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

export default mongoose.models.Semester || mongoose.model("Semester", SemesterSchema);
