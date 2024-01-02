const { StatusCodes } = require("http-status-codes");

const addUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const updateUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const deleteUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

module.exports = {
  addUser,
  updateUser,
  deleteUser,
};
