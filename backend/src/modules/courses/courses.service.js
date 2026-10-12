import Course from "../../models/Course.js";
import Section from "../../models/Section.js";
import Student from "../../models/Student.js";
import { NotFoundError } from "../../core/errors/customErrors.js";

// ======================== COURSES ========================
export const getCourseByIdService = async (id) => {
  const course = await Course.findById(id).populate("sections").populate("teachers");
  if (!course) throw new NotFoundError("Course not found");
  const sections = await Section.find({ course: id });
  course.sections = sections;
  return course;
};

export const createCourseService = async (data) => {
  return Course.create(data);
};

export const updateCourseService = async (id, data) => {
  const course = await Course.findByIdAndUpdate(id, data, { new: true });
  if (!course) throw new NotFoundError("Course not found");
  return course;
};

export const deleteCourseService = async (id) => {
  const course = await Course.findByIdAndDelete(id);
  if (!course) throw new NotFoundError("Course not found");
  await Section.deleteMany({ course: course._id });
  return course;
};

export const getCoursesBySemesterService = async (semesterId) => {
  return Course.find({ semester: semesterId });
};

export const getUserCoursesService = async (user) => {
  if (user.role === "teacher") {
    return Course.find({ teachers: user.id || user.userId }).populate("sections");
  }
  if (user.role === "student") {
    const student = await Student.findById(user.id || user.userId);
    return Course.find({ semester: { $in: student?.semesters || [] } }).populate("sections");
  }
  return Course.find({}).populate("sections");
};

// ======================== SECTIONS & LESSONS ========================
export const getSectionByIdService = async (id) => {
  const section = await Section.findById(id);
  if (!section) throw new NotFoundError("Section not found");
  return section;
};

export const createSectionService = async (data) => {
  return Section.create(data);
};

export const updateSectionService = async (id, data) => {
  const section = await Section.findByIdAndUpdate(id, data, { new: true });
  if (!section) throw new NotFoundError("Section not found");
  return section;
};

export const deleteSectionService = async (id) => {
  const section = await Section.findByIdAndDelete(id);
  if (!section) throw new NotFoundError("Section not found");
  return section;
};

export const getSectionsByCourseService = async (courseId) => {
  return Section.find({ course: courseId });
};

export const addLessonService = async (sectionId, lessonData) => {
  const section = await Section.findById(sectionId);
  if (!section) throw new NotFoundError("Section not found");
  await section.addLesson(lessonData);
  return section;
};

export const updateLessonService = async (sectionId, lessonId, lessonData) => {
  const section = await Section.findById(sectionId);
  if (!section) throw new NotFoundError("Section not found");
  await section.updateLesson(lessonId, lessonData);
  return section;
};

export const deleteLessonService = async (sectionId, lessonId) => {
  const section = await Section.findById(sectionId);
  if (!section) throw new NotFoundError("Section not found");
  await section.deleteLesson(lessonId);
  return section;
};
