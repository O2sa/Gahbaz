const mongoose = require("mongoose");
const Subject = require("./Subject");

const gradeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
});

const CourseSchema = new mongoose.Schema({
  studentsGrades: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },
      score: {
        type: Number,
        default: 0,
      },
    },
  ],
  willLearn: [
    {
      type: String,
    },
  ],
  requirements: [
    {
      type: String,
    },
  ],
  sections: {
    type: mongoose.Schema.ObjectId,
    ref: "Section",
  },
  semester: {
    type: mongoose.Schema.ObjectId,
    ref: "Semester",
  },
});

module.exports = Subject.discriminator("Course", CourseSchema);

const SectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 4,
    maxlength: 50,
  },
  lessons: { type: mongoose.Schema.ObjectId, ref: "Lesson" },
});

const lesson = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 4,
    maxlength: 50,
  },
  description: {
    type: String,
  },
  video: {
    type: String,
  },
  notes: {
    type: String,
  },
  file: {
    type: String,
  },
});

module.exports = mongoose.model("Lesson", lesson);
module.exports = mongoose.model("Section", SectionSchema);
