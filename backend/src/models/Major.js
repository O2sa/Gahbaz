import mongoose from "mongoose";

const MajorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Major name is required"],
      minlength: 2,
      maxlength: 100,
      trim: true,
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: [true, "College is required"],
      index: true,
      alias: "collage",
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    semesterTemplates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SemesterTemplate",
      },
    ],
    semesters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Semester",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Major || mongoose.model("Major", MajorSchema);
