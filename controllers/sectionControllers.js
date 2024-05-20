import { StatusCodes } from "http-status-codes";
import Section from "../models/Section.js";

const getSection = async (req, res) => {
  const id = req.params.id;
  const section = await Section.findById(id);

  res.status(StatusCodes.OK).json(section);
};

const createSection = async (req, res) => {
  const section = await Section.create(req.body);

  res.status(StatusCodes.CREATED).json(section);
};

const updateSection = async (req, res) => {
  const id = req.params.id;

  const collage = await Section.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  res.status(StatusCodes.CREATED).json(collage);
};

const deleteSection = async (req, res) => {
  const id = req.params.id;

  const collages = await Section.findByIdAndDelete({ _id: id });

  res.status(StatusCodes.OK).json();
};

const createLesson = async (req, res) => {
  const sectionId = req.params.sectionId;

  const section = await Section.findById(sectionId);
  const lesson = section.addLesson(req.body);
  res.status(StatusCodes.CREATED).json(lesson);
};

const updateLesson = async (req, res) => {
  const sectionId = req.params.sectionId;
  const lessonId = req.params.lessonId;

  const section = await Section.findById(sectionId);
  const lesson = section.updateLesson(lessonId, req.body);

  res.status(StatusCodes.CREATED).json(lesson);
};

const deleteLesson = async (req, res) => {
  const sectionId = req.params.sectionId;
  const lessonId = req.params.lessonId;

  const section = await Section.findById(sectionId);
  const lesson = section.deleteLesson(lessonId);

  res.status(StatusCodes.OK).json(lesson);
};

const getLesson = async (req, res) => {
  const sectionId = req.params.sectionId;
  const lessonId = req.params.lessonId;

  const section = await Section.findById(sectionId);
  const lesson = section.getLesson(lessonId);

  res.status(StatusCodes.OK).json(lesson);
};



const getAllSections = async (req, res) => {
  const id = req.params.id;

  const sections = await Section.find({ course: id });

  res.status(StatusCodes.OK).json(sections);
};
const getAllLessons = async (req, res) => {
  const sectionId = req.params.sectionId;

  const section = await Section.findById(sectionId);

  res.status(StatusCodes.OK).json(section.lessons);
};

const getSectionStudents = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const editSectionGrades = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};
const setSectionTeacher = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "set section teacher" });
};

export {
  getSection,
  createSection,
  updateSection,
  deleteSection,
  getAllSections,
  createLesson,
  updateLesson,
  deleteLesson,
  getAllLessons,
  getLesson
};
