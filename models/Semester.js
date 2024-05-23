import mongoose from "mongoose";
import { getCurrentTime } from "../utils/constants.js";
import Student from "./Student.js";
import Course from "./Course.js";
import Section from "./Section.js";
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
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  startDate: {
    type: Date,
    default: () => getCurrentTime(),
  },
  endDate: {
    type: Date,
    required: [true, "Please provide end date"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  university: {
    type: mongoose.Types.ObjectId,
    ref: "University",
    required: [true, "لا بد من تحديد عدد الحصص اليومية"],
  },
});

// SemesterSchema.pre("remove", async function (next) {
//   try {
//     await Student.updateMany(
//       { semesters: this._id },
//       { $pull: { semesters: this._id } }
//     );
//     await Course.deleteMany(
//       { semester: this._id },
//     );
//     await Section.deleteMany({
//       course: {
//         $in: this.courses,
//       },
//     });

//     next();
//   } catch (err) {
//     next(err);
//   }
// });
export default mongoose.model("Semester", SemesterSchema);
