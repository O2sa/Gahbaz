import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IUniversity extends Document {
  name: string;
  code?: string;
  admin?: Types.ObjectId;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UniversitySchema = new Schema<IUniversity>(
  {
    name: {
      type: String,
      required: [true, "University name is required"],
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default (mongoose.models.University as Model<IUniversity>) ||
  mongoose.model<IUniversity>("University", UniversitySchema);
