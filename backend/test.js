const mongoose = require("mongoose");
const User = require("./User");

const AdminSchema = new mongoose.Schema({});

module.exports = User.discriminator("Admin", AdminSchema);

const CollageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 4,
    maxlength: 50,
  },
});

module.exports = mongoose.model("Collage", CollageSchema);

const Subject = require("./Subject");

const gradeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
});

const CourseSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.ObjectId,
    ref: "Teacher",
  },
  studentsGrades: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },
      score: {
        type: Number,
        default: 0,
      },
    },
  ],
});

module.exports = Subject.discriminator("Course", CourseSchema);

const SemesterTemp = require("./SemesterTemp");

const MajorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 4,
    maxlength: 50,
  },
  collage: {
    type: mongoose.Schema.ObjectId,
    ref: "Collage",
    required: true,
  },
});

MajorSchema.pre("findByIdAndDelete", async function (next) {
  try {
    await SemesterTemp.deleteMany({ major: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Major", MajorSchema);
const { Schema } = mongoose;
const SemesterSchema = new Schema({
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
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  startDate: {
    type: Date,
    required: [true, "Please provide start date"],
  },
  endDate: {
    type: Date,
    required: [true, "Please provide end date"],
  },
  status: {
    type: String,
    enum: ['to-do','in-progress', 'done',],
    default: 'to-do',
  },
});

module.exports = mongoose.model("Semester", SemesterSchema);


const validator = require("validator");
const User = require("./User");

const StudentSchema = new mongoose.Schema({
  academic_id: {
    type: Number,
    unique: true,
    required: [true, "Please provide the academic id"],
  },
  major: {
    type: mongoose.Schema.ObjectId,
    ref: "Major",
    required: true,
  },
  comingSemester: {
    type: Number,
    required: true,
    default: 0,
  },
  semesters:[{ type: mongoose.Schema.ObjectId, ref: "Semester" }]
});

module.exports = User.discriminator("Student", StudentSchema);

const SemesterTemp = require("./SemesterTemp");

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 4,
    maxlength: 50,
  },
  collage: {
    type: mongoose.Schema.ObjectId,
    ref: "Collage",
    required: true,
  },
  semester: {
    type: mongoose.Schema.ObjectId,
    ref: "SemesterTemp",
  },
});

SubjectSchema.pre("findOneAndDelete", function (next) {
  const doc = this;
  SemesterTemp.updateMany(
    { courses: doc._id },
    { $pull: { courses: doc._id } }
  ).exec();
  next();
});
module.exports = mongoose.model("Subject", SubjectSchema);
