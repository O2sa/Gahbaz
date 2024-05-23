import mongoose from "mongoose";

const UniversitySchema = new mongoose.Schema({
  name: {
    type: String,
    default: "المدرسة",
    required: [true, "لا بد من تحديد عدد الحصص اليومية"],
  },
  admin: {
    type: mongoose.Types.ObjectId,
    ref: "Admin",
    required: [true, "لا بد من تحديد عدد الحصص اليومية"],
  },


});

export default mongoose.model("University", UniversitySchema);
