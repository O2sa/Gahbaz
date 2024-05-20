import mongoose from "mongoose";

const GradeChema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },

  total: { type: Number, default: 0 },
  percent: { type: Number, default: 0 },

  grade: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      0: { name: "تكاليف", value: 0 },
      1: { name: "نصفي", value: 0 },
      2: { name: "نهائي", value: 0 },
    },
  },
});

GradeChema.methods.updateGrade = function (gradeToUpdate, gradeSchema) {
  this.total = 0;
  console.log("gradeToUpdate", gradeToUpdate);
  console.log("gradeSchema", gradeSchema);

  for (const gr in gradeToUpdate) {
    const currField = Number(gradeToUpdate[gr].value);
    if (currField > gradeSchema.grade[gr].value || currField < 0) {
      throw new Error("Lesson not found");
    } else {
      this.grade[gr].value = currField;
      this.total += currField;
    }
  }

  if (this.total > gradeSchema.total) {
    throw new Error("Lesson not found");
  }

  this.percent = (this.total / gradeSchema.total) * 100;

  return this.save();
};
export default mongoose.model("Grade", GradeChema);
