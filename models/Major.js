import mongoose from "mongoose";
import SemesterTemp from "./SemesterTemp.js";

const MajorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 4,
    maxlength: 50,
  },
  // duration:{
  //   type: Date,
  //   required: [true, "Please provide start date"],
  // },
  // levels:{
  //   type: Number,
  //   required: [true, "Please provide start date"],
  // },
  collage: {
    type: mongoose.Schema.ObjectId,
    ref: "Collage",
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Student",
    },
  ],

  semesterTemplates: [{ type: mongoose.Schema.ObjectId, ref: "SemesterTemp" }],
  semesters: [{ type: mongoose.Schema.ObjectId, ref: "Semester" }],
});


MajorSchema.pre('remove', async function (next) {
  try {
    await SemesterTemp.deleteMany({ major: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Major", MajorSchema);
