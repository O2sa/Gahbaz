import mongoose from "mongoose"
import Major from "./Major.js"
import SemesterTemp from "./SemesterTemp.js"

const CollageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 4,
    maxlength: 50,
  },
  majors: {
    type: mongoose.Schema.ObjectId,
    ref: "Major",
  },
    numberOfSemesters:{
    type: Number,
    required: [true, "Please provide start date"],
  },
  university: {
    type: mongoose.Types.ObjectId,
    ref: "University",
    required: [true,"collage"],
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

export default  mongoose.model("Collage", CollageSchema);
