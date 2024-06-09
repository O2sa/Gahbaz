import { StatusCodes } from "http-status-codes";
import Course from "../models/Course.js";
import Section from "../models/Section.js";

const getCourse = async (req, res) => {
  const id = req.params.id;
  const course = await Course.findById(id).populate('sections').populate('teachers')
  const sections = await Section.find({ course: id });

  // // console.log(course);
  course.sections = sections;
  res.status(StatusCodes.OK).json(course);
};

const createCourse = async (req, res) => {
  const course = await Course.create(req.body);
  res.status(StatusCodes.CREATED).json(course);
};

const updateCourse = async (req, res) => {
  const id = req.params.id;

  const collage = await Course.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  res.status(StatusCodes.CREATED).json(collage);
};

const getSemesterCourses = async (req, res) => {
  const semesterId = req.params.semesterId;

  const courses = await Course.find({ semester: semesterId });

  res.status(StatusCodes.OK).json(courses);
};

const getTeacherStudentCourses = async (req, res) => {
  let courses = [];
  switch (req.user.__t) {
    case "Teacher": {
      courses = await Course.find({ teachers: req.user._id }).populate("sections");
      break;
    }
    case "Student": {
      courses = await Course.find({
        semester: { $in: req.user.semesters },
      }).populate("sections");
      break;
    }
  }

  res.status(StatusCodes.OK).json(courses);
};

const deleteCourse = async (req, res) => {
  const id = req.params.id;

  const course = await Course.findByIdAndDelete({ _id: id });
  await Section.deleteMany({ course: course._Id });
  res.status(StatusCodes.OK).json();
};
const getTeacherCourses = async (req, res) => {
  const teacherId = req.params.teacherId;
  const courses = await Course.find({ teachers: teacherId });
  res.status(StatusCodes.CREATED).json(courses);
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

export {
  getCourse,
  createCourse,
  updateCourse,
  getSemesterCourses,
  deleteCourse,
  getTeacherStudentCourses,
  getTeacherCourses,
};
