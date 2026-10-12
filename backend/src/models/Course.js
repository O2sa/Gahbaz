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
    default: "",
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    index: true,
  },
  grades: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grade",
    },
  ],
  cover: {
    type: String,
    default: "",
  },
  students: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
      grade: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Grade",
      },
    },
  ],
});

export default Subject.discriminators?.Course || Subject.discriminator("Course", CourseSchema);
