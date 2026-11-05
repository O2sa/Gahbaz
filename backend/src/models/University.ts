import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IUniversity extends Document {
  name: string;
  code: string;
  admin?: Types.ObjectId;
  active: boolean;
  needsSetup?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UniversitySchema = new Schema<IUniversity>(
  {
    name: {
      type: String,
      required: [true, "University name is required"],
      minlength: [3, "University name must be at least 3 characters"],
      maxlength: [100, "University name cannot exceed 100 characters"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "University code is required"],
      minlength: [2, "University code must be at least 2 characters"],
      maxlength: [10, "University code cannot exceed 10 characters"],
      trim: true,
      uppercase: true,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    active: {
      type: Boolean,
      default: true,
    },
    needsSetup: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UniversitySchema.index({ code: 1 }, { unique: true });
UniversitySchema.index({ name: 1 });

export default (mongoose.models.University as Model<IUniversity>) ||
  mongoose.model<IUniversity>("University", UniversitySchema);
