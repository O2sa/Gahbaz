const { StatusCodes } = require("http-status-codes");
const SemesterTemp = require("../models/SemesterTemp");

const getSemester = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const createSemesterTemp = async (req, res) => {
  const semester = await SemesterTemp.create(req.body);

  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const updateSemester = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const getSemesterTempCourses = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const addCourseToSemesterTemp = async (req, res) => {
  const { semesterId, courseId } = req.body;
  const semester = await SemesterTemp.findOne({ _id: semesterId });
  semester.courses.push(courseId);
  await semester.save();

  res.status(StatusCodes.OK).json(semester);
};

module.exports = {
  createSemesterTemp,
  addCourseToSemesterTemp,
};
