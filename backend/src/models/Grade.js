import mongoose from "mongoose";

const GradeItemSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    name: { type: String, required: true },
    maxValue: { type: Number, required: true },
    value: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const GradeSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    total: { type: Number, default: 0 },
    percent: { type: Number, default: 0 },
    grades: {
      type: [GradeItemSchema],
      default: [
        { key: "assignments", name: "تكاليف", maxValue: 20, value: 0 },
        { key: "midterm", name: "نصفي", maxValue: 30, value: 0 },
        { key: "final", name: "نهائي", maxValue: 50, value: 0 },
      ],
    },
    grade: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        0: { name: "تكاليف", value: 0 },
        1: { name: "نصفي", value: 0 },
        2: { name: "نهائي", value: 0 },
      },
    },
  },
  { timestamps: true }
);

GradeSchema.methods.recalculateTotal = function () {
  let sum = 0;
  let maxTotal = 0;

  if (this.grades && this.grades.length > 0) {
    for (const g of this.grades) {
      sum += Number(g.value) || 0;
      maxTotal += Number(g.maxValue) || 0;
    }
  }

  this.total = sum;
  this.percent = maxTotal > 0 ? (sum / maxTotal) * 100 : 0;
  return this;
};

GradeSchema.methods.updateGrade = function (gradeToUpdate, gradeSchema) {
  this.total = 0;

  for (const gr in gradeToUpdate) {
    const currField = Number(gradeToUpdate[gr].value);
    const maxAllowed = gradeSchema?.grade?.[gr]?.value ?? 100;

    if (currField > maxAllowed || currField < 0) {
      throw new Error(`Grade value cannot exceed maximum allowed score of ${maxAllowed}`);
    } else {
      if (this.grade && this.grade[gr]) {
        this.grade[gr].value = currField;
      }
      this.total += currField;
    }
  }

  const schemaTotal = gradeSchema?.total || 100;
  if (this.total > schemaTotal) {
    throw new Error(`Total grade cannot exceed ${schemaTotal}`);
  }

  this.percent = (this.total / schemaTotal) * 100;
  return this.save();
};

export default mongoose.models.Grade || mongoose.model("Grade", GradeSchema);
