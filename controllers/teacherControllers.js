import { StatusCodes } from "http-status-codes";
import Teacher from "../models/Teacher.js";
import {
  generateTemporaryPassword,
  hashPassword,
} from "../utils/passwordUtils.js";
import University from "../models/University.js";

const getTeacher = async (req, res) => {
  const id = req.params.id;
  const collage = await Teacher.find({ _id: id }).select('-password')

  res.status(StatusCodes.OK).json(collage);
};

const updateTeacher = async (req, res) => {
  const id = req.params.id;

  const item = await Teacher.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  }).select('-password')


  res.status(StatusCodes.CREATED).json(item);
};

const getAllTeachers = async (req, res) => {
  const items = await Teacher.find({
     university: req.user.university 
    }).select('-password')

  res.status(StatusCodes.OK).json(items);
};

const deleteTeacher = async (req, res) => {
  const id = req.params.id;

  const item = await Teacher.findByIdAndDelete({ _id: id });

  res.status(StatusCodes.OK).json();
};

const createTeacher = async (req, res) => {
  const uni = await University.findOne({ admin: req.user._id });
  req.body["university"] = uni._id;
  const user = await Teacher.create(req.body);

  const hashedPassword = await hashPassword(req.body.email);

 const updateUser= await Teacher.findByIdAndUpdate(user._id, { password: hashedPassword }).select('-password')

  res.status(StatusCodes.CREATED).json(updateTeacher);
};

export {
  getTeacher,
  updateTeacher,
  getAllTeachers,
  deleteTeacher,
  createTeacher,
};
