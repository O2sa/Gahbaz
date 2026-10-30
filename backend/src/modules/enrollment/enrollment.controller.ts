import { Request, Response, NextFunction } from "express";
import {
  getAvailableCoursesService,
  getMyEnrolledCoursesService,
  registerCourseService,
  dropCourseService,
} from "./enrollment.service.js";

export const getAvailableCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.user!.userId;
    const data = await getAvailableCoursesService(studentId, req.query);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyEnrolledCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.user!.userId;
    const data = await getMyEnrolledCoursesService(studentId, req.query);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const registerCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.user!.userId;
    const { courseId } = req.body;
    const data = await registerCourseService(studentId, courseId);
    res.status(200).json({
      success: true,
      message: "Enrolled in course successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const dropCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.user!.userId;
    const { courseId } = req.body;
    const data = await dropCourseService(studentId, courseId);
    res.status(200).json({
      success: true,
      message: "Dropped course successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
