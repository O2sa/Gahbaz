import mongoose from "mongoose"
import User from "./User.js"

const teacherSchema = new mongoose.Schema({
  // academic_id: {
  //   type: Number,
  //   unique: true,
  //   // required: [true, "Please provide the academic id"],
  // },
  title: {
    type: String,
  },
  courses:[
    {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
    }
  ],
  subjects: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Subject",
    },
  ],

});

export default  User.discriminator("Teacher", teacherSchema);
