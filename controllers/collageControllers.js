import { StatusCodes } from "http-status-codes"
import Collage from "../models/Collage.js"

const getCollage = async (req, res) => {
  const id = req.params.id;
  const collage = await Collage.findById(id).populate('majors');
  // const collage = await Collage.find({ _id: id });

  res.status(StatusCodes.OK).json( collage );
};

const createCollage = async (req, res) => {
  const collage = await Collage.create(req.body);
  res.status(StatusCodes.CREATED).json(collage);
};

const updateCollage = async (req, res) => {
  const id = req.params.id;
  console.log(req.body)

  const collage = await Collage.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  res.status(StatusCodes.CREATED).json( collage );
};

const getAllCollages = async (req, res) => {
  const collages = await Collage.find({});
  res.status(StatusCodes.OK).json(collages );
};

const deleteCollage = async (req, res) => {
  const id = req.params.id;

  const collage = await Collage.findByIdAndDelete(id);
  res.status(StatusCodes.OK).json({});
};

export {
  getCollage,
  createCollage,
  updateCollage,
  deleteCollage,
  getAllCollages,
};
