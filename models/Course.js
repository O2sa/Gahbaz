import mongoose from "mongoose";
import Subject from "./Subject.js";

const CourseSchema = new mongoose.Schema({
  willLearn: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
  },
  requirements: [
    {
      type: String,
    },
  ],
  status: {
    type: String,
    enum: ["active", "done"],
    default: "active",
  },
  sections: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Section",
    },
  ],
  semester: {
    type: mongoose.Schema.ObjectId,
    ref: "Semester",
  },
  grades: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Grade",
    },
  ],
  cover: String,
  students: [
    {
      student: {
        type: mongoose.Schema.ObjectId,
        ref: "Student",
      },
      grade: {
        type: mongoose.Schema.ObjectId,
        ref: "Grade",
      },
    },
  ],
});

// CourseSchema.pre("remove", async function (next) {
//   try {
//     await Section.deleteMany({
//       course: this._id,
//     });

//     next();
//   } catch (err) {
//     next(err);
//   }
// });
export default Subject.discriminator("Course", CourseSchema);
