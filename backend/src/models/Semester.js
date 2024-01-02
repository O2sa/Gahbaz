const mongoose = require("mongoose");
const { Schema } = mongoose;
const SemesterSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 4,
    maxlength: 50,
  },
  major: {
    type: Schema.Types.ObjectId,
    ref: "Major",
    required: true,
  },
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  startDate: {
    type: Date,
    required: [true, "Please provide start date"],
  },
  endDate: {
    type: Date,
    required: [true, "Please provide end date"],
  },
  status: {
    type: String,
    enum: ['to-do','in-progress', 'done',],
    default: 'to-do',
  },
});

module.exports = mongoose.model("Semester", SemesterSchema);
