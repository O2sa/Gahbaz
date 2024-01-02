const mongoose = require("mongoose");

const SemesterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 4,
    maxlength: 50,
  },
  major: {
    type: mongoose.Schema.ObjectId,
    ref: "Major",
    required: true,
  },
  index: { type: Number },
  courses: [{ type: mongoose.Schema.ObjectId, ref: "CourseTemp" }],
});

module.exports = mongoose.model("SemesterTemp", SemesterSchema);
