import mongoose from "mongoose"
import SemesterTemp from "./SemesterTemp.js"

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

  semesterTemplates: [{ type: mongoose.Schema.ObjectId, ref: "SemesterTemp" }],
});

// MajorSchema.pre('findOneAndDelete', async function(next) {
//   try {
//       // Find all semester templates linked to this Major
//     await SemesterTemp.deleteMany({ major: this._id });

//       // Delete all found semester templates
//       // await Promise.all(semesterTemplates.map(async (semesterTemplate) => {
//       //     await semesterTemplate.remove();
//       // }));

//       next();
//   } catch (error) {
//       next(error);
//   }
// });



// MajorSchema.pre("findByIdAndDelete", async function (next) {
//   try {
//     await SemesterTemp.deleteMany({ major: this._id });
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

export default  mongoose.model("Major", MajorSchema);
