import mongoose from "mongoose";
import Course from "../../models/Course.js";
import Section from "../../models/Section.js";
import Student from "../../models/Student.js";
import Grade from "../../models/Grade.js";
import Semester from "../../models/Semester.js";
import Chat from "../../models/Chat.js";
import { NotFoundError } from "../../core/errors/customErrors.js";
import { paginateQuery, parsePagination } from "../../core/utils/pagination.utils.js";

// ======================== COURSES ========================
export const getCourseByIdService = async (id, universityId = null) => {
  let course;
  if (universityId) {
    course = await Course.findOne({ _id: id, university: universityId })
      .populate("sections")
      .populate("teachers");
  } else {
    course = await Course.findById(id).populate("sections").populate("teachers");
  }
  if (!course) throw new NotFoundError("Course not found");
  const sections = await Section.find({ course: id });
  course.sections = sections;
  return course;
};

export const createCourseService = async (data) => {
  const course = await Course.create(data);
  try {
    await Chat.create({
      chatName: `دورة ${course.name}`,
      course: course._id,
      isGroupChat: true,
      users: [...(course.teachers || [])],
      groupAdmin: course.teachers?.[0] || null,
      university: course.university,
    });
  } catch (err) {
    // Non-fatal if chat creation encounters issues
  }
  return course;
};

export const updateCourseService = async (id, data, universityId = null) => {
  const query = universityId ? { _id: id, university: universityId } : { _id: id };
  const course = await Course.findOneAndUpdate(query, data, { new: true });
  if (!course) throw new NotFoundError("Course not found");
  return course;
};

export const deleteCourseService = async (id, universityId = null) => {
  const query = universityId ? { _id: id, university: universityId } : { _id: id };
  const course = await Course.findOneAndDelete(query);
  if (!course) throw new NotFoundError("Course not found");
  await Section.deleteMany({ course: course._id });
  await Grade.deleteMany({ course: course._id });
  await Semester.updateMany(
    { courses: course._id },
    { $pull: { courses: course._id } }
  );
  await Chat.deleteMany({ course: course._id });
  return course;
};

export const getCoursesBySemesterService = async (semesterId) => {
  return Course.find({ semester: semesterId });
};

export const getUserCoursesService = async (user, query = {}) => {
  const { page, limit } = parsePagination(query);
  let filter = {};
  if (user.role === "teacher") {
    filter = { teachers: user.id || user.userId };
  } else if (user.role === "student") {
    const student = await Student.findById(user.id || user.userId);
    filter = { semester: { $in: student?.semesters || [] } };
  } else if (user.role === "admin" && user.universityId) {
    filter = {
      $or: [
        { university: user.universityId },
        { university: { $exists: false } },
        { university: null },
      ],
    };
  }
  return paginateQuery(Course, filter, {
    page,
    limit,
    populate: [
      "sections",
      "teachers",
      {
        path: "semester",
        populate: { path: "major", populate: { path: "college" } },
      },
    ],
  });
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

export const getLessonService = async (sectionId, lessonId) => {
  const section = await Section.findById(sectionId);
  if (!section) throw new NotFoundError("Section not found");
  const lesson = section.lessons?.id ? section.lessons.id(lessonId) : section.lessons?.find?.((l) => (l._id || l.id)?.toString() === lessonId);
  if (!lesson) throw new NotFoundError("Lesson not found");
  return lesson;
};
