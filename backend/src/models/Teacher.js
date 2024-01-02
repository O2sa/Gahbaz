const mongoose = require("mongoose");
const User = require("./User");

const teacherSchema = new mongoose.Schema({

});



module.exports = User.discriminator("Teacher", teacherSchema);
