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
  const items = await Teacher.find({ university: req.user.universityId });

  res.status(StatusCodes.OK).json(items);
};

const deleteTeacher = async (req, res) => {
  const id = req.params.id;

  const item = await Teacher.findByIdAndDelete({ _id: id });

  res.status(StatusCodes.OK).json();
};

const createTeacher = async (req, res) => {
  req.body.university=req.user.universityId
  const user = await Teacher.create(req.body);

  const hashedPassword = await hashPassword(req.body.email);

  await Teacher.findByIdAndUpdate(user._id, {password: hashedPassword})


  res.status(StatusCodes.CREATED).json(user);
};



export {
  getTeacher,
  updateTeacher,
  getAllTeachers,
  deleteTeacher,
  createTeacher,
};
