const mongoose = require("mongoose");
const Major = require("./Major");
const SemesterTemp = require("./SemesterTemp");

const CollageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 4,
    maxlength: 50,
  },
});

// CollageSchema.pre("findOneAndDelete", async function (next) {
//   try {
//     // await SemesterTemp.deleteMany({ collage: this._id });
//     await Major.deleteMany({ collage: this._id });
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = mongoose.model("Collage", CollageSchema);
