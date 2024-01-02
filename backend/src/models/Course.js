const mongoose = require("mongoose");
const CourseTemp = require("./CourseTemp");

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
  teacher: {
    type: mongoose.Schema.ObjectId,
    ref: "Teacher",
  },
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
});

module.exports = CourseTemp.discriminator("Course", CourseSchema);
