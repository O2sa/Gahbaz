import mongoose from "mongoose";
import SemesterTemp from "./SemesterTemp.js";

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 4,
    maxlength: 50,
  },
  gradeSchema: {
    total: { type: Number, default: 100 },
    grade: {
      type:  mongoose.Schema.Types.Mixed,
      default: {
        0: { name: "تكاليف", value: 20 },
        1: { name: "نصفي", value: 30 },
        2: { name: "نهائي", value: 50 },
      },
    },
  },
  subtitle: {
    type: String,
  },
  category: {
    type: String,
  },
  collage: {
    type: mongoose.Schema.ObjectId,
    ref: "Collage",
    // required: true,
  },
  teachers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Teacher",
    },
  ],
});

SubjectSchema.methods.updateGradeSchema = function (gradeSchemaToUPdate) {
  let total = 0;
  for (const gr in gradeSchemaToUPdate.grade) {
    const currField = Number(gradeSchemaToUPdate.grade[gr].value);

    if (currField >= 0) {
      this.gradeSchema.grade[gr].value = currField;
      total += currField;
    } else {
      throw new Error("Lesson not found");
    }
  }

  this.gradeSchema.total = total;

  return this.save();
};
export default mongoose.model("Subject", SubjectSchema);
