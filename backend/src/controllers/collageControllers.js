const { StatusCodes } = require("http-status-codes");
const Collage = require("../models/Collage");

const getCollage = async (req, res) => {
  const id = req.params.id;
  const collage = await Collage.findById(id).populate('majors');
  // const collage = await Collage.find({ _id: id });

  res.status(StatusCodes.OK).json({ collage });
};

const createCollage = async (req, res) => {
  const collage = await Collage.create(req.body);
  res.status(StatusCodes.CREATED).json(collage);
};

const updateCollage = async (req, res) => {
  const id = req.params.id;

  const collage = await Collage.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  res.status(StatusCodes.CREATED).json({ collage });
};

const getAllCollages = async (req, res) => {
  const collages = await Collage.find({});
  res.status(StatusCodes.OK).json({ collages, counts: collages.length });
};

const deleteCollage = async (req, res) => {
  const id = req.params.id;

  const collage = await Collage.findOne({ _id: id });


  res.status(StatusCodes.OK).json({});
};

module.exports = {
  getCollage,
  createCollage,
  updateCollage,
  deleteCollage,
  getAllCollages,
};
