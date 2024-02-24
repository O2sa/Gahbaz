const mongoose = require("mongoose");
const { Schema } = mongoose;

const SemesterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 4,
    maxlength: 50,
  },
  major: {
    type: Schema.Types.ObjectId,
    ref: "Major",
    required: true,
  },
  index: { type: Number },
  subjects: [{ type: Schema.Types.ObjectId, ref: "Subject",  }],
});

module.exports = mongoose.model("SemesterTemp", SemesterSchema);
