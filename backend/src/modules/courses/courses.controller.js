import * as svc from "./courses.service.js";
import { sendSuccess, sendCreated, sendNoContent } from "../../core/utils/response.utils.js";

export const createCourse = async (req, res) => {
  const data = await svc.createCourseService(req.body);
  sendCreated(res, data);
};

export const getCourse = async (req, res) => {
  const data = await svc.getCourseByIdService(req.params.id);
  sendSuccess(res, data);
};

export const updateCourse = async (req, res) => {
  const data = await svc.updateCourseService(req.params.id, req.body);
  sendSuccess(res, data);
};

export const deleteCourse = async (req, res) => {
  await svc.deleteCourseService(req.params.id);
  sendNoContent(res);
};

export const getUserCourses = async (req, res) => {
  const data = await svc.getUserCoursesService(req.user);
  sendSuccess(res, data);
};

// Sections & Lessons
export const createSection = async (req, res) => {
  const data = await svc.createSectionService(req.body);
  sendCreated(res, data);
};

export const getSection = async (req, res) => {
  const data = await svc.getSectionByIdService(req.params.id);
  sendSuccess(res, data);
};

export const updateSection = async (req, res) => {
  const data = await svc.updateSectionService(req.params.id, req.body);
  sendSuccess(res, data);
};

export const deleteSection = async (req, res) => {
  await svc.deleteSectionService(req.params.id);
  sendNoContent(res);
};

export const addLesson = async (req, res) => {
  const data = await svc.addLessonService(req.params.sectionId, req.body);
  sendCreated(res, data);
};

export const updateLesson = async (req, res) => {
  const data = await svc.updateLessonService(req.params.sectionId, req.params.lessonId, req.body);
  sendSuccess(res, data);
};

export const deleteLesson = async (req, res) => {
  await svc.deleteLessonService(req.params.sectionId, req.params.lessonId);
  sendNoContent(res);
};
