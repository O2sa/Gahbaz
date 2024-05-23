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
const getSemester = async (req, res) => {
  const semId = req.params.semId;
  const semester = await Semester.findById(semId).populate("courses");

  // const cs = semester.populate("courses").exec();
  console.log(semester);
  res.status(StatusCodes.OK).json(semester);
};

const getAllSemesters = async (req, res) => {
  const semesters = await Semester.find({ university: req.user.universityId });
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
const createSemester = async (req, res) => {
  res.status(StatusCodes.OK).json();
};

const getSemesterCourses = async (req, res) => {
  const id = req.params.id;
  const courses = await Semester.findByIdAndUpdate(id, req.body);
  res.status(StatusCodes.OK).json();
};

const startSemester = async (req, res) => {
  const { semesterData, collages } = req.body;
  semesterData.university = req.user.universityId;

  for (const collageId of collages) {
    const collageData = await Collage.findById(collageId);

    const majors = await Major.find({ collage: collageData._id });

    for (const major of majors) {
      let usedStudents = [];
      const semesterTemplates = await SemesterTemp.find({
        _id: {
          $in: major.semesterTemplates,
        },
      });
      for (const template of semesterTemplates) {
        const students = await Student.find({
          comingSemester: template.index,
          major: major._id,
          _id: { $nin: usedStudents },
        });
        template.major = major._id;
        if (students.length > 0 && template.subjects.length > 0) {
          const dStudents = await createSemesterFromTemplate(
            semesterData,
            template,
            students
          );
          usedStudents = [...usedStudents, ...dStudents];
        }
      }
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
      name: template.name.toString(),
      major: template._id.toString(),
      ...semesterData,
    });

    await newSemester.save();

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
};
