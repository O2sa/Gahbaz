const mongoose = require("mongoose");
const validator = require("validator");
const User = require("./User");

const StudentSchema = new mongoose.Schema({
  academic_id: {
    type: Number,
    unique: true,
    required: [true, "Please provide the academic id"],
  },
  major: {
    type: mongoose.Schema.ObjectId,
    ref: "Major",
    required: true,
  },
  comingSemester: {
    type: Number,
    default: 0,
  },
  semesters:[{ type: mongoose.Schema.ObjectId, ref: "Semester" }]
});

module.exports = User.discriminator("Student", StudentSchema);
