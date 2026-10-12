import mongoose from "mongoose";
import User from "./User.js";

const StudentSchema = new mongoose.Schema({
  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Major",
  },
  comingSemester: {
    type: Number,
    default: 0,
  },
  semesters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
    },
  ],
  grades: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grade",
    },
  ],
});

export default User.discriminators?.Student || User.discriminator("Student", StudentSchema);
