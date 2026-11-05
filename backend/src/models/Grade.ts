import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IGradeItem {
  name: string;
  value: number;
}

export interface IGradeMethods {
  updateGrade(
    gradeToUpdate: Record<string, { name?: string; value: number | string } | number>,
    gradeSchema?: { total?: number; grade?: Record<string, { name?: string; value: number }> }
  ): Promise<IGrade>;
}

export interface IGrade extends Document, IGradeMethods {
  course: Types.ObjectId;
  student: Types.ObjectId;
  total: number;
  percent: number;
  grade: Record<string, IGradeItem>;
  createdAt: Date;
  updatedAt: Date;
}

export type GradeModel = Model<IGrade, {}, IGradeMethods>;

const GradeSchema = new Schema<IGrade, GradeModel, IGradeMethods>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    total: { type: Number, default: 0 },
    percent: { type: Number, default: 0 },
    grade: {
      type: Schema.Types.Mixed,
      default: {
        0: { name: "تكاليف", value: 0 },
        1: { name: "نصفي", value: 0 },
        2: { name: "نهائي", value: 0 },
      },
    },
  },
  { timestamps: true }
);

GradeSchema.methods.updateGrade = function (
  this: IGrade,
  gradeToUpdate: Record<string, { name?: string; value: number | string } | number>,
  gradeSchema?: any
) {
  if (!this.grade || typeof this.grade !== "object") {
    this.grade = {};
  }

  for (const gr in gradeToUpdate) {
    const item = gradeToUpdate[gr];
    const rawVal = typeof item === "object" && item !== null ? item.value : item;
    const currField = Number(rawVal);

    if (isNaN(currField)) continue;

    const maxAllowed = gradeSchema?.grade?.[gr]?.value ?? 100;

    if (currField > maxAllowed || currField < 0) {
      throw new Error(`Grade value cannot exceed maximum allowed score of ${maxAllowed}`);
    }

    const itemName =
      (typeof item === "object" && item !== null && item.name) ||
      this.grade[gr]?.name ||
      gradeSchema?.grade?.[gr]?.name ||
      `بند ${gr}`;

    this.grade[gr] = {
      name: itemName,
      value: currField,
    };
  }

  // Recalculate total across all items in this.grade
  this.total = 0;
  for (const gr in this.grade) {
    const itemVal =
      typeof this.grade[gr] === "object" && this.grade[gr] !== null
        ? Number(this.grade[gr].value)
        : Number(this.grade[gr]);
    this.total += isNaN(itemVal) ? 0 : itemVal;
  }

  const schemaTotal = gradeSchema?.total || 100;
  if (this.total > schemaTotal) {
    throw new Error(`Total grade cannot exceed ${schemaTotal}`);
  }

  this.percent = schemaTotal > 0 ? (this.total / schemaTotal) * 100 : 0;

  // Crucial: Mark Mixed type as modified so Mongoose saves changes to MongoDB!
  if (typeof this.markModified === "function") {
    this.markModified("grade");
  }

  return this.save();
};

export default (mongoose.models.Grade as GradeModel) ||
  mongoose.model<IGrade, GradeModel>("Grade", GradeSchema);
