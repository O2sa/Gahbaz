import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IGradeSchema {
  total: number;
  grade: Record<string, { name: string; value: number }>;
}

export interface ISubjectMethods {
  updateGradeSchema(gradeSchemaToUpdate: { grade: Record<string, { name?: string; value: number | string }> }): Promise<ISubject>;
}

export interface ISubject extends Document, ISubjectMethods {
  name: string;
  code?: string;
  gradeSchema: IGradeSchema;
  subtitle?: string;
  category?: string;
  college?: Types.ObjectId;
  teachers: Types.ObjectId[];
  university?: Types.ObjectId;
  creditHours: number;
  prerequisites: Types.ObjectId[];
  itemType?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SubjectModel = Model<ISubject, {}, ISubjectMethods>;

const SubjectSchema = new Schema<ISubject, SubjectModel, ISubjectMethods>(
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
        type: Schema.Types.Mixed,
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
      type: Schema.Types.ObjectId,
      ref: "College",
      alias: "collage",
      index: true,
    },
    teachers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
    university: {
      type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
  },
  {
    timestamps: true,
    discriminatorKey: "itemType",
  }
);

SubjectSchema.methods.updateGradeSchema = function (this: ISubject, gradeSchemaToUpdate: any) {
  let total = 0;
  for (const gr in gradeSchemaToUpdate.grade) {
    const currField = Number(gradeSchemaToUpdate.grade[gr].value);
    if (currField >= 0) {
      if (!this.gradeSchema.grade) this.gradeSchema.grade = {} as any;
      if (!this.gradeSchema.grade[gr]) this.gradeSchema.grade[gr] = {} as any;
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

export default (mongoose.models.Subject as SubjectModel) ||
  mongoose.model<ISubject, SubjectModel>("Subject", SubjectSchema);
