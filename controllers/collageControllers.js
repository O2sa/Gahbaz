import { StatusCodes } from "http-status-codes";
import Collage from "../models/Collage.js";
import Major from "../models/Major.js";
import Subject from "../models/Subject.js";
import SemesterTemp from "../models/SemesterTemp.js";

const getCollage = async (req, res) => {
  const id = req.params.id;
  const collage = await Collage.findOne({
    _id: id,
    university: req.user.universityId,
  }).populate("majors");
  // const collage = await Collage.find({ _id: id });

  res.status(StatusCodes.OK).json(collage);
};

const createCollage = async (req, res) => {
  const collage = await Collage.create({
    ...req.body,
    university: req.user.universityId,
  });
  res.status(StatusCodes.CREATED).json(collage);
};

const updateCollage = async (req, res) => {
  const id = req.params.id;
  console.log(req.body);

  const collage = await Collage.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  res.status(StatusCodes.CREATED).json(collage);
};

const getAllCollages = async (req, res) => {
  const collages = await Collage.find({
    university: req.user.universityId,
  })
  res.status(StatusCodes.OK).json(collages);
};

const deleteCollage = async (req, res) => {
  const id = req.params.id;
  const collage = await Collage.findByIdAndDelete(id);
  const majors = await Major.find({ collage: collage._id });

  for (const major of majors) {
    await SemesterTemp.deleteMany({ major: major._id });
  }
  await Major.deleteMany({ collage: collage._id });
  await Subject.deleteMany({ collage: collage._id });

  res.status(StatusCodes.OK).json({});
};

export {
  getCollage,
  createCollage,
  updateCollage,
  deleteCollage,
  getAllCollages,
};
