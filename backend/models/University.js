import mongoose from "mongoose";

const UniversitySchema = new mongoose.Schema({
  name: {
    type: String,
    default: "University",
    required: [true, "University name is required"],
  },
  admin: {
    type: mongoose.Types.ObjectId,
    ref: "Admin",
    required: false,
  },


});

export default mongoose.model("University", UniversitySchema);
