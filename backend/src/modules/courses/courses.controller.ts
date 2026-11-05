import { Request, Response } from "express";
import * as svc from "./courses.service.js";
import Course from "../../models/Course.js";
import {
  sendPaginated,
  sendSuccess,
  sendCreated,
  sendNoContent,
} from "../../core/utils/response.utils.js";

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  const universityId =
    req.user?.role === "super-admin"
      ? (req.user?.universityId || req.body.university)
      : req.user?.universityId;
  const data = await svc.createCourseService({ ...req.body, university: universityId });
  sendCreated(res, data);
};

export const getCourse = async (req: Request, res: Response): Promise<void> => {
  const universityId = req.user?.universityId || null;
  const id = (req.params.id || req.params.courseId) as string;
  const data = await svc.getCourseByIdService(id, universityId);
  sendSuccess(res, data);
};

export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  const universityId = req.user?.universityId || null;
  const isRequesterAdmin = req.user?.role === "admin" || req.user?.role === "super-admin";
  const body = { ...req.body };
  if (!isRequesterAdmin && body.teachers !== undefined) {
    delete body.teachers;
  }
  const data = await svc.updateCourseService(req.params.id as string, body, universityId);
  sendSuccess(res, data);
};

export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  const universityId = req.user?.universityId || null;
  await svc.deleteCourseService(req.params.id as string, universityId);
  sendNoContent(res);
};

export const getUserCourses = async (req: Request, res: Response): Promise<void> => {
  const { data, meta } = await svc.getUserCoursesService(req.user, req.query);
  sendPaginated(res, data, meta);
};

export const getSemesterCourses = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.getCoursesBySemesterService(req.params.semesterId as string);
  sendSuccess(res, data);
};

// Sections & Lessons
export const createSection = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.createSectionService(req.body);
  sendCreated(res, data);
};

export const getSection = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  try {
    const data = await svc.getSectionByIdService(id);
    sendSuccess(res, data);
    return;
  } catch (err) {
    try {
      const isCourse = await Course.exists({ _id: id });
      if (isCourse) {
        const courseSections = await svc.getSectionsByCourseService(id);
        sendSuccess(res, courseSections || []);
        return;
      }
    } catch {
      // Ignore potential cast error or failure querying Course
    }

    const courseSections = await svc.getSectionsByCourseService(id).catch(() => []);
    if (courseSections && courseSections.length > 0) {
      sendSuccess(res, courseSections);
      return;
    }
    throw err;
  }
};

export const updateSection = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.updateSectionService(req.params.id as string, req.body);
  sendSuccess(res, data);
};

export const deleteSection = async (req: Request, res: Response): Promise<void> => {
  await svc.deleteSectionService(req.params.id as string);
  sendNoContent(res);
};

export const getLesson = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.getLessonService(req.params.sectionId as string, req.params.lessonId as string);
  sendSuccess(res, data);
};

export const addLesson = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.addLessonService(req.params.sectionId as string, req.body);
  sendCreated(res, data);
};

export const updateLesson = async (req: Request, res: Response): Promise<void> => {
  const data = await svc.updateLessonService(
    req.params.sectionId as string,
    req.params.lessonId as string,
    req.body
  );
  sendSuccess(res, data);
};

export const deleteLesson = async (req: Request, res: Response): Promise<void> => {
  await svc.deleteLessonService(req.params.sectionId as string, req.params.lessonId as string);
  sendNoContent(res);
};
