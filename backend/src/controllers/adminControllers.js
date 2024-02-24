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
  const admin = Admin.create(req.body);

  res.status(StatusCodes.OK).json(admin);
};

const getAllUsers = async (req, res) => {
  const users= await User.find()
  res.status(StatusCodes.OK).json(users);
};


module.exports = {
  addUser,
  getAllUsers,
  createAdmin
};
