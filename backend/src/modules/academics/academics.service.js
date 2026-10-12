import mongoose from "mongoose";
import College from "../../models/College.js";
import Major from "../../models/Major.js";
import Subject from "../../models/Subject.js";
import SemesterTemplate from "../../models/SemesterTemplate.js";
import Semester from "../../models/Semester.js";
import Course from "../../models/Course.js";
import Section from "../../models/Section.js";
import Grade from "../../models/Grade.js";
import Student from "../../models/Student.js";
import Teacher from "../../models/Teacher.js";
import Admin from "../../models/Admin.js";
import Chat from "../../models/Chat.js";

import { NotFoundError, BadRequestError } from "../../core/errors/customErrors.js";
import { generateSecurePassword, hashPassword } from "../../core/utils/password.utils.js";
import sendMail from "../../config/mailer.js";

// ======================== COLLEGES ========================
export const createCollegeService = async (data, universityId) => {
  return College.create({ ...data, university: universityId });
};

export const getCollegesService = async (universityId) => {
  return College.find({ university: universityId });
};

export const getCollegeByIdService = async (id, universityId) => {
  const college = await College.findOne({ _id: id, university: universityId }).populate("majors");
  if (!college) throw new NotFoundError("College not found");
  return college;
};

export const updateCollegeService = async (id, data, universityId) => {
  const college = await College.findOneAndUpdate(
    { _id: id, university: universityId },
    data,
    { new: true, runValidators: true }
  );
  if (!college) throw new NotFoundError("College not found");
  return college;
};

export const deleteCollegeService = async (id, universityId) => {
  const college = await College.findOneAndDelete({ _id: id, university: universityId });
  if (!college) throw new NotFoundError("College not found");

  const majors = await Major.find({ college: college._id });
  for (const m of majors) {
    await SemesterTemplate.deleteMany({ major: m._id });
  }
  await Major.deleteMany({ college: college._id });
  await Subject.deleteMany({ college: college._id });
  return college;
};

// Aliases for college services
export const createCollageService = createCollegeService;
export const getCollagesService = getCollegesService;
export const getCollageByIdService = getCollegeByIdService;
export const updateCollageService = updateCollegeService;
export const deleteCollageService = deleteCollegeService;

// ======================== MAJORS ========================
export const createMajorService = async (data, universityId) => {
  const newMajor = await Major.create(data);
  const college = await College.findById(newMajor.college || newMajor.collage);
  if (college) {
    const templatePromises = [];
    for (let s = 0; s < college.numberOfSemesters; s++) {
      templatePromises.push(
        SemesterTemplate.create({
          name: `الفصل ${s + 1}, ${newMajor.name}`,
          major: newMajor._id,
          index: s,
        })
      );
    }
    const createdTemplates = await Promise.all(templatePromises);
    newMajor.semesterTemplates = createdTemplates.map((t) => t._id);
    await newMajor.save();
  }
  return newMajor;
};

export const getMajorsService = async (filter = {}) => {
  return Major.find(filter).populate("semesterTemplates");
};

export const getMajorByIdService = async (id) => {
  const major = await Major.findById(id).populate("semesterTemplates");
  if (!major) throw new NotFoundError("Major not found");
  return major;
};

export const updateMajorService = async (id, data) => {
  const major = await Major.findByIdAndUpdate(id, data, { new: true });
  if (!major) throw new NotFoundError("Major not found");
  return major;
};

export const deleteMajorService = async (id) => {
  const major = await Major.findByIdAndDelete(id);
  if (!major) throw new NotFoundError("Major not found");
  await SemesterTemplate.deleteMany({ major: major._id });
  return major;
};

// ======================== SEMESTER TEMPLATES ========================
export const createSemesterTemplateService = async (data) => {
  return SemesterTemplate.create(data);
};

export const getSemesterTemplatesService = async (filter = {}) => {
  return SemesterTemplate.find(filter).populate("subjects");
};

export const getSemesterTemplateByIdService = async (id) => {
  const template = await SemesterTemplate.findById(id).populate("subjects");
  if (!template) throw new NotFoundError("Semester template not found");
  return template;
};

export const updateSemesterTemplateService = async (id, data) => {
  const template = await SemesterTemplate.findByIdAndUpdate(id, data, { new: true });
  if (!template) throw new NotFoundError("Semester template not found");
  return template;
};

export const deleteSemesterTemplateService = async (id) => {
  const template = await SemesterTemplate.findByIdAndDelete(id);
  if (!template) throw new NotFoundError("Semester template not found");
  return template;
};

// ======================== SUBJECTS ========================
export const createSubjectService = async (data, universityId) => {
  return Subject.create({ ...data, university: universityId });
};

export const getSubjectsService = async (filter = {}) => {
  return Subject.find(filter).populate("teachers");
};

export const getSubjectByIdService = async (id) => {
  const subject = await Subject.findById(id).populate("teachers");
  if (!subject) throw new NotFoundError("Subject not found");
  return subject;
};

export const updateSubjectService = async (id, data) => {
  const subject = await Subject.findByIdAndUpdate(id, data, { new: true });
  if (!subject) throw new NotFoundError("Subject not found");
  return subject;
};

export const deleteSubjectService = async (id) => {
  const subject = await Subject.findByIdAndDelete(id);
  if (!subject) throw new NotFoundError("Subject not found");
  return subject;
};

// ======================== ADMINS ========================
export const getAdminsService = async (universityId) => {
  return Admin.find({ university: universityId }).select("-password");
};

export const getAdminByIdService = async (id, universityId) => {
  const admin = await Admin.findOne({ _id: id, university: universityId }).select("-password");
  if (!admin) throw new NotFoundError("Admin not found");
  return admin;
};

export const createAdminService = async (data, universityId) => {
  const tempPassword = generateSecurePassword(8);
  const hashedPassword = await hashPassword(tempPassword);

  const admin = await Admin.create({
    ...data,
    university: universityId,
    role: "admin",
    password: hashedPassword,
  });

  await sendMail(
    admin.email,
    "Gahbaz Admin Account Created",
    `Your admin account has been created with temporary password: ${tempPassword}\nPlease change it upon login.`
  );

  return Admin.findById(admin._id).select("-password");
};

export const updateAdminService = async (id, data, universityId) => {
  const updatedAdmin = await Admin.findOneAndUpdate(
    { _id: id, university: universityId },
    data,
    { new: true }
  ).select("-password");
  if (!updatedAdmin) throw new NotFoundError("Admin not found");
  return updatedAdmin;
};

export const deleteAdminService = async (id, universityId) => {
  const removed = await Admin.findOneAndDelete({ _id: id, university: universityId }).select("-password");
  if (!removed) throw new NotFoundError("Admin not found");
  return removed;
};

// ======================== TEACHERS ========================
export const getTeachersService = async (universityId) => {
  return Teacher.find({ university: universityId }).select("-password");
};

export const getTeacherByIdService = async (id, universityId) => {
  const teacher = await Teacher.findOne({ _id: id, university: universityId }).select("-password");
  if (!teacher) throw new NotFoundError("Teacher not found");
  return teacher;
};

export const createTeacherService = async (data, universityId) => {
  const tempPassword = generateSecurePassword(8);
  const hashedPassword = await hashPassword(tempPassword);

  const teacher = await Teacher.create({
    ...data,
    university: universityId,
    password: hashedPassword,
  });

  await sendMail(
    teacher.email,
    "Gahbaz Teacher Account Created",
    `Your teacher account has been created with temporary password: ${tempPassword}\nPlease change it upon login.`
  );

  return Teacher.findById(teacher._id).select("-password");
};

export const updateTeacherService = async (id, data, universityId) => {
  const updatedTeacher = await Teacher.findOneAndUpdate(
    { _id: id, university: universityId },
    data,
    { new: true }
  ).select("-password");
  if (!updatedTeacher) throw new NotFoundError("Teacher not found");
  return updatedTeacher;
};

export const deleteTeacherService = async (id, universityId) => {
  const removed = await Teacher.findOneAndDelete({ _id: id, university: universityId });
  if (!removed) throw new NotFoundError("Teacher not found");
  return removed;
};

// ======================== STUDENTS ========================
export const getStudentsService = async (universityId) => {
  return Student.find({ university: universityId })
    .select("-password")
    .populate("major");
};

export const getStudentByIdService = async (id, universityId) => {
  const student = await Student.findOne({ _id: id, university: universityId })
    .select("-password")
    .populate("major");
  if (!student) throw new NotFoundError("Student not found");
  return student;
};

export const createStudentService = async (data, universityId) => {
  const tempPassword = generateSecurePassword(8);
  const hashedPassword = await hashPassword(tempPassword);

  const student = await Student.create({
    ...data,
    university: universityId,
    password: hashedPassword,
  });

  await sendMail(
    student.email,
    "Welcome to Gahbaz - Your Temporary Password",
    `Hello ${student.firstName},\n\nYour account has been created with temporary password: ${tempPassword}\nPlease change it after logging in.`
  );

  return Student.findById(student._id).select("-password");
};

export const updateStudentService = async (id, data, universityId) => {
  const student = await Student.findOneAndUpdate(
    { _id: id, university: universityId },
    data,
    { new: true }
  ).select("-password");
  if (!student) throw new NotFoundError("Student not found");
  return student;
};

export const deleteStudentService = async (id, universityId) => {
  const student = await Student.findOneAndDelete({ _id: id, university: universityId });
  if (!student) throw new NotFoundError("Student not found");

  await Semester.updateMany({ students: student._id }, { $pull: { students: student._id } });
  await Grade.deleteMany({ student: student._id });
  return student;
};

// ======================== SEMESTERS ========================
export const getAllSemestersService = async (universityId) => {
  return Semester.find({ university: universityId }).populate({
    path: "major",
    populate: { path: "college" },
  });
};

export const getSemesterByIdService = async (id) => {
  const semester = await Semester.findById(id).populate("courses");
  if (!semester) throw new NotFoundError("Semester not found");
  return semester;
};

export const updateSemesterService = async (id, data) => {
  const semester = await Semester.findByIdAndUpdate(id, data, { new: true });
  if (!semester) throw new NotFoundError("Semester not found");
  return semester;
};

export const deleteSemesterService = async (id) => {
  const semester = await Semester.findByIdAndDelete(id);
  if (!semester) throw new NotFoundError("Semester not found");

  await Student.updateMany({ semesters: semester._id }, { $pull: { semesters: semester._id } });
  await Course.deleteMany({ semester: semester._id });
  if (semester.courses && semester.courses.length > 0) {
    await Section.deleteMany({ course: { $in: semester.courses } });
  }
  return semester;
};

export const endSemesterService = async (id) => {
  const semester = await Semester.findByIdAndUpdate(id, { completed: true }, { new: true });
  if (!semester) throw new NotFoundError("Semester not found");
  if (semester.template) {
    await SemesterTemplate.findByIdAndUpdate(semester.template, { active: false });
  }
  return semester;
};

export const startSemesterService = async ({ semesterData, semesters }, universityId) => {
  let usedStudents = [];
  const semesterTemplates = await SemesterTemplate.find({ _id: { $in: semesters } });

  for (const template of semesterTemplates) {
    const students = await Student.find({
      comingSemester: template.index,
      major: template.major,
      _id: { $nin: usedStudents },
    });

    if (students.length > 0 && template.subjects.length > 0) {
      const subjects = await Subject.find({ _id: { $in: template.subjects } });

      const newSemester = new Semester({
        name: template.name,
        major: template.major,
        template: template._id,
        university: universityId,
        ...semesterData,
      });
      await newSemester.save();

      await SemesterTemplate.findByIdAndUpdate(template._id, { active: true });

      const newCourses = await Promise.all(
        subjects.map(async (subject) => {
          const newCourse = new Course({
            name: subject.name,
            subtitle: subject.subtitle,
            category: subject.category,
            gradeSchema: subject.gradeSchema,
            semester: newSemester._id,
            teachers: subject.teachers,
          });
          await newCourse.save();

          // Create group chat
          const chatUsers = [...students.map((s) => s._id), ...(newCourse.teachers || [])];
          await Chat.create({
            chatName: `دورة ${newCourse.name}`,
            users: chatUsers,
            isGroupChat: true,
            groupAdmin: newCourse.teachers?.[0] || chatUsers[0],
            university: universityId,
          });

          return newCourse;
        })
      );

      for (const student of students) {
        student.comingSemester += 1;
        student.semesters.push(newSemester._id);
        await student.save();

        await Promise.all(
          newCourses.map(async (course) => {
            const newGrade = new Grade({
              student: student._id,
              course: course._id,
            });
            await newGrade.save();
          })
        );
      }

      newSemester.courses = newCourses.map((c) => c._id);
      newSemester.students = students.map((s) => s._id);
      await newSemester.save();

      usedStudents = [...usedStudents, ...students.map((s) => s._id)];
    }
  }

  return { success: true };
};

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

// ======================== GRADES ========================
export const getGradeByIdService = async (id) => {
  const grade = await Grade.findById(id);
  if (!grade) throw new NotFoundError("Grade not found");
  return grade;
};

export const getGradesByCourseService = async (courseId) => {
  return Grade.find({ course: courseId }).populate("student");
};

export const getStudentGradesService = async (studentId) => {
  const student = await Student.findById(studentId).populate("semesters");
  if (!student) throw new NotFoundError("Student not found");

  const results = [];
  for (const semester of student.semesters || []) {
    const grades = await Grade.find({
      course: { $in: semester.courses },
      student: studentId,
    }).populate("course");
    results.push({ semester, grades });
  }
  return results;
};

export const updateGradeService = async (gradeId, gradeData) => {
  const gradeDoc = await Grade.findById(gradeId);
  if (!gradeDoc) throw new NotFoundError("Grade not found");

  const course = await Course.findById(gradeDoc.course);
  await gradeDoc.updateGrade(gradeData, course?.gradeSchema);
  return gradeDoc;
};
