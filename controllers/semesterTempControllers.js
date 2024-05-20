import { StatusCodes } from "http-status-codes";
import SemesterTemp from "../models/SemesterTemp.js";
import Major from "../models/Major.js";
import Subject from "../models/Subject.js";

const getSemesterTemplate = async (req, res) => {
  const id = req.params.id;
  const sem = await SemesterTemp.findById(id);

  res.status(StatusCodes.OK).json(sem);
};

const createSemesterTemplate = async (req, res) => {
  const collage = await SemesterTemp.create(req.body);
  res.status(StatusCodes.CREATED).json(collage);
};

const updateSemesterTemplate = async (req, res) => {
  const id = req.params.id;

  const collage = await SemesterTemp.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  res.status(StatusCodes.CREATED).json(collage);
};

const deleteSemesterTemplate = async (req, res) => {
  const id = req.params.id;

  const collages = await SemesterTemp.findByIdAndDelete({ _id: id });

  res.status(StatusCodes.OK).json();
};

const getMajorTemplates = async (req, res) => {
  const id = req.params.id;

  const semesterTemplates = await SemesterTemp.find({ major: id });
  // console.log(semesterTemplates)

  
  res.status(StatusCodes.OK).json(semesterTemplates);
};

const getAllemesterTemplates = async (req, res) => {
  var semesterTemplates = await SemesterTemp.find({});
  // console.log(semesterTemplates)

  //  semesterTemplates=semesterTemplates.semesterTemplates
  res.status(StatusCodes.OK).json(semesterTemplates);
};

const addCourseToSemesterTemplate = async (req, res) => {
  const { semesterId, courseId } = req.body;
  const semesterTemplate = await SemesterTemp.findOne({ _id: semesterId });
  semesterTemplate.subjects.push(courseId);
  await semesterTemplate.save();

  res.status(StatusCodes.OK).json(semesterTemplate);
};

export {
  getSemesterTemplate,
  createSemesterTemplate,
  updateSemesterTemplate,
  getMajorTemplates,
  deleteSemesterTemplate,
  addCourseToSemesterTemplate,
  getAllemesterTemplates,
};
