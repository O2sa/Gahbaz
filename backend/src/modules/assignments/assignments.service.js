import Assignment from "../../models/Assignment.js";
import Submission from "../../models/Submission.js";
import Course from "../../models/Course.js";
import Grade from "../../models/Grade.js";
import { NotFoundError, BadRequestError } from "../../core/errors/customErrors.js";
import { paginateQuery, parsePagination } from "../../core/utils/pagination.utils.js";

export const createAssignmentService = async ({ courseId, data, teacherId, universityId }) => {
  const courseQuery = universityId ? { _id: courseId, university: universityId } : { _id: courseId };
  const course = await Course.findOne(courseQuery);
  if (!course) throw new NotFoundError("Course not found");

  return Assignment.create({
    ...data,
    course: courseId,
    teacher: teacherId,
    university: universityId || course.university,
  });
};

export const getCourseAssignmentsService = async (courseId, universityId = null, query = {}) => {
  const filter = { course: courseId };
  if (universityId) filter.university = universityId;
  const { page, limit } = parsePagination(query);
  return paginateQuery(Assignment, filter, { page, limit, sort: { dueDate: 1 } });
};

export const getAssignmentByIdService = async (id, universityId = null) => {
  const query = universityId ? { _id: id, university: universityId } : { _id: id };
  const assignment = await Assignment.findOne(query).populate("course").populate("teacher");
  if (!assignment) throw new NotFoundError("Assignment not found");
  return assignment;
};

export const updateAssignmentService = async (id, data, universityId = null) => {
  const query = universityId ? { _id: id, university: universityId } : { _id: id };
  const assignment = await Assignment.findOneAndUpdate(query, data, { new: true });
  if (!assignment) throw new NotFoundError("Assignment not found");
  return assignment;
};

export const deleteAssignmentService = async (id, universityId = null) => {
  const query = universityId ? { _id: id, university: universityId } : { _id: id };
  const assignment = await Assignment.findOneAndDelete(query);
  if (!assignment) throw new NotFoundError("Assignment not found");

  await Submission.deleteMany({ assignment: assignment._id });
  return assignment;
};

export const submitAssignmentService = async ({ assignmentId, studentId, universityId, data }) => {
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw new NotFoundError("Assignment not found");

  const isLate = new Date() > new Date(assignment.dueDate);
  const status = isLate ? "late" : "submitted";

  const submission = await Submission.findOneAndUpdate(
    { assignment: assignmentId, student: studentId },
    {
      assignment: assignmentId,
      course: assignment.course,
      student: studentId,
      university: universityId || assignment.university,
      fileUrl: data.fileUrl,
      notes: data.notes || "",
      submittedAt: new Date(),
      status,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return submission;
};

export const getAssignmentSubmissionsService = async (assignmentId, universityId = null) => {
  const filter = { assignment: assignmentId };
  if (universityId) filter.university = universityId;
  return Submission.find(filter).populate("student", "firstName lastName email").sort({ submittedAt: -1 });
};

export const getStudentSubmissionService = async (assignmentId, studentId) => {
  const submission = await Submission.findOne({ assignment: assignmentId, student: studentId });
  if (!submission) throw new NotFoundError("Submission not found");
  return submission;
};

export const gradeSubmissionService = async ({ submissionId, grade, feedback, teacherId, universityId }) => {
  const query = universityId ? { _id: submissionId, university: universityId } : { _id: submissionId };
  const submission = await Submission.findOne(query);
  if (!submission) throw new NotFoundError("Submission not found");

  submission.grade = grade;
  submission.feedback = feedback || "";
  submission.status = "graded";
  submission.gradedBy = teacherId;
  submission.gradedAt = new Date();
  await submission.save();

  return submission;
};
