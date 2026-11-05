import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ISemesterTemplate extends Document {
  name: string;
  major: Types.ObjectId;
  index: number;
  active: boolean;
  subjects: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const SemesterTemplateSchema = new Schema<ISemesterTemplate>(
  {
    name: {
      type: String,
      required: [true, "Template name is required"],
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    major: {
      type: Schema.Types.ObjectId,
      ref: "Major",
      required: [true, "Major is required"],
      index: true,
    },
    index: {
      type: Number,
      default: 1,
      min: [1, "يجب أن يبدأ ترتيب المستوى من 1 على الأقل"],
    },
    active: {
      type: Boolean,
      default: false,
    },
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
  },
  {
    timestamps: true,
    collection: "semester_templates",
  }
);

SemesterTemplateSchema.index({ major: 1, index: 1 }, { unique: true });

export default (mongoose.models.SemesterTemplate as Model<ISemesterTemplate>) ||
  mongoose.model<ISemesterTemplate>("SemesterTemplate", SemesterTemplateSchema, "semester_templates");
