const mongoose = require("mongoose");
const User = require("./User");

const teacherSchema = new mongoose.Schema({
  academic_id: {
    type: Number,
    unique: true,
    required: [true, "Please provide the academic id"],
  },
  title: {
    type: String,
  },
  courses:[
    {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
    }
  ]
});

module.exports = User.discriminator("Teacher", teacherSchema);
