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

export default Subject.discriminator("Course", CourseSchema);

const SectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 4,
    maxlength: 50,
  },
  lessons: [
    {
      name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 4,
        maxlength: 50,
      },
      type: {
        type: String,
        enum: ["video", "topic"],
        default: "topic",
      },
      video: {
        type: String,
      },
      topic: {
        type: String,
      },
    },
  ],
  course: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
    required: true,
  },
});
