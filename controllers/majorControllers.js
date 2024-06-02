import { StatusCodes } from "http-status-codes";
import Major from "../models/Major.js";
import SemesterTemp from "../models/SemesterTemp.js";
import Collage from "../models/Collage.js";

const getMajor = async (req, res) => {
  const id = req.params.id;
  const item = await Major.findById(id);

  res.status(StatusCodes.OK).json(item);
};

const getCollageMajors = async (req, res) => {
  const id = req.params.id;
  const majors = await Major.find({ collage: id });
  // console.log(req.params.collageId);

  res.status(StatusCodes.OK).json(majors);
};
const getAllMajors = async (req, res) => {
  const majors = await Major.find({ university: req.user.university });
  // console.log(req.params.collageId);
  res.status(StatusCodes.OK).json(majors);
};

const createMajor = async (req, res) => {
  const major = req.body;
  // console.log(semestersNum, major);

  const newMajor = await Major.create(major);
  const collage = await Collage.findById(newMajor.collage);

  for (var s = 0; s < collage.numberOfSemesters; s++) {
    const newSemester = await SemesterTemp.create({
      name: `semester ${s + 1}, ${newMajor.name}`,
      major: newMajor._id,
      index: s,
    });

    newMajor.semesterTemplates.push(newSemester._id);
    await newMajor.save();

    console.log(newMajor, newSemester);
  }

  // Save the parent document
  // newMajor.save((err, savedParent) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log("Parent document with new item:", savedParent);
  //   }
  // });

  res.status(StatusCodes.OK).json(newMajor);
};

const updateMajor = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const major = await Major.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  res.status(StatusCodes.OK).json(major);
};

const deleteMajor = async (req, res) => {
  const id = req.params.id;
  const major = await Major.findByIdAndDelete(id);

  await SemesterTemp.deleteMany({ major: major._Id });

  // const deletedSems = await SemesterTemp.deleteMany({ major: major.id });

  if (!major) {
    return res.status(StatusCodes.NOT_FOUND).json();
  }

  // Call remove() on the instance of the Major model

  // You can respond with the deleted Major
  res.status(StatusCodes.OK).json(major);
};

const addSemester = async (req, res) => {
  // const major=await Major.create(req.body)

  res.status(StatusCodes.OK).json();
};

export {
  getMajor,
  getCollageMajors,
  createMajor,
  updateMajor,
  deleteMajor,
  getAllMajors,
};
