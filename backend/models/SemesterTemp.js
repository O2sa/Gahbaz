import mongoose from "mongoose"

const SemesterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 4,
    maxlength: 50,
  },
  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Major",
    required: true,
  },
  index: { type: Number,  },
  active: {
    type: Boolean,
    default: false,
  },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
});

export default  mongoose.model("SemesterTemp", SemesterSchema);
