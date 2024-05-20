import { StatusCodes } from "http-status-codes";
import Grade from "../models/Grade.js";
import Section from "../models/Section.js";
import Student from "../models/Student.js";
import Course from "../models/Course.js";

const getGrade = async (req, res) => {
  const gradeId = req.params.gradeId;
  const grade = await Grade.findById(gradeId);
  const sections = await Section.find({ _id: gradeId });

  // console.log(grade);
  grade.sections = sections;
  res.status(StatusCodes.OK).json(grade);
};

const createGrade = async (req, res) => {
  const courseId = req.params.courseId;
  const students = await Student.find();
  const course = await Course.findById(courseId);
  for (const student of students) {
    const grade = await Grade.create({
      student: student._id,
      course: course._id,
    });
    // course.students.push({ student: student._id, grade: grade._id });
  }

  // await course.save();
  res.status(StatusCodes.CREATED).json(course);
};

const updateGrade = async (req, res) => {
  const gradeId = req.params.gradeId;

  const grade = await Grade.findById(gradeId);
  const course = await Course.findById(grade.course);
  const updatedGrade = await grade.updateGrade(
    req.body.grade,
    course.gradeSchema
  );

  console.log(updatedGrade);
  await Grade.findByIdAndUpdate(grade._id, { grade: updatedGrade.grade });
  res.status(StatusCodes.CREATED).json(updatedGrade);
};

const getAllGrades = async (req, res) => {
  const courseId = req.params.courseId;

  let grades = await Grade.find({ course: courseId });

  for (const grade in grades)
    grades[grade].student = await Student.findById(grades[grade].student);
  res.status(StatusCodes.OK).json(grades);
};

const deleteGrade = async (req, res) => {
  const gradeId = req.params.gradeId;

  await Grade.findByIdAndDelete({ _id: gradeId });

  res.status(StatusCodes.OK).json();
};

export { getGrade, createGrade, updateGrade, deleteGrade, getAllGrades };
