import { getStudentTranscriptService } from "./transcripts.service.js";
import { UnauthorizedError } from "../../core/errors/customErrors.js";

export const getMyTranscript = async (req, res, next) => {
  try {
    const studentId = req.user?.id || req.user?.userId;
    const data = await getStudentTranscriptService(studentId);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentTranscript = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const currentUserId = req.user?.id || req.user?.userId;
    const role = req.user?.role;

    // Students can only view their own transcript
    if (role === "student" && currentUserId !== studentId) {
      throw new UnauthorizedError("Forbidden: Cannot view another student's transcript");
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
