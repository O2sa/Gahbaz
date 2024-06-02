import { StatusCodes } from "http-status-codes";
import Student from "../models/Student.js";
import Semester from "../models/Semester.js";
import Major from "../models/Major.js";
import { hashPassword } from "../utils/passwordUtils.js";
import University from "../models/University.js";
const createStudent = async (req, res) => {
  const uni = await University.findOne({ admin: req.user._id });
  req.body["university"] = uni._id;
  console.log(req.body);


  const user = await Student.create(req.body);

  const hashedPassword = await hashPassword(req.body.email);
  await Student.findByIdAndUpdate(user._id, { password: hashedPassword });

  res.status(StatusCodes.CREATED).json(user);
};

const updateStudent = async (req, res) => {
  const id = req.params.id;
  const student = await Student.findByIdAndUpdate(id, req.body);
  res.status(StatusCodes.CREATED).json({ student });
};

const getStudent = async (req, res) => {
  const id = req.params.id;
  const student = await Student.findById(id).populate('major')
  res.status(StatusCodes.CREATED).json( student );
};

const deleteStudent = async (req, res) => {
  const id = req.params.id;
  const student = await Student.findByIdAndDelete(id);
  // const major = await Major.findById(student.major);
  // major.students.pull(student._id)
  // await major.save()
  res.status(StatusCodes.CREATED).json(student);
};

const getSemstersGrades = async (req, res) => {
  const id = req.params.id;

  const semesters = await Student.findById(id);
  res.status(StatusCodes.CREATED).json(semesters);
};

const getCurrentCourses = async (req, res) => {
  res.status(StatusCodes.CREATED).json();
};

const getAllStudents = async (req, res) => {
  const students = await Student.find({
    university: req.user.university,
  }).populate("major");
  res.status(StatusCodes.CREATED).json(students);
};

export {
  createStudent,
  getCurrentCourses,
  getSemstersGrades,
  getAllStudents,
  updateStudent,
  deleteStudent,
  getStudent,
};
