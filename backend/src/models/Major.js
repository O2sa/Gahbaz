const mongoose = require("mongoose");
const SemesterTemp = require("./SemesterTemp");

const MajorSchema = new mongoose.Schema({
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
});

MajorSchema.pre("findByIdAndDelete", async function (next) {
  try {
    await SemesterTemp.deleteMany({ major: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Major", MajorSchema);
