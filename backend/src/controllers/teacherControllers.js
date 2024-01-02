const { StatusCodes } = require("http-status-codes");
const Teacher = require("../models/Teacher");
const getAllCourses = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "get all courses" });
};

const getCourseGrades = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "get course grades" });
};

const updateCourseGrades = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "update course grades" });
};
const createTeacher = async (req, res) => {
  const { name, email, password } = req.body;
  const teacher = await Teacher.create(name, email, password);
  res.status(StatusCodes.CREATED).json(teacher);
};

module.exports = {
  getAllCourses,
  getCourseGrades,
  updateCourseGrades,
  createTeacher
};
