const { StatusCodes } = require("http-status-codes");
const { createCollage } = require("./collageControllers");
const Collage = require("../models/Collage");
const Admin = require("../models/Admin");
const User = require("../models/User");

//user
const addUser = async (req, res) => {
  const { email, name } = req.body;

  res.status(StatusCodes.OK).json("add user");
};

const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  const admin = Admin.create(name, email, password);

  res.status(StatusCodes.OK).json(admin);
};

const getAllUsers = async (req, res) => {
  const users= await User.find()
  res.status(StatusCodes.OK).json(users);
};

const deleteUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "user deleted" });
};

//collage
const addCollage = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "collage added" });
};

const getAllCollages = async (req, res) => {
  const collages = await Collage.find({});

  res.status(StatusCodes.OK).json({ collages, counts: collages.length });
};

const updateCollageInfo = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "update collage info" });
};

//major
const addMajor = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "add major" });
};

const updateMajorInfo = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "update major info" });
};

//semester
const addSemester = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "add semester" });
};

const editSemester = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "edit semester" });
};

const startSemester = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "start semester" });
};
const addCourseToSemester = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "add course to semester" });
};

//course
const addCourse = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "add course" });
};
const getAllCollageCourses = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "getAllCollageCourses" });
};

const updateCourseInfo = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "update course info" });
};

const deleteCourse = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "delete course" });
};

const adminDashbord = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "admin dashboard" });
};

module.exports = {
  addUser,
  deleteUser,
  getAllUsers,
  addCollage,
  getAllCollages,
  updateCollageInfo,
  addMajor,
  updateMajorInfo,
  addCourse,
  updateCourseInfo,
  deleteCourse,
  addSemester,
  editSemester,
  addCourseToSemester,
  startSemester,
  adminDashbord,
  getAllCollageCourses,
  createAdmin
};
