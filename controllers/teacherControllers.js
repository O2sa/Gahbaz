import { StatusCodes } from "http-status-codes";
import Teacher from "../models/Teacher.js";
import {
  generateTemporaryPassword,
  hashPassword,
} from "../utils/passwordUtils.js";

const getTeacher = async (req, res) => {
  const id = req.params.id;
  const collage = await Teacher.find({ _id: id });

  res.status(StatusCodes.OK).json(collage);
};

const updateTeacher = async (req, res) => {
  const id = req.params.id;

  const item = await Teacher.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  res.status(StatusCodes.CREATED).json(item);
};

const getAllTeachers = async (req, res) => {
  const items = await Teacher.find({});

  res.status(StatusCodes.OK).json(items);
};

const deleteTeacher = async (req, res) => {
  const id = req.params.id;

  const item = await Teacher.findByIdAndDelete({ _id: id });

  res.status(StatusCodes.OK).json();
};

const createTeacher = async (req, res) => {
  // Generate a temporary password
  const saltRounds = 10;

  const temporaryPassword = generateTemporaryPassword();

  // Hash the temporary password
  const hashedPassword = await hashPassword(temporaryPassword);

  const admin = await Teacher.create({ ...req.body, password: hashedPassword });
  res.status(StatusCodes.CREATED).json(admin);
};

const getTeacherCourses = async (req, res) => {
  const id = req.params.id;
  const courses = await Teacher.findById(id).populate("courses");
  res.status(StatusCodes.CREATED).json(courses);
};

export {
  getTeacher,
  updateTeacher,
  getAllTeachers,
  deleteTeacher,
  createTeacher,
  getTeacherCourses,
};
