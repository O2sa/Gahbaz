import Semester from "../../models/Semester.js";
import SemesterTemplate from "../../models/SemesterTemplate.js";
import Student from "../../models/Student.js";
import Course from "../../models/Course.js";
import Section from "../../models/Section.js";
import Subject from "../../models/Subject.js";
import Grade from "../../models/Grade.js";
import Chat from "../../models/Chat.js";
import { NotFoundError } from "../../core/errors/customErrors.js";

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
