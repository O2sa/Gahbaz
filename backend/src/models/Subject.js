const mongoose = require("mongoose");
const SemesterTemp = require("./SemesterTemp");

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 4,
    maxlength: 50,
  },
  description: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  category: {
    type: String,
  },
  collage: {
    type: mongoose.Schema.ObjectId,
    ref: "Collage",
    required: true,
  },
  teacher: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Teacher",
    },
  ],
});

SubjectSchema.pre("findOneAndDelete", function (next) {
  const doc = this;
  SemesterTemp.updateMany(
    { courses: doc._id },
    { $pull: { courses: doc._id } }
  ).exec();
  next();
});
module.exports = mongoose.model("Subject", SubjectSchema);
