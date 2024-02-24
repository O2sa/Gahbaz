const { StatusCodes } = require("http-status-codes");
const Teacher = require("../models/Teacher");

const getTeacher = async (req, res) => {
  const id = req.params.id;
  const collage = await Teacher.find({ _id: id });

  res.status(StatusCodes.OK).json({ collage });
};

const updateTeacher = async (req, res) => {
  const id = req.params.id;

  const item = await Teacher.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  res.status(StatusCodes.CREATED).json({ item });
};

const getAllTeachers = async (req, res) => {
  const items = await Teacher.find({});

  res.status(StatusCodes.OK).json({ items, counts: items.length });
};

const deleteTeacher = async (req, res) => {
  const id = req.params.id;

  const item = await Teacher.findByIdAndDelete({ _id: id });

  res.status(StatusCodes.OK).json({});
};
const createTeacher = async (req, res) => {
  const { name, email, password } = req.body;
  const teacher = await Teacher.create(req.body);
  res.status(StatusCodes.CREATED).json({ teacher });
};

const getTeacherCourses = async (req, res) => {
  const id = req.params.id;
  const courses = await Teacher.findById(id).populate('courses')
  res.status(StatusCodes.CREATED).json({ courses });
};

module.exports = {
  getTeacher,
  updateTeacher,
  getAllTeachers,
  deleteTeacher,
  createTeacher,
};
