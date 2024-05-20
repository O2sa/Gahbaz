import { StatusCodes } from "http-status-codes"

const addUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const updateUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const deleteUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

export {
  addUser,
  updateUser,
  deleteUser,
};
