import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subject name is required"],
      minlength: 2,
      maxlength: 100,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    gradeSchema: {
      total: { type: Number, default: 100 },
      grade: {
        type: mongoose.Schema.Types.Mixed,
        default: {
          0: { name: "تكاليف", value: 20 },
          1: { name: "نصفي", value: 30 },
          2: { name: "نهائي", value: 50 },
        },
      },
    },
    subtitle: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      alias: "collage",
      index: true,
    },
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      index: true,
    },
    creditHours: {
      type: Number,
      default: 3,
      min: 1,
      max: 10,
    },
    prerequisites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
  },
  {
    timestamps: true,
    discriminatorKey: "itemType",
  }
);

SubjectSchema.methods.updateGradeSchema = function (gradeSchemaToUpdate) {
  let total = 0;
  for (const gr in gradeSchemaToUpdate.grade) {
    const currField = Number(gradeSchemaToUpdate.grade[gr].value);
    if (currField >= 0) {
      if (!this.gradeSchema.grade) this.gradeSchema.grade = {};
      if (!this.gradeSchema.grade[gr]) this.gradeSchema.grade[gr] = {};
      this.gradeSchema.grade[gr].value = currField;
      total += currField;
    } else {
      throw new Error("Grade value must be non-negative");
    }
  }

  this.gradeSchema.total = total;
  this.markModified("gradeSchema");
  return this.save();
};

export default mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);
