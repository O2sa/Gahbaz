const { StatusCodes } = require("http-status-codes");
const Student = require("../models/Student");

const createStudent = async (req, res) => {
  // const student=req.body;
  console.log(req.body);
  const student = await Student.create(req.body);
  res.status(StatusCodes.CREATED).json(student);
};
const getStudent = async (req, res) => {
  // const student=req.body;
  console.log(req.body);
  const student = await Student.create(req.body);
  res.status(StatusCodes.CREATED).json(student);
};

const getSemstersGrades = async (req, res) => {
  res.status(StatusCodes.CREATED).json({ res: "Semster courses." });
};

const getCurrentCourses = async (req, res) => {
  res.status(StatusCodes.CREATED).json({ res: "Semster courses." });
};

const getAllStudents = async (req, res) => {
  const students = await Student.find();
  res.status(StatusCodes.CREATED).json({ students });
};

module.exports = {
  createStudent,
  getCurrentCourses,
  getSemstersGrades,
  getAllStudents,
};
