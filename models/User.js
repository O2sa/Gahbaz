import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      // required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
      type: String,
      // required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide email"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
    },
  password: String,

    phone: {
      type: Number,
      minlength: 9,
    },
    avatar: String,
    university: {
      type: mongoose.Types.ObjectId,
      ref: "University",
      required: [true, "لا بد من تحديد عدد الحصص اليومية"],
    },
  },
  { timestamps: true }
);


export default mongoose.model("User", UserSchema);
