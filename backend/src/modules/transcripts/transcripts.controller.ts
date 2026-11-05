import { Request, Response, NextFunction } from "express";
import { getStudentTranscriptService } from "./transcripts.service.js";
import { UnauthorizedError, ForbiddenError } from "../../core/errors/customErrors.js";
import Course from "../../models/Course.js";

export const getMyTranscript = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.user!.userId;
    const data = await getStudentTranscriptService(studentId);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentTranscript = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.params.studentId as string;
    const currentUserId = req.user!.userId;
    const role = req.user?.role;

    // Students can only view their own transcript
    if (role === "student" && currentUserId !== studentId) {
      throw new UnauthorizedError("Forbidden: Cannot view another student's transcript");
    }

    // Faculty members can only view transcripts of students assigned to their courses
    if (role === "teacher") {
      const isAssigned = await Course.exists({
        teachers: currentUserId,
        "students.student": studentId,
      });
      if (!isAssigned) {
        throw new ForbiddenError("Forbidden: Cannot view transcript of unassigned student");
      }
    }

    const data = await getStudentTranscriptService(studentId);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
