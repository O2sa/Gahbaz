import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ICollege extends Document {
  name: string;
  numberOfSemesters: number;
  university: Types.ObjectId;
  majors?: any[];
  createdAt: Date;
  updatedAt: Date;
}

const CollegeSchema = new Schema<ICollege>(
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
      type: Schema.Types.ObjectId,
      ref: "University",
      required: [true, "University reference is required"],
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "colleges",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for majors
CollegeSchema.virtual("majors", {
  ref: "Major",
  localField: "_id",
  foreignField: "college",
});

export default (mongoose.models.College as Model<ICollege>) ||
  mongoose.model<ICollege>("College", CollegeSchema, "colleges");
