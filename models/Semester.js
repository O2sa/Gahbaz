import mongoose from "mongoose";

const SemesterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 4,
    maxlength: 50,
  },
  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Major",
    required: true,
  },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  startDate: {
    type: Date,
    required: [true, "Please provide start date"],
  },
  endDate: {
    type: Date,
    required: [true, "Please provide end date"],
  },

  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Grades",
    required: true,
  },
  // status: {
  //   type: String,
  //   enum: ["to-do", "in-progress", "done"],
  //   default: "to-do",
  // },
  completed: {
    type: Boolean,
    default: false,
  },
});


export default mongoose.model("Semester", SemesterSchema);
