const mongoose = require("mongoose");

const CollageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 4,
    maxlength: 50,
  },
});

module.exports = mongoose.model("Collage", CollageSchema);
