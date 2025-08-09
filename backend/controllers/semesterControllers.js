import { StatusCodes } from "http-status-codes";
import Semester from "../models/Semester.js";
import Major from "../models/Major.js";
import SemesterTemp from "../models/SemesterTemp.js";
import Subject from "../models/Subject.js";
import Course from "../models/Course.js";
import Student from "../models/Student.js";
import Collage from "../models/Collage.js";
import Grade from "../models/Grade.js";
import Section from "../models/Section.js";
import Chat from "../models/chatModel.js";

const getSemester = async (req, res) => {
  const semId = req.params.semId;
  const semester = await Semester.findById(semId).populate("courses");

  // const cs = semester.populate("courses").exec();
  console.log(semester);
  res.status(StatusCodes.OK).json(semester);
};

const getAllSemesters = async (req, res) => {
  const semesters = await Semester.find({
    university: req.user.university,
  }).populate({
    path: "major",
    populate: {
      path: "collage",
      // model: "Collage",
    },
  });
  res.status(StatusCodes.OK).json(semesters);
};

const deleteSemester = async (req, res) => {
  const semId = req.params.semId;

  const semester = await Semester.findByIdAndDelete(semId);

  await Student.updateMany(
    { semesters: semester._id },
    { $pull: { semesters: semester._id } }
  );
  await Course.deleteMany({ semester: semester._id });
  await Section.deleteMany({
    course: {
      $in: semester.courses,
    },
  });
  res.status(StatusCodes.OK).json();
};

const updateSemester = async (req, res) => {
  const semId = req.params.semId;
  const semester = await Semester.findByIdAndUpdate(semId, req.body);
  res.status(StatusCodes.OK).json();
};
const endSemester = async (req, res) => {
  const semId = req.params.semId;
  const semester = await Semester.findByIdAndUpdate(semId, { completed: true });
  await SemesterTemp.findByIdAndUpdate(semester.template, { active: false });
  res.status(StatusCodes.OK).json();
};

const createSemester = async (req, res) => {
  res.status(StatusCodes.OK).json();
};

const getSemesterCourses = async (req, res) => {
  const id = req.params.id;
  const courses = await Semester.findByIdAndUpdate(id, req.body);
  res.status(StatusCodes.OK).json();
};

const startSemester = async (req, res) => {
  const { semesterData, semesters } = req.body;
  semesterData.university = req.user.university;

  console.log("semesters", semesters);
  let usedStudents = [];
  const semesterTemplates = await SemesterTemp.find({
    _id: {
      $in: semesters,
    },
  });
  console.log("semesterTemplates", semesterTemplates);

  for (const template of semesterTemplates) {
    const students = await Student.find({
      comingSemester: template.index,
      major: template.major,
      _id: { $nin: usedStudents },
    });
    console.log("students", students);

    if (students.length > 0 && template.subjects.length > 0) {
      const dStudents = await createSemesterFromTemplate(
        semesterData,
        template,
        students
      );
      usedStudents = [...usedStudents, ...dStudents];
    }
  }

  res.status(StatusCodes.OK).json();
};

export const createSemesterFromTemplate = async (
  semesterData,
  template,
  students
) => {
  console.log("template", template);
  try {
    const subjects = await Subject.find({
      _id: {
        $in: template.subjects,
      },
    });

    const newSemester = new Semester({
      name: template.name,
      major: template.major,
      template: template._id,
      ...semesterData,
    });

    await newSemester.save();

    await SemesterTemp.findByIdAndUpdate(template._id, { active: true });
    const coursesSchemas = {};

    const newCourses = await Promise.all(
      subjects.map(async (subject) => {
        const newCourse = new Course({
          ...subject.toObject(),
          _id: undefined,
          semester: newSemester._id,
        });

        await newCourse.save();
        coursesSchemas[newCourse._id] = getSchemaTemplate(
          subject.gradeSchema.grade
        );

        var users = [...students,...newCourse?.teachers];

        const groupChat = await Chat.create({
          chatName: `دورة ${newCourse?.name}`,
          users: users,
          isGroupChat: true,
          // groupPic: groupPicUrl,
          groupAdmin: newCourse?.teachers[0],
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
            grade: coursesSchemas[course._id],
            student: student._id,
            course: course._id,
          });

          await newGrade.save();
        })
      );
    }

    // Update new semester with the new courses
    newSemester.courses = newCourses.map((course) => course._id);
    const semesterStudents = students.map((student) => student._id);
    newSemester.students = semesterStudents;
    await newSemester.save();

    return semesterStudents;
  } catch (error) {
    throw error;
  }
};

const getSchemaTemplate = (schema) => {
  for (const item in schema) schema[item] = { ...schema[item], value: 0 };
  return schema;
};

export {
  getAllSemesters,
  startSemester,
  getSemester,
  createSemester,
  deleteSemester,
  getSemesterCourses,
  updateSemester,
  endSemester
};
