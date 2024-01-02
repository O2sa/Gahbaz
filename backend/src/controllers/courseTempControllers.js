const { StatusCodes } = require("http-status-codes");
const CourseTemp = require("../models/CourseTemp");
const SemesterTemp = require("../models/SemesterTemp");

const getAllCollageCoursesTemp = async (req, res) => {
  const collage_id = req.params.collage_id;
  const courses = await CourseTemp.find({ collage: collage_id });
  res.status(StatusCodes.OK).json(courses);
};

const createCourseTemp = async (req, res) => {
  const { name, collage, semester } = req.body;
  const course = await CourseTemp.create({ name: name, collage: collage });
  const sem = await SemesterTemp.findById(semester);
  sem.courses.push(course._id);
  await sem.save();
  res.status(StatusCodes.OK).json(course);
};

const getCourse = async (req, res) => {
  const course = await CourseTemp.create(req.body);
  res.status(StatusCodes.OK).json(course);
};

const deleteTempCourse = async (req, res) => {
  const  courseId = req.params.courseId;
  console.log(courseId)
  const deletedCourse = await CourseTemp.findOneAndDelete({ _id: courseId });
  res.status(StatusCodes.OK).json(deletedCourse);
};

const getCourseStudents = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const editCourseGrades = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

module.exports = {
  getCourse,
  createCourseTemp,
  deleteTempCourse,
  getCourseStudents,
  editCourseGrades,
  getAllCollageCoursesTemp,
};
