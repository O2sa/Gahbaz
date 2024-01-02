const { StatusCodes } = require("http-status-codes");
const Course=require('../models/Course')

const getCourse = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const addCourse = async (req, res) => {

  const course=await Course.create(req.body)
  res.status(StatusCodes.OK).json(course);
};

const updateCourse = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const getCourseStudents = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const editCourseGrades = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};
const setCourseTeacher = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "set course teacher" });
};

module.exports = {
  setCourseTeacher,
    getCourse,
    addCourse,
    updateCourse,
    getCourseStudents,
    editCourseGrades
  };
