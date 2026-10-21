import mongoose from "mongoose";
import User from "./User.js";

const TeacherSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "",
    trim: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
});

export default User.discriminators?.Teacher || User.discriminator("Teacher", TeacherSchema);
