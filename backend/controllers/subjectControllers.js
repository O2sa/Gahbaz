import { StatusCodes } from "http-status-codes"
import Subject from "../models/Subject.js"
import SemesterTemp from "../models/SemesterTemp.js"
import Major from "../models/Major.js";

const getCollageSubjects = async (req, res) => {
  const id = req.params.id;
  const subjects = await Subject.find({ collage: id }).populate('teachers')
  res.status(StatusCodes.OK).json(subjects);
};

const getCollageSubjectsByMajor = async (req, res) => {
  const id = req.params.id;
  const major = await Major.findById(id);
  const subjects = await Subject.find({ collage: major.collage });

  let newSubs={}
  for(const sub of subjects)
  {
    newSubs[sub._id]=sub
  }
  res.status(StatusCodes.OK).json(newSubs);
};

const createSubject = async (req, res) => {
  const { name, collage, semester } = req.body;
  const subject = await Subject.create(req.body);
  // const sem = await SemesterTemp.findById(semester);
  // sem.subjects.push(subject._id);
  // await sem.save();
  res.status(StatusCodes.OK).json(subject);
};

const getSubject = async (req, res) => {
  const subject = await Subject.create(req.body);
  res.status(StatusCodes.OK).json(subject);
};

const deleteSubject = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const deletedCourse = await Subject.findOneAndDelete({ _id: id });
  res.status(StatusCodes.OK).json(deleteSubject);
};

const updateSubject = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const deletedCourse = await Subject.findByIdAndUpdate({ _id: id }, req.body, {new: true});
  res.status(StatusCodes.OK).json(deleteSubject);
};

const getCourseStudents = async (req, res) => {
  res.status(StatusCodes.OK).json();
};

const editCourseGrades = async (req, res) => {
  res.status(StatusCodes.OK).json();
};

export {
  getCollageSubjects,
  createSubject,
  getSubject,
  deleteSubject,
  updateSubject,
  getCollageSubjectsByMajor
};
