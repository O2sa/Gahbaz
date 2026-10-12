import mongoose from "mongoose";

const CollegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "College name is required"],
      minlength: 2,
      maxlength: 100,
      trim: true,
    },
    numberOfSemesters: {
      type: Number,
      default: 8,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: [true, "University reference is required"],
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "colleges",
  }
);

// Virtual for majors
CollegeSchema.virtual("majors", {
  ref: "Major",
  localField: "_id",
  foreignField: "college",
});

export default mongoose.models.College || mongoose.model("College", CollegeSchema, "colleges");
