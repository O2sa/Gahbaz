import mongoose from "mongoose";

const SemesterTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Template name is required"],
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
    index: {
      type: Number,
      default: 1,
    },
    active: {
      type: Boolean,
      default: false,
    },
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
  },
  {
    timestamps: true,
    collection: "semester_templates",
  }
);

export default mongoose.models.SemesterTemplate ||
  mongoose.model("SemesterTemplate", SemesterTemplateSchema, "semester_templates");
