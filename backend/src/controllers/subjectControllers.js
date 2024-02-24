const { StatusCodes } = require("http-status-codes");
const Subject = require("../models/Subject");
const SemesterTemp = require("../models/SemesterTemp");

const getCollageSubjects = async (req, res) => {
  const id = req.params.id;
  const subjects = await Subject.find({ collage: id });
  res.status(StatusCodes.OK).json({subjects});
};

const createSubject = async (req, res) => {
  const { name, collage, semester } = req.body;
  const subject = await Subject.create(req.body);
  // const sem = await SemesterTemp.findById(semester);
  // sem.subjects.push(subject._id);
  // await sem.save();
  res.status(StatusCodes.OK).json({subject});
};

const getSubject = async (req, res) => {
  const subject = await Subject.create(req.body);
  res.status(StatusCodes.OK).json({subject});
};

const deleteSubject = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const deletedCourse = await Subject.findOneAndDelete({ _id: id });
  res.status(StatusCodes.OK).json({deletedCourse});
};

const updateSubject = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const deletedCourse = await Subject.findByIdAndUpdate({ _id: id }, req.body, {new: true});
  res.status(StatusCodes.OK).json({deletedCourse});
};

const getCourseStudents = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const editCourseGrades = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

module.exports = {
  getCollageSubjects,
  createSubject,
  getSubject,
  deleteSubject,
  updateSubject,
};
