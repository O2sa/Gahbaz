const { StatusCodes } = require("http-status-codes");
const Course = require("../models/Course");

const getCourse = async (req, res) => {
  const id = req.params.id;
  const course = await Course.find({ _id: id });

  res.status(StatusCodes.OK).json({ course });
};

const createCourse = async (req, res) => {
  const course = await Course.create(req.body);
  res.status(StatusCodes.CREATED).json({ course });
};

const updateCourse = async (req, res) => {
  const id = req.params.id;

  const collage = await Course.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  res.status(StatusCodes.CREATED).json({ collage });
};

const getSemesterCourses = async (req, res) => {
  const id = req.params.id;

  const courses = await Course.find({ _id: id });

  res.status(StatusCodes.OK).json({ courses, counts: courses.length });
};
const getAllCourses = async (req, res) => {
  const courses = await Course.find({});
  res.status(StatusCodes.OK).json({ courses, counts: courses.length });
};

const deleteCourse = async (req, res) => {
  const id = req.params.id;

  const collages = await Course.findByIdAndDelete({ _id: id });

  res.status(StatusCodes.OK).json({});
};

const getCourseStudents = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const editCourseGrades = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};
const setCourseTeacher = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "set course teacher" });
};

module.exports = {
  getCourse,
  createCourse,
  updateCourse,
  getSemesterCourses,
  deleteCourse,
};
