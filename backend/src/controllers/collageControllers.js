const { StatusCodes } = require("http-status-codes");
const Collage = require("../models/Collage");

const getCollage = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const createCollage = async (req, res) => {
  console.log(req.body);
  const collage=await Collage.create(req.body)
  res.status(StatusCodes.CREATED).json(collage);
};

const updateCollage = async (req, res) => {
  res.status(StatusCodes.CREATED).json({ res: "Semster courses." });
};
const getCollageMajors = async (req, res) => {
  res.status(StatusCodes.CREATED).json({ res: "Semster courses." });
};

module.exports = {
  getCollage,
  createCollage,
  updateCollage,
  getCollageMajors,
};
