const { StatusCodes } = require("http-status-codes");
const Student = require("../models/Student");
const Semester = require("../models/Semester");

const createStudent = async (req, res) => {
  // const student=req.body;
  console.log(req.body);
  const student = await Student.create(req.body);
  res.status(StatusCodes.CREATED).json(student);
};

const updateStudent = async (req, res) => {
  const id = req.params.id;
  const student = await Student.findByIdAndUpdate(id, req.body);
  res.status(StatusCodes.CREATED).json({ student });
};
const getStudent = async (req, res) => {
  const id = req.params.id;
  const student = await Student.findById(id);
  res.status(StatusCodes.CREATED).json({ student });
};

const deleteStudent = async (req, res) => {
  const id = req.params.id;
  const student = await Student.findByIdAndDelete(id);
  res.status(StatusCodes.CREATED).json({ student });
};

const getSemstersGrades = async (req, res) => {
  const id = req.params.id;

  const semesters = await Student.findById(id);
  res.status(StatusCodes.CREATED).json({ semesters });
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
  updateStudent,
  deleteStudent,
  getStudent
};
