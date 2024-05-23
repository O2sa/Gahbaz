import mongoose from "mongoose"
import validator from "validator"
import User from "./User.js"



const StudentSchema = new mongoose.Schema({
  // academic_id: {
  //   type: Number,
  //   unique: true,
  //   required: [true, "Please provide the academic id"],
  // },
  major: {
    type: mongoose.Schema.ObjectId,
    ref: "Major",
    required: true,
  },
  comingSemester: {
    type: Number,
    default: 0,
  },
  semesters:[{ type: mongoose.Schema.ObjectId, ref: "Semester" }],
  grades:[{ type: mongoose.Schema.ObjectId, ref: "Grade" }],

});

export default  User.discriminator("Student", StudentSchema);
