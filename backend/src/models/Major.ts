import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IMajor extends Document {
  name: string;
  college: Types.ObjectId;
  students?: any[];
  semesterTemplates?: any[];
  semesters?: any[];
  createdAt: Date;
  updatedAt: Date;
}

const MajorSchema = new Schema<IMajor>(
  {
    name: {
      type: String,
      required: [true, "Major name is required"],
      minlength: 2,
      maxlength: 100,
      trim: true,
    },
    college: {
      type: Schema.Types.ObjectId,
      ref: "College",
      required: [true, "College is required"],
      index: true,
      alias: "collage",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual references for child collections
MajorSchema.virtual("students", {
  ref: "Student",
  localField: "_id",
  foreignField: "major",
});

MajorSchema.virtual("semesterTemplates", {
  ref: "SemesterTemplate",
  localField: "_id",
  foreignField: "major",
});

MajorSchema.virtual("semesters", {
  ref: "Semester",
  localField: "_id",
  foreignField: "major",
});

export default (mongoose.models.Major as Model<IMajor>) ||
  mongoose.model<IMajor>("Major", MajorSchema);
