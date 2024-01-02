const mongoose = require("mongoose");
const SemesterTemp = require("./SemesterTemp");

const CourseTempSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 4,
    maxlength: 50,
  },
  collage: {
    type: mongoose.Schema.ObjectId,
    ref: "Collage",
    required: true,
  },
  semester: {
    type: mongoose.Schema.ObjectId,
    ref: "SemesterTemp",
  },
});

CourseTempSchema.pre("findOneAndDelete", function (next) {
  const doc = this;
  SemesterTemp.updateMany(
    { courses: doc._id },
    { $pull: { courses: doc._id } }
  ).exec();
  next();
});
module.exports = mongoose.model("CourseTemp", CourseTempSchema);
